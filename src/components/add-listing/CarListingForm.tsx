"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { userStore } from '@/lib/add-listing/userStore';
import { useDicts, useBrandCascade } from '@/lib/add-listing/dicts';
import { pickPhotos } from '@/lib/add-listing/photoPicker';
import { buildCarPayload, type VehiclePublishData } from '@/lib/add-listing/vehiclePayload';
import {
  cascadeId,
  withFallback,
  FALLBACK_BODY_TYPES,
  FALLBACK_DRIVE_TYPES,
  FALLBACK_FUEL_TYPES,
  FALLBACK_STEERING_POSITIONS,
} from '@/lib/add-listing/dictFallbacks';

import { AddListingHeader } from '@/components/add-listing/AddListingHeader';
import { PreviewStep } from '@/components/add-listing/PreviewStep';
import { SelectionStep } from '@/components/add-listing/steps/SelectionStep';
import { InputStep } from '@/components/add-listing/steps/InputStep';
import { PhotosStep } from '@/components/add-listing/steps/PhotosStep';
import { HistoryStep } from '@/components/add-listing/steps/HistoryStep';
import { DescriptionStep } from '@/components/add-listing/steps/DescriptionStep';
import { PriceStep } from '@/components/add-listing/steps/PriceStep';
import { ContactsStep } from '@/components/add-listing/steps/ContactsStep';
import { EquipmentStep } from '@/components/add-listing/steps/EquipmentStep';

// ─── Static data (no API equivalent) ────────────────────────────────────────

const YEARS_LIST = Array.from({ length: 2026 - 1980 + 1 }, (_, i) => (2026 - i).toString());

/** Бэкенд принимает не больше 30 фото на объявление (photos[:30]). */
const MAX_PHOTOS = 30;

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
  onPublish: (data: VehiclePublishData) => void;
}

export function CarListingForm({ onBack, onClose, onPublish }: CarListingFormProps) {
  const { dicts } = useDicts();
  const [currentStep, setCurrentStep] = useState<number>(STEPS.BRAND);

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
    // Backend: vehicle_status, is_customs_cleared, origin_country
    vehicleStatus: 'available' as 'available' | 'on_order',
    isCustomsCleared: false,
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
      setFormData(prev => ({
        ...prev,
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
      }));
    };
    loadProfile();
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

  // ─── Navigation ─────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  }, []);

  const goBack = useCallback(() => {
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

  const handlePublishConfirm = useCallback(() => {
    // formData holds API-shaped values: brand/model/generation are UUIDs (or
    // typed names), body/fuel/drive/transmission/color/condition/steering are
    // slugs, equipment is a set of option slugs. buildCarPayload renames them
    // into the PATCH /my/ads/:id contract and sets category / city_id.
    onPublish(buildCarPayload(formData));
  }, [formData, onPublish]);

  // ─── Memoized items ─────────────────────────────────────────────────────

  const brandItems = useMemo(
    () => apiBrands.map(b => ({ value: b.id, label: b.name })),
    [apiBrands]
  );
  const modelItems = useMemo(
    () => apiModels.map(m => ({ value: m.id, label: m.name })),
    [apiModels]
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
  const bodyTypeItems = useMemo(
    () => withFallback(dicts?.body_types, FALLBACK_BODY_TYPES).map(d => ({ value: d.id, label: d.name })),
    [dicts]
  );
  const engineItems = useMemo(
    () => withFallback(dicts?.fuel_types, FALLBACK_FUEL_TYPES).map(d => ({ value: d.id, label: d.name })),
    [dicts]
  );
  const driveItems = useMemo(
    () => withFallback(dicts?.drive_types, FALLBACK_DRIVE_TYPES).map(d => ({ value: d.id, label: d.name })),
    [dicts]
  );
  const transmissionItems = useMemo(
    () => (dicts?.transmission_types ?? []).map(d => ({ value: d.id, label: d.name })),
    [dicts]
  );
  const colorItems = useMemo(
    () => (dicts?.colors ?? []).map(d => ({ value: d.id, label: d.name })),
    [dicts]
  );
  const conditionItems = useMemo(
    () => (dicts?.conditions ?? []).map(d => ({ value: d.id, label: d.name })),
    [dicts]
  );
  const steeringItems = useMemo(
    () => withFallback(dicts?.steering_positions, FALLBACK_STEERING_POSITIONS).map(d => ({ value: d.id, label: d.name })),
    [dicts]
  );

  // ─── Preview ────────────────────────────────────────────────────────────

  // Form holds API-shaped IDs; resolve to display labels for the preview screen.
  const labelOf = (items: { value?: string; label: string }[], v: string) =>
    items.find((it) => (it.value ?? it.label) === v)?.label ?? v;

  if (currentStep === STEPS.PREVIEW) {
    return (
      <PreviewStep
        onBack={goBack}
        onClose={onClose}
        onPublish={handlePublishConfirm}
        formData={{
          brand: labelOf(brandItems, formData.brand),
          model: labelOf(modelItems, formData.model),
          year: formData.year,
          price: formData.price,
          city: formData.city,
          status: formData.vehicleStatus,
          isCustomsCleared: formData.isCustomsCleared,
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
            onChangeText={(v) => setField('engineVolume', v.replace(/[^0-9.]/g, ''))}
            onNext={goNext}
            placeholder="2.0"
            suffix="л"
            keyboardType="numeric"
            required={false}
          />
        );

      case STEPS.POWER:
        return (
          <InputStep
            title="Мощность"
            value={formData.power}
            onChangeText={(v) => setField('power', v.replace(/\D/g, ''))}
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
      {renderStepContent()}
    </div>
  );
}
