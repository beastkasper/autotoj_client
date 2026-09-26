"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { userStore } from '@/lib/add-listing/userStore';
import { useDicts, useBrandCascade } from '@/lib/add-listing/dicts';
import { pickPhotos } from '@/lib/add-listing/photoPicker';
import { buildCarPayload, type VehiclePublishData } from '@/lib/add-listing/vehiclePayload';
import {
  cascadeId,
  withFallback,
  FALLBACK_BODY_TYPES,
  FALLBACK_STEERING_POSITIONS,
} from '@/lib/add-listing/dictFallbacks';
import { useGetModelsQuery } from '@/lib/features/dicts/dictsApi';
import type { Brand, DictItem, Model } from '@/lib/types/api';

import { AddListingHeader } from '@/components/add-listing/AddListingHeader';
import { PreviewStep } from '@/components/add-listing/PreviewStep';
import { SelectionStep } from '@/components/add-listing/steps/SelectionStep';
import { InputStep } from '@/components/add-listing/steps/InputStep';
import { PhotosStep } from '@/components/add-listing/steps/PhotosStep';
import { HistoryStep } from '@/components/add-listing/steps/HistoryStep';
import { DescriptionStep } from '@/components/add-listing/steps/DescriptionStep';
import { PriceStep } from '@/components/add-listing/steps/PriceStep';
import { ContactsStep, FALLBACK_CITIES, findCity } from '@/components/add-listing/steps/ContactsStep';
import { EquipmentStep } from '@/components/add-listing/steps/EquipmentStep';

// ─── Static data (no API equivalent) ────────────────────────────────────────

/** Бэкенд на submit требует year ≥ 1980. Верхняя граница — текущий год. */
const MIN_YEAR = 1980;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_LIST = Array.from({ length: CURRENT_YEAR - MIN_YEAR + 1 }, (_, i) => (CURRENT_YEAR - i).toString());

/** Бэкенд принимает не больше 30 фото на объявление (photos[:30]). */
const MAX_PHOTOS = 30;

/** Объём двигателя легкового авто, л (бэкенд значения > 30 считает см³). */
const ENGINE_VOLUME_MIN = 0.1;
const ENGINE_VOLUME_MAX = 10;
/** Мощность, л.с.: 4 цифры (колонка power INTEGER). */
const POWER_MAX_DIGITS = 4;

/**
 * '2,0' → '2.0'. С русской раскладкой десятичный разделитель — запятая;
 * раньше она вырезалась, и «2,0» уходило как 20 л. Оставляем один
 * разделитель, до 2 цифр целой части и 1 после точки.
 */
function sanitizeEngineVolume(value: string): string {
  const cleaned = value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const dot = cleaned.indexOf('.');
  const intPart = (dot === -1 ? cleaned : cleaned.slice(0, dot)).replace(/^0+(?=\d)/, '').slice(0, 2);
  if (dot === -1) return intPart;
  const fracPart = cleaned.slice(dot + 1).replace(/\./g, '').slice(0, 1);
  return `${intPart || '0'}.${fracPart}`;
}

/**
 * Запасные списки обязательных шагов: если /dicts не загрузился или отдал
 * пустой список, шаг без allowCustom/onSkip нельзя пройти. Ids — как на
 * проде /dicts (fwd/rwd/awd, gas_petrol).
 */
const CAR_FALLBACK_FUEL_TYPES: DictItem[] = [
  { id: 'petrol', name: 'Бензин' },
  { id: 'diesel', name: 'Дизель' },
  { id: 'hybrid', name: 'Гибрид' },
  { id: 'electric', name: 'Электро' },
  { id: 'gas_petrol', name: 'Газ/Бензин' },
];
const CAR_FALLBACK_DRIVE_TYPES: DictItem[] = [
  { id: 'fwd', name: 'Передний' },
  { id: 'rwd', name: 'Задний' },
  { id: 'awd', name: 'Полный' },
];
const FALLBACK_TRANSMISSION_TYPES: DictItem[] = [
  { id: 'automatic', name: 'Автомат' },
  { id: 'manual', name: 'Механика' },
  { id: 'robot', name: 'Робот' },
  { id: 'cvt', name: 'Вариатор' },
];
const FALLBACK_COLORS: DictItem[] = [
  { id: 'white', name: 'Белый' },
  { id: 'black', name: 'Чёрный' },
  { id: 'gray', name: 'Серый' },
  { id: 'silver', name: 'Серебристый' },
  { id: 'red', name: 'Красный' },
  { id: 'blue', name: 'Синий' },
  { id: 'green', name: 'Зелёный' },
  { id: 'brown', name: 'Коричневый' },
  { id: 'beige', name: 'Бежевый' },
  { id: 'yellow', name: 'Жёлтый' },
  { id: 'orange', name: 'Оранжевый' },
  { id: 'purple', name: 'Фиолетовый' },
];
const FALLBACK_CONDITIONS: DictItem[] = [
  { id: 'new', name: 'Новый' },
  { id: 'used', name: 'С пробегом' },
];

/** Список из API (или запасной) без повторов id и подписей ('gray'/'grey'). */
function selectItems(list: DictItem[] | null | undefined, fallback: DictItem[]) {
  const preferred = new Set(fallback.map(f => f.id));
  const seenIds = new Set<string>();
  const byName = new Map<string, DictItem>();
  const order: string[] = [];
  for (const item of withFallback(list, fallback)) {
    if (!item?.id || seenIds.has(item.id)) continue;
    seenIds.add(item.id);
    const key = (item.name ?? '').trim().toLowerCase() || item.id;
    const existing = byName.get(key);
    if (!existing) {
      byName.set(key, item);
      order.push(key);
    } else if (!preferred.has(existing.id) && preferred.has(item.id)) {
      byName.set(key, item);
    }
  }
  return order.map(key => {
    const d = byName.get(key) as DictItem;
    return { value: d.id, label: d.name };
  });
}

/**
 * На проде часть марок заведена дважды: Toyota vehicle_type 'cars' (196 моделей)
 * и Toyota 'car' (8). В списке — одна запись на название (предпочитаем 'cars',
 * там полный список моделей), а id второй копии запоминаем, чтобы подмешать
 * её модели (например, Prado есть только у копии 'car').
 */
function dedupeBrands(brands: Brand[]) {
  const main = new Map<string, Brand>();
  const order: string[] = [];
  /** id показанной марки → id её копии. */
  const siblingOf = new Map<string, string>();
  for (const b of brands) {
    if (!b?.id) continue;
    const key = (b.name ?? '').trim().toLowerCase() || b.id;
    const existing = main.get(key);
    if (!existing) {
      main.set(key, b);
      order.push(key);
    } else if (existing.id !== b.id) {
      if (existing.vehicle_type !== 'cars' && b.vehicle_type === 'cars') {
        main.set(key, b);
        siblingOf.delete(existing.id);
        siblingOf.set(b.id, existing.id);
      } else if (!siblingOf.has(existing.id)) {
        siblingOf.set(existing.id, b.id);
      }
    }
  }
  return { unique: order.map(key => main.get(key) as Brand), siblingOf };
}

/** Модели обеих копий марки без повторов по названию (первыми — основной копии). */
function mergeModels(primary: Model[], extra: Model[]) {
  const seen = new Set<string>();
  const out: { value: string; label: string }[] = [];
  for (const m of [...primary, ...extra]) {
    if (!m?.id) continue;
    const key = (m.name ?? '').trim().toLowerCase() || m.id;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ value: m.id, label: m.name });
  }
  if (extra.length) out.sort((a, b) => a.label.localeCompare(b.label, 'ru'));
  return out;
}

// ─── Steps ──────────────────────────────────────────────────────────────────

const STEPS = {
  BRAND: 1,
  MODEL: 2,
  YEAR: 3,
  GENERATION: 4,
  BODY_TYPE: 5,
  ENGINE: 6,
  DRIVE: 7,
  TRANSMISSION: 8,
  ENGINE_VOLUME: 9,
  POWER: 10,
  COLOR: 11,
  CONDITION: 12,
  STEERING: 13,
  PHOTOS: 14,
  EQUIPMENT: 15,
  HISTORY: 16,
  VIN: 17,
  DESCRIPTION: 18,
  PRICE: 19,
  CONTACTS: 20,
  PREVIEW: 21,
} as const;

const TOTAL_STEPS = 21;

// ─── Component ──────────────────────────────────────────────────────────────

interface CarListingFormProps {
  onBack: () => void;
  onClose: () => void;
  /** Может вернуть Promise — пока он не завершится, кнопка публикации неактивна. */
  onPublish: (data: VehiclePublishData) => void | Promise<unknown>;
}

export function CarListingForm({ onBack, onClose, onPublish }: CarListingFormProps) {
  const { dicts } = useDicts();
  const [currentStep, setCurrentStep] = useState<number>(STEPS.BRAND);
  const [isPublishing, setIsPublishing] = useState(false);
  const publishingRef = useRef(false);

  const [formData, setFormData] = useState({
    // Backend: brand_id / model_id — we store labels, map to IDs on submit
    brand: '',
    model: '',
    year: '',
    generation: '',
    // Backend: body
    bodyType: '',
    // Backend: fuel
    engineType: '',
    // Backend: drive
    driveType: '',
    // Backend: transmission
    transmission: '',
    // Backend: engine_volume
    engineVolume: '',
    // Backend: power
    power: '',
    // Backend: color
    color: '',
    // Backend: condition
    condition: '',
    // Backend: steering_wheel
    steeringWheel: '',
    // Media
    photos: [] as string[],
    video: '',
    // Backend: options[]
    equipment: new Set<string>(),
    // Backend: mileage, pts, owners, is_damaged
    mileage: '',
    pts: '',
    owners: '',
    isDamaged: false,
    // Backend: vin
    vin: '',
    // Backend: description
    description: '',
    // Backend: price, negotiable, can_exchange
    price: '',
    canExchange: false,
    canNegotiate: false,
    // Backend: vehicle_status, is_customs_cleared, origin_country.
    // notCustomsCleared — переключатель «Не растаможен» на шаге «История
    // автомобиля»; в buildCarPayload уходит isCustomsCleared = !notCustomsCleared.
    // Раньше было isCustomsCleared: false без UI — каждое авто публиковалось
    // «Не растаможен» (бэкенд по умолчанию ставит true).
    vehicleStatus: 'available' as 'available' | 'on_order',
    notCustomsCleared: false,
    originCountry: '',
    // Backend: contact_name, contact_phone, contact_additional, city_id
    name: '',
    phone: '',
    city: '',
    contactAdditional: '',
    readyForOnlineViewing: false,
  });

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await userStore.getProfile();
      // GET /profile отдаёт город slug'ом ('dushanbe') — в форме и предпросмотре
      // держим русское название.
      const profileCity = profile.city
        ? findCity(FALLBACK_CITIES, profile.city)?.name ?? profile.city
        : '';
      setFormData(prev => ({
        ...prev,
        // Не затираем то, что пользователь уже успел ввести.
        name: prev.name || profile.name || '',
        phone: prev.phone || profile.phone || '',
        city: prev.city || profileCity,
      }));
    };
    loadProfile().catch(() => {});
  }, []);

  // Cascading brand → models from API. Uses internal in-memory cache.
  // Марка/модель, введённые вручную («Добавить своё»), хранятся именами —
  // их нельзя слать в /models?brand_id= (бэкенд ждёт UUID → 422), поэтому
  // каскад получает только UUID-значения.
  const { brands: apiBrands, models: apiModels, generations: apiGenerations } = useBrandCascade(
    'cars',
    cascadeId(formData.brand),
    cascadeId(formData.model)
  );
  const { unique: uniqueBrands, siblingOf: brandSiblingOf } = useMemo(
    () => dedupeBrands(apiBrands),
    [apiBrands]
  );
  const siblingBrandId = cascadeId(formData.brand) ? brandSiblingOf.get(formData.brand) : undefined;
  const { data: siblingModels } = useGetModelsQuery(
    { brand_id: siblingBrandId ?? '' },
    { skip: !siblingBrandId }
  );

  // ─── Navigation ─────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  }, []);

  const goBack = useCallback(() => {
    if (publishingRef.current) return;
    if (currentStep === STEPS.BRAND) {
      onBack();
    } else {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep, onBack]);

  const setField = useCallback(<K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const selectAndAdvance = useCallback(<K extends keyof typeof formData>(key: K) => {
    return (value: string) => {
      setFormData(prev => {
        if (key === 'brand' && prev.brand !== value) {
          return { ...prev, [key]: value, model: '', generation: '' } as typeof prev;
        }
        if (key === 'model' && prev.model !== value) {
          return { ...prev, [key]: value, generation: '' } as typeof prev;
        }
        return { ...prev, [key]: value };
      });
      goNext();
    };
  }, [goNext]);

  const handlePhotoUpload = useCallback(async () => {
    const uris = await pickPhotos({ remaining: MAX_PHOTOS - formData.photos.length });
    if (uris.length === 0) return;
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...uris].slice(0, MAX_PHOTOS),
    }));
  }, [formData.photos.length]);

  const removePhoto = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  }, []);

  const toggleEquipment = useCallback((item: string) => {
    setFormData(prev => {
      const next = new Set(prev.equipment);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return { ...prev, equipment: next };
    });
  }, []);

  const handlePublishConfirm = useCallback(async () => {
    // Двойной клик до перерисовки не должен создать два черновика.
    if (publishingRef.current) return;
    publishingRef.current = true;
    setIsPublishing(true);
    try {
      // formData holds API-shaped values: brand/model/generation are UUIDs (or
      // typed names), body/fuel/drive/transmission/color/condition/steering are
      // slugs, equipment is a set of option slugs. buildCarPayload renames them
      // into the PATCH /my/ads/:id contract and sets category / city_id.
      const { notCustomsCleared, ...rest } = formData;
      // В city_id — slug из справочника ('dushanbe'), а не название.
      const cityMatch = findCity(dicts?.cities?.length ? dicts.cities : FALLBACK_CITIES, formData.city);
      await onPublish(buildCarPayload({
        ...rest,
        city: cityMatch?.id ?? formData.city,
        isCustomsCleared: !notCustomsCleared,
      }));
    } catch {
      // Ошибку показывает PostAdPage; здесь только снимаем блокировку.
    } finally {
      publishingRef.current = false;
      setIsPublishing(false);
    }
  }, [formData, onPublish, dicts]);

  // ─── Memoized items ─────────────────────────────────────────────────────

  const brandItems = useMemo(
    () => uniqueBrands.map(b => ({ value: b.id, label: b.name })),
    [uniqueBrands]
  );
  const modelItems = useMemo(
    () => mergeModels(apiModels, siblingBrandId ? siblingModels ?? [] : []),
    [apiModels, siblingBrandId, siblingModels]
  );
  const generationItems = useMemo(
    () => apiGenerations.map(g => ({
      value: g.id,
      label: g.year_to ? `${g.name} (${g.year_from}-${g.year_to})` : `${g.name} (${g.year_from}-)`,
    })),
    [apiGenerations]
  );
  const yearItems = useMemo(() => YEARS_LIST.map(y => ({ label: y })), []);
  // /dicts сейчас отдаёт пустые body_types / fuel_types / drive_types /
  // steering_positions; без запасного списка эти шаги мастера нельзя пройти.
  const bodyTypeItems = useMemo(() => selectItems(dicts?.body_types, FALLBACK_BODY_TYPES), [dicts]);
  const engineItems = useMemo(() => selectItems(dicts?.fuel_types, CAR_FALLBACK_FUEL_TYPES), [dicts]);
  const driveItems = useMemo(() => selectItems(dicts?.drive_types, CAR_FALLBACK_DRIVE_TYPES), [dicts]);
  const transmissionItems = useMemo(
    () => selectItems(dicts?.transmission_types, FALLBACK_TRANSMISSION_TYPES),
    [dicts]
  );
  const colorItems = useMemo(() => selectItems(dicts?.colors, FALLBACK_COLORS), [dicts]);
  const conditionItems = useMemo(() => selectItems(dicts?.conditions, FALLBACK_CONDITIONS), [dicts]);
  const steeringItems = useMemo(
    () => selectItems(dicts?.steering_positions, FALLBACK_STEERING_POSITIONS),
    [dicts]
  );

  // ─── Validation of free-text steps ──────────────────────────────────────

  const engineVolumeNumber = parseFloat(formData.engineVolume);
  const engineVolumeIncomplete = /^0\.?$/.test(formData.engineVolume);
  const engineVolumeError =
    formData.engineVolume !== '' && !engineVolumeIncomplete &&
    (Number.isNaN(engineVolumeNumber) || engineVolumeNumber < ENGINE_VOLUME_MIN || engineVolumeNumber > ENGINE_VOLUME_MAX)
      ? `Укажите объём в литрах: от ${ENGINE_VOLUME_MIN} до ${ENGINE_VOLUME_MAX}, например 1.6`
      : undefined;

  // ─── Preview ────────────────────────────────────────────────────────────

  // Form holds API-shaped IDs; resolve to display labels for the preview screen.
  const labelOf = (items: { value?: string; label: string }[], v: string) =>
    items.find((it) => (it.value ?? it.label) === v)?.label ?? v;

  if (currentStep === STEPS.PREVIEW) {
    return (
      <PreviewStep
        onBack={goBack}
        onClose={() => { if (!publishingRef.current) onClose(); }}
        onPublish={handlePublishConfirm}
        isPublishing={isPublishing}
        formData={{
          brand: labelOf(brandItems, formData.brand),
          model: labelOf(modelItems, formData.model),
          year: formData.year,
          price: formData.price,
          city: formData.city,
          status: formData.vehicleStatus,
          isCustomsCleared: !formData.notCustomsCleared,
          country: formData.originCountry,
          photos: formData.photos,
          mileage: formData.mileage,
          engineType: labelOf(engineItems, formData.engineType),
          driveType: labelOf(driveItems, formData.driveType),
          name: formData.name,
          phone: formData.phone,
          readyForOnlineViewing: formData.readyForOnlineViewing,
        }}
      />
    );
  }

  // ─── Render Step ────────────────────────────────────────────────────────

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.BRAND:
        return (
          <SelectionStep
            title="Марка"
            items={brandItems}
            selectedValue={formData.brand}
            onSelect={selectAndAdvance('brand')}
            searchable
            searchPlaceholder="Введите марку"
            allowCustom
            customMaxLength={100}
            customPlaceholder="Введите название марки"
          />
        );

      case STEPS.MODEL:
        return (
          <SelectionStep
            title="Модель"
            items={modelItems}
            selectedValue={formData.model}
            onSelect={selectAndAdvance('model')}
            searchable
            searchPlaceholder="Введите модель"
            allowCustom
            customMaxLength={100}
            customPlaceholder="Введите название модели"
          />
        );

      case STEPS.YEAR:
        return (
          <SelectionStep
            title="Год выпуска"
            items={yearItems}
            selectedValue={formData.year}
            onSelect={selectAndAdvance('year')}
          />
        );

      case STEPS.GENERATION:
        return (
          <SelectionStep
            title="Поколение"
            items={generationItems}
            selectedValue={formData.generation}
            onSelect={selectAndAdvance('generation')}
            allowCustom
            customMaxLength={50}
            customPlaceholder="Введите поколение"
            onSkip={goNext}
          />
        );

      case STEPS.BODY_TYPE:
        return (
          <SelectionStep
            title="Кузов"
            items={bodyTypeItems}
            selectedValue={formData.bodyType}
            onSelect={selectAndAdvance('bodyType')}
            allowCustom
            customMaxLength={50}
            customPlaceholder="Введите тип кузова"
          />
        );

      case STEPS.ENGINE:
        return (
          <SelectionStep
            title="Двигатель"
            items={engineItems}
            selectedValue={formData.engineType}
            onSelect={selectAndAdvance('engineType')}
          />
        );

      case STEPS.DRIVE:
        return (
          <SelectionStep
            title="Привод"
            items={driveItems}
            selectedValue={formData.driveType}
            onSelect={selectAndAdvance('driveType')}
          />
        );

      case STEPS.TRANSMISSION:
        return (
          <SelectionStep
            title="Коробка передач"
            items={transmissionItems}
            selectedValue={formData.transmission}
            onSelect={selectAndAdvance('transmission')}
          />
        );

      case STEPS.ENGINE_VOLUME:
        return (
          <InputStep
            title="Объём двигателя"
            value={formData.engineVolume}
            onChangeText={(v) => setField('engineVolume', sanitizeEngineVolume(v))}
            onNext={goNext}
            placeholder="2.0"
            suffix="л"
            keyboardType="numeric"
            required={false}
            error={engineVolumeError}
            canContinue={!engineVolumeIncomplete}
          />
        );

      case STEPS.POWER:
        return (
          <InputStep
            title="Мощность"
            value={formData.power}
            onChangeText={(v) => setField('power', v.replace(/\D/g, '').replace(/^0+/, '').slice(0, POWER_MAX_DIGITS))}
            onNext={goNext}
            placeholder="150"
            suffix="л.с."
            keyboardType="numeric"
            required={false}
          />
        );

      case STEPS.COLOR:
        return (
          <SelectionStep
            title="Цвет"
            items={colorItems}
            selectedValue={formData.color}
            onSelect={selectAndAdvance('color')}
            allowCustom
            customMaxLength={50}
            customPlaceholder="Введите цвет"
          />
        );

      case STEPS.CONDITION:
        return (
          <SelectionStep
            title="Состояние"
            items={conditionItems}
            selectedValue={formData.condition}
            onSelect={selectAndAdvance('condition')}
          />
        );

      case STEPS.STEERING:
        return (
          <SelectionStep
            title="Руль"
            items={steeringItems}
            selectedValue={formData.steeringWheel}
            onSelect={selectAndAdvance('steeringWheel')}
          />
        );

      case STEPS.PHOTOS:
        return (
          <PhotosStep
            photos={formData.photos}
            onAddPhoto={handlePhotoUpload}
            onRemovePhoto={removePhoto}
            onNext={goNext}
          />
        );

      case STEPS.EQUIPMENT:
        return (
          <EquipmentStep
            selected={formData.equipment}
            onToggle={toggleEquipment}
            onNext={goNext}
          />
        );

      case STEPS.HISTORY:
        return (
          <HistoryStep
            mileage={formData.mileage}
            pts={formData.pts}
            owners={formData.owners}
            isDamaged={formData.isDamaged}
            onChangeMileage={(v) => setField('mileage', v)}
            onChangePts={(v) => setField('pts', v)}
            onChangeOwners={(v) => setField('owners', v)}
            onToggleDamaged={() => setField('isDamaged', !formData.isDamaged)}
            isCustomsCleared={!formData.notCustomsCleared}
            onToggleCustomsCleared={() => setField('notCustomsCleared', !formData.notCustomsCleared)}
            onNext={goNext}
          />
        );

      case STEPS.VIN:
        return (
          <InputStep
            title="VIN"
            value={formData.vin}
            onChangeText={(v) => setField('vin', v.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17))}
            onNext={goNext}
            placeholder="Введите VIN-номер"
            subtitle="17-значный идентификационный номер автомобиля. Не обязательное поле."
            required={false}
          />
        );

      case STEPS.DESCRIPTION:
        return (
          <DescriptionStep
            description={formData.description}
            onChangeDescription={(v) => setField('description', v)}
            onNext={goNext}
          />
        );

      case STEPS.PRICE:
        return (
          <PriceStep
            price={formData.price}
            canExchange={formData.canExchange}
            canNegotiate={formData.canNegotiate}
            onChangePrice={(v) => setField('price', v)}
            onToggleExchange={() => setField('canExchange', !formData.canExchange)}
            onToggleNegotiate={() => setField('canNegotiate', !formData.canNegotiate)}
            onNext={goNext}
          />
        );

      case STEPS.CONTACTS:
        return (
          <ContactsStep
            name={formData.name}
            phone={formData.phone}
            city={formData.city}
            readyForOnlineViewing={formData.readyForOnlineViewing}
            onChangeName={(v) => setField('name', v)}
            onChangePhone={(v) => setField('phone', v)}
            onChangeCity={(v) => setField('city', v)}
            onToggleOnlineViewing={() => setField('readyForOnlineViewing', !formData.readyForOnlineViewing)}
            onNext={goNext}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <AddListingHeader
        onBack={goBack}
        onClose={onClose}
        title="Объявление"
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
      />
      {/*
        key={currentStep}: каждый шаг — новый экземпляр. Шаги 1–8 — один и тот же
        SelectionStep в одном слоте; без key React переиспользовал его, и текст
        поиска марки («Toy») фильтровал список «Год выпуска» до нуля.
      */}
      <div key={currentStep} className="flex min-h-0 flex-1 flex-col">
        {renderStepContent()}
      </div>
    </div>
  );
}
