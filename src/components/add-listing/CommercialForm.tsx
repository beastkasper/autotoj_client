"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, X, Camera, Video, Info, Loader2 } from "lucide-react";
import { BottomSheetSelect } from "@/components/add-listing/form/BottomSheetSelect";
import { AddValueModal } from "@/components/add-listing/form/AddValueModal";
import { CustomCheckbox } from "@/components/add-listing/form/CustomCheckbox";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";
import { InfoModal } from "@/components/add-listing/form/InfoModal";
import { CommercialPreviewStep } from "@/components/add-listing/CommercialPreviewStep";
import { ExitConfirmationModal } from "@/components/add-listing/modals/ExitConfirmationModal";
import { BackConfirmationModal } from "@/components/add-listing/modals/BackConfirmationModal";
import { EditContactsModal } from "@/components/add-listing/form/EditContactsModal";
import { userStore } from "@/lib/add-listing/userStore";
import { Toast } from "@/lib/add-listing/alert";
import { useDicts, useBrandCascade } from "@/lib/add-listing/dicts";
import { pickPhotos, pickVideo } from "@/lib/add-listing/photoPicker";
import { buildCommercialPayload, type VehiclePublishData } from "@/lib/add-listing/vehiclePayload";
import { cascadeId, withFallback, FALLBACK_STEERING_POSITIONS } from "@/lib/add-listing/dictFallbacks";
import { cn } from "@/lib/utils";

/** Бэкенд принимает не больше 30 фото на объявление (photos[:30]). */
const MAX_PHOTOS = 30;

interface CommercialFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: VehiclePublishData) => void;
  /** Subcategory chosen on the previous screen — used for the header title and forwarded on publish. */
  subcategory: string;
}

// Общие классы (StyleSheet → Tailwind)
const sectionCardCls = "mb-[12px] overflow-hidden rounded-[16px] bg-secondary";
const sectionHeaderCls = "flex w-full flex-row items-center justify-between px-[16px] py-[16px] text-left";
const sectionTitleCls = "flex-1 text-[16px] font-semibold text-foreground";
const sectionBodyCls = "flex flex-col gap-[12px] px-[16px] pb-[16px]";
const fieldGroupCls = "flex flex-col gap-[8px]";
const fieldLabelCls = "text-[14px] font-medium text-foreground";
// textInput (жёстко заданные цвета как в мобилке)
const textInputCls =
  "h-[48px] w-full rounded-[12px] border border-[#C7C7CC] bg-white px-[16px] text-[15px] font-normal text-black outline-none placeholder:text-[#8E8E93]";
// textInput с цветами темы
const themedTextInputCls =
  "h-[48px] w-full rounded-[12px] border border-border bg-card px-[16px] text-[15px] font-normal text-foreground outline-none placeholder:text-[#8E8E93]";
const textInputErrorCls = "border-[#E53935]";
const errorTextCls = "mt-[4px] text-[12px] font-normal text-[#E53935]";
const toggleRowCls =
  "flex h-[48px] flex-row items-center justify-between rounded-[12px] border border-border bg-card px-[16px]";
const toggleLabelCls = "text-[15px] font-normal text-foreground";
const mediaUploadButtonCls =
  "flex h-[128px] w-full flex-col items-center justify-center gap-[8px] rounded-[12px] border-2 border-dashed border-border bg-card";
const mediaUploadTextCls = "text-[15px] font-normal text-foreground";
const mediaUploadHintCls = "text-[12px] font-normal text-muted-foreground";

function Required() {
  return <span className="text-[#E53935]"> *</span>;
}

function SectionChevron({ expanded }: { expanded: boolean }) {
  return expanded ? (
    <ChevronUp className="text-foreground" size={20} />
  ) : (
    <ChevronDown className="text-foreground" size={20} />
  );
}

function Toggle({ value, onPress }: { value: boolean; onPress: () => void }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className={cn(
        "flex h-[28px] w-[48px] shrink-0 flex-col justify-center rounded-[14px] px-[2px]",
        value ? "bg-black" : "bg-[#C7C7CC]",
      )}
    >
      <span
        className={cn(
          "block h-[24px] w-[24px] rounded-[12px] bg-white",
          value ? "self-end" : "self-start",
        )}
      />
    </button>
  );
}

export function CommercialForm({ onBack, onClose, onPublish, subcategory }: CommercialFormProps) {
  const { dicts } = useDicts();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: false,
    bodyType: false,
    cabinType: false,
    technical: false,
    steeringWheel: false,
    color: false,
    documents: false,
    equipment: false,
    status: false,
    media: false,
    description: false,
    price: false,
    contacts: false,
  });

  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showEditContactsModal, setShowEditContactsModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Basic info
    brand: "",
    model: "",
    loadCapacity: "",
    year: "",
    mileage: "",

    // Body type
    bodyType: "",

    // Cabin type
    cabinType: "",

    // Technical
    engineType: "",
    transmission: "",
    wheelFormula: "",
    chassisSuspension: "",
    engineVolume: "",
    power: "",
    cabinSuspension: "",
    euroClass: "",
    hasGreenCertificate: false,

    // Steering wheel
    steeringWheel: "",

    // Color
    selectedColors: [] as string[],

    // Documents
    pts: "",
    owners: "",
    isCustomsCleared: false,
    isDamaged: false,

    // Equipment
    equipment: [] as string[],
    mountainBrake: "",
    climate: "",
    seatHeating: "",
    powerWindows: "",
    radio: "",

    // Status
    vehicleStatus: "",
    orderCountry: "",

    // Media
    photos: [] as string[],
    video: "",

    // Description
    description: "",

    // Price
    price: "",

    // Contacts
    name: "",
    phone: "",
    city: "",
  });

  // Load user profile data on mount (async in mobile)
  useEffect(() => {
    const loadProfile = async () => {
      const profile = await userStore.getProfile();
      setFormData((prev) => ({
        ...prev,
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
      }));
    };
    loadProfile();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ── API-driven dictionaries ──
  // /brands?type=commercial сейчас пуст, поэтому марка/модель чаще всего
  // вводятся вручную и хранятся именами — такие значения нельзя слать в
  // /models?brand_id= (бэкенд ждёт UUID → 422), каскад получает только UUID.
  const { brands: apiBrands, models: apiModels } = useBrandCascade(
    "commercial",
    cascadeId(formData.brand),
    cascadeId(formData.model),
  );
  const brands = useMemo(() => apiBrands.map((b) => ({ id: b.id, label: b.name })), [apiBrands]);
  const availableModels = useMemo(() => apiModels.map((m) => ({ id: m.id, label: m.name })), [apiModels]);
  const bodyTypes = useMemo(
    () => (dicts?.commercial_body_types ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts],
  );
  const engineTypes = useMemo(
    () => (dicts?.commercial_engine_types ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts],
  );
  const transmissions = useMemo(
    () => (dicts?.commercial_transmission_types ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts],
  );

  // Truck-specific enums kept inline (no API dict).
  const cabinTypes = [
    "2-х местная без спального",
    "2-х местная с 1 спальным",
    "2-х местная с 2 спальными",
    "3-х местная без спального",
    "3-х местная с 1 спальным",
    "6-ти местная, двухрядная",
    "7-и местная, двухрядная",
  ];

  // ── More API-driven dictionaries ──
  // /dicts сейчас отдаёт пустой steering_positions — подставляем left/right.
  const steeringWheels = useMemo(
    () =>
      withFallback(dicts?.steering_positions, FALLBACK_STEERING_POSITIONS).map((d) => ({ id: d.id, label: d.name })),
    [dicts],
  );
  const ptsOptions = useMemo(() => (dicts?.pts_options ?? []).map((d) => ({ id: d.id, label: d.name })), [dicts]);
  const equipmentOptions = useMemo(
    () => (dicts?.commercial_equipment ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts],
  );
  const powerWindowsOptions = useMemo(
    () => (dicts?.commercial_windows ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts],
  );
  const radioOptions = useMemo(
    () => (dicts?.commercial_radio ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts],
  );
  const colors = useMemo(() => (dicts?.colors ?? []).map((c) => c.name), [dicts]);

  // Truck-specific enums (no API dict).
  const wheelFormulas = ["10×10", "10×6", "4×2", "4×4", "6×2", "6×4", "6×6", "8×2", "8×4", "8×8"];
  const chassisSuspensions = ["Рессора–рессора", "Рессора–пневмо", "Пневмо–пневмо"];
  const cabinSuspensions = ["Механическая", "Пневматическая"];
  const euroClasses = ["0", "1", "2", "3", "4", "5", "6"];
  const ownersOptions = ["1", "2", "3", "4+"];
  const mountainBrakeOptions = ["Отсутствует", "Интардер", "Ретардер"];
  const climateOptions = ["Отсутствует", "Кондиционер", "Климат-контроль"];
  const seatHeatingOptions = ["Отсутствует", "Водительское", "Оба"];
  const statusOptions = ["В наличии", "На заказ"];
  const yearsList = Array.from({ length: 2026 - 1980 + 1 }, (_, i) => (2026 - i).toString());

  // Check if at least one field has data
  const hasAnyData =
    formData.brand || formData.model || formData.loadCapacity ||
    formData.year || formData.mileage || formData.bodyType ||
    formData.cabinType || formData.engineType || formData.transmission ||
    formData.wheelFormula || formData.chassisSuspension || formData.engineVolume ||
    formData.power || formData.cabinSuspension || formData.euroClass ||
    formData.hasGreenCertificate || formData.steeringWheel ||
    formData.selectedColors.length > 0 || formData.pts || formData.owners ||
    formData.isDamaged || formData.equipment.length > 0 ||
    formData.mountainBrake || formData.climate || formData.seatHeating ||
    formData.powerWindows || formData.radio || formData.vehicleStatus ||
    formData.orderCountry || formData.photos.length > 0 || formData.video ||
    formData.description || formData.price;

  // Кнопка закрытия в шапке этой формы отсутствует (как в мобилке) — handler сохранён для паритета.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCloseClick = () => {
    if (hasAnyData) {
      setShowExitConfirmation(true);
    } else {
      onClose();
    }
  };

  const handleBackClick = () => {
    if (hasAnyData) {
      setShowBackConfirmation(true);
    } else {
      onBack();
    }
  };

  const handleReset = async () => {
    const profile = await userStore.getProfile();
    setFormData({
      brand: "",
      model: "",
      loadCapacity: "",
      year: "",
      mileage: "",
      bodyType: "",
      cabinType: "",
      engineType: "",
      transmission: "",
      wheelFormula: "",
      chassisSuspension: "",
      engineVolume: "",
      power: "",
      cabinSuspension: "",
      euroClass: "",
      hasGreenCertificate: false,
      steeringWheel: "",
      selectedColors: [],
      pts: "",
      owners: "",
      isCustomsCleared: false,
      isDamaged: false,
      equipment: [],
      mountainBrake: "",
      climate: "",
      seatHeating: "",
      powerWindows: "",
      radio: "",
      vehicleStatus: "",
      orderCountry: "",
      photos: [],
      video: "",
      description: "",
      price: "",
      name: profile.name,
      phone: profile.phone,
      city: profile.city,
    });
    setExpandedSections({
      basic: false,
      bodyType: false,
      cabinType: false,
      technical: false,
      steeringWheel: false,
      color: false,
      documents: false,
      equipment: false,
      status: false,
      media: false,
      description: false,
      price: false,
      contacts: false,
    });
    setErrors({});
    setAttemptedSubmit(false);
    setShowResetConfirmation(false);
    Toast.show({ type: "success", text1: "Форма очищена" });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.brand) newErrors.brand = "Обязательное поле";
    if (!formData.model) newErrors.model = "Обязательное поле";
    if (!formData.loadCapacity) newErrors.loadCapacity = "Обязательное поле";
    if (!formData.year) newErrors.year = "Обязательное поле";
    if (!formData.mileage) newErrors.mileage = "Обязательное поле";
    if (!formData.bodyType) newErrors.bodyType = "Обязательное поле";
    if (!formData.price) newErrors.price = "Обязательное поле";
    if (!formData.name) newErrors.name = "Обязательное поле";
    if (!formData.phone) newErrors.phone = "Обязательное поле";
    if (!formData.city) newErrors.city = "Обязательное поле";

    // If status is "На заказ", orderCountry is required
    if (formData.vehicleStatus === "На заказ" && !formData.orderCountry) {
      newErrors.orderCountry = "Обязательное поле";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setAttemptedSubmit(true);

    if (validateForm()) {
      setShowPreview(true);
    } else {
      // Scroll to top on error
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePublishConfirm = () => {
    setIsLoading(true);
    // Цвета в этой форме выбираются по имени из dicts.colors — переводим в id
    // справочника (произвольный цвет из «Добавить цвет» остаётся именем).
    // Стеклоподъёмники / аудио не имеют колонок и уходят в description, поэтому
    // для них наоборот отдаём человекочитаемые подписи.
    const labelOf = (items: { id: string; label: string }[], v: string) =>
      items.find((it) => it.id === v)?.label ?? v;
    const colorIds = formData.selectedColors.map(
      (name) => (dicts?.colors ?? []).find((c) => c.name === name)?.id ?? name,
    );
    onPublish(
      buildCommercialPayload(
        {
          ...formData,
          selectedColors: colorIds,
          powerWindows: labelOf(powerWindowsOptions, formData.powerWindows),
          radio: labelOf(radioOptions, formData.radio),
        },
        subcategory,
      ),
    );
  };

  const handlePhotoUpload = async () => {
    const uris = await pickPhotos({ remaining: MAX_PHOTOS - formData.photos.length });
    if (uris.length === 0) return;
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...uris].slice(0, MAX_PHOTOS),
    }));
  };

  const handleVideoUpload = async () => {
    const uri = await pickVideo();
    if (!uri) return;
    setFormData((prev) => ({ ...prev, video: uri }));
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const removeVideo = () => {
    setFormData((prev) => ({ ...prev, video: "" }));
  };

  const handleColorToggle = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(color)
        ? prev.selectedColors.filter((c) => c !== color)
        : [...prev.selectedColors, color],
    }));
  };

  const handleAddCustomColor = (color: string) => {
    if (color && !formData.selectedColors.includes(color)) {
      setFormData((prev) => ({
        ...prev,
        selectedColors: [...prev.selectedColors, color],
      }));
    }
  };

  const handleEquipmentToggle = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((e) => e !== item)
        : [...prev.equipment, item],
    }));
  };

  // Show preview step if validated
  if (showPreview) {
    return (
      <CommercialPreviewStep
        onBack={() => setShowPreview(false)}
        onClose={onClose}
        onPublish={handlePublishConfirm}
        subcategory={subcategory}
        formData={formData}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b border-border bg-background"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)", height: "calc(56px + env(safe-area-inset-top, 0px))" }}
      >
        <div className="mx-auto flex h-full w-full max-w-[720px] flex-row items-center px-[16px]">
          <button
            type="button"
            onClick={handleBackClick}
            className="-ml-[8px] flex h-[40px] w-[40px] items-center justify-center"
          >
            <ChevronLeft className="text-foreground" size={24} strokeWidth={1.5} />
          </button>
          <span className="flex-1 text-center text-[17px] font-semibold text-foreground">{subcategory}</span>
          <button type="button" onClick={() => setShowResetConfirmation(true)} className="px-[8px]">
            <span className="text-[15px] font-medium text-[#D32F2F]">Сброс</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1">
        <div className="mx-auto w-full max-w-[720px] p-[16px]">
          {/* 1. Основная информация */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("basic")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Основная информация</span>
              <SectionChevron expanded={expandedSections.basic} />
            </button>

            {expandedSections.basic && (
              <div className={sectionBodyCls}>
                {/* Марка */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Марка<Required />
                  </span>
                  <BottomSheetSelect
                    value={formData.brand}
                    onChange={(value) => setFormData({ ...formData, brand: value, model: "" })}
                    options={brands}
                    placeholder="Выберите марку"
                    title="Выберите марку"
                    error={attemptedSubmit ? errors.brand : undefined}
                    allowCustom
                    onAddCustom={() => setShowAddBrandModal(true)}
                    customButtonText="Добавить марку"
                  />
                </div>

                {/* Модель */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Модель<Required />
                  </span>
                  <BottomSheetSelect
                    value={formData.model}
                    onChange={(value) => setFormData({ ...formData, model: value })}
                    options={availableModels}
                    placeholder="Выберите модель"
                    title="Выберите модель"
                    error={attemptedSubmit ? errors.model : undefined}
                    allowCustom
                    onAddCustom={() => setShowAddModelModal(true)}
                    customButtonText="Добавить модель"
                  />
                </div>

                {/* Загрузка, кг */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Загрузка, кг<Required />
                  </span>
                  <input
                    placeholder="Например: 20000"
                    value={formData.loadCapacity}
                    onChange={(e) => setFormData({ ...formData, loadCapacity: e.target.value })}
                    inputMode="numeric"
                    className={cn(textInputCls, attemptedSubmit && errors.loadCapacity ? textInputErrorCls : undefined)}
                  />
                  {attemptedSubmit && errors.loadCapacity && (
                    <span className={errorTextCls}>{errors.loadCapacity}</span>
                  )}
                </div>

                {/* Год выпуска */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Год выпуска<Required />
                  </span>
                  <BottomSheetSelect
                    value={formData.year}
                    onChange={(value) => setFormData({ ...formData, year: value })}
                    options={yearsList}
                    placeholder="Выберите год"
                    title="Выберите год"
                    error={attemptedSubmit ? errors.year : undefined}
                  />
                </div>

                {/* Пробег, км */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Пробег, км<Required />
                  </span>
                  <input
                    placeholder="Например: 150000"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    inputMode="numeric"
                    className={cn(textInputCls, attemptedSubmit && errors.mileage ? textInputErrorCls : undefined)}
                  />
                  {attemptedSubmit && errors.mileage && <span className={errorTextCls}>{errors.mileage}</span>}
                </div>
              </div>
            )}
          </div>

          {/* 2. Тип кузова */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("bodyType")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>
                Тип кузова<Required />
              </span>
              <SectionChevron expanded={expandedSections.bodyType} />
            </button>

            {expandedSections.bodyType && (
              <div className={sectionBodyCls}>
                <BottomSheetSelect
                  value={formData.bodyType}
                  onChange={(value) => setFormData({ ...formData, bodyType: value })}
                  options={bodyTypes}
                  placeholder="Выберите тип кузова"
                  title="Выберите тип кузова"
                  error={attemptedSubmit ? errors.bodyType : undefined}
                />
              </div>
            )}
          </div>

          {/* 3. Тип кабины */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("cabinType")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Тип кабины</span>
              <SectionChevron expanded={expandedSections.cabinType} />
            </button>

            {expandedSections.cabinType && (
              <div className={sectionBodyCls}>
                <BottomSheetSelect
                  value={formData.cabinType}
                  onChange={(value) => setFormData({ ...formData, cabinType: value })}
                  options={cabinTypes}
                  placeholder="Выберите тип кабины"
                  title="Выберите тип кабины"
                />
              </div>
            )}
          </div>

          {/* 4. Технические характеристики */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("technical")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Технические характеристики</span>
              <SectionChevron expanded={expandedSections.technical} />
            </button>

            {expandedSections.technical && (
              <div className={sectionBodyCls}>
                {/* Двигатель */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Двигатель</span>
                  <BottomSheetSelect
                    value={formData.engineType}
                    onChange={(value) => setFormData({ ...formData, engineType: value })}
                    options={engineTypes}
                    placeholder="Выберите тип двигателя"
                    title="Выберите тип двигателя"
                  />
                </div>

                {/* Коробка */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Коробка</span>
                  <BottomSheetSelect
                    value={formData.transmission}
                    onChange={(value) => setFormData({ ...formData, transmission: value })}
                    options={transmissions}
                    placeholder="Выберите коробку"
                    title="Выберите коробку"
                  />
                </div>

                {/* Колёсная формула */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Колёсная формула</span>
                  <BottomSheetSelect
                    value={formData.wheelFormula}
                    onChange={(value) => setFormData({ ...formData, wheelFormula: value })}
                    options={wheelFormulas}
                    placeholder="Выберите колёсную формулу"
                    title="Выберите колёсную формулу"
                  />
                </div>

                {/* Подвеска шасси */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Подвеска шасси</span>
                  <BottomSheetSelect
                    value={formData.chassisSuspension}
                    onChange={(value) => setFormData({ ...formData, chassisSuspension: value })}
                    options={chassisSuspensions}
                    placeholder="Выберите подвеску шасси"
                    title="Выберите подвеску шасси"
                  />
                </div>

                {/* Объём двигателя, см³ */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>{"Объём двигателя, см³"}</span>
                  <input
                    placeholder="Например: 13000"
                    value={formData.engineVolume}
                    onChange={(e) => setFormData({ ...formData, engineVolume: e.target.value })}
                    inputMode="numeric"
                    className={themedTextInputCls}
                  />
                </div>

                {/* Мощность, л.с. */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Мощность, л.с.</span>
                  <input
                    placeholder="Например: 420"
                    value={formData.power}
                    onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                    inputMode="numeric"
                    className={themedTextInputCls}
                  />
                </div>

                {/* Подвеска кабины */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Подвеска кабины</span>
                  <BottomSheetSelect
                    value={formData.cabinSuspension}
                    onChange={(value) => setFormData({ ...formData, cabinSuspension: value })}
                    options={cabinSuspensions}
                    placeholder="Выберите подвеску кабины"
                    title="Выберите подвеску кабины"
                  />
                </div>

                {/* Класс выхлопов EURO */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Класс выхлопов EURO</span>
                  <BottomSheetSelect
                    value={formData.euroClass}
                    onChange={(value) => setFormData({ ...formData, euroClass: value })}
                    options={euroClasses}
                    placeholder="Выберите класс"
                    title="Выберите класс выхлопов"
                  />
                </div>

                {/* Зелёный сертификат toggle */}
                <div className={toggleRowCls}>
                  <span className={toggleLabelCls}>Зелёный сертификат</span>
                  <Toggle
                    value={formData.hasGreenCertificate}
                    onPress={() => setFormData({ ...formData, hasGreenCertificate: !formData.hasGreenCertificate })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. Руль */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("steeringWheel")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Руль</span>
              <SectionChevron expanded={expandedSections.steeringWheel} />
            </button>

            {expandedSections.steeringWheel && (
              <div className={sectionBodyCls}>
                <BottomSheetSelect
                  value={formData.steeringWheel}
                  onChange={(value) => setFormData({ ...formData, steeringWheel: value })}
                  options={steeringWheels}
                  placeholder="Выберите расположение руля"
                  title="Выберите расположение руля"
                />
              </div>
            )}
          </div>

          {/* 6. Цвет */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("color")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Цвет</span>
              <SectionChevron expanded={expandedSections.color} />
            </button>

            {expandedSections.color && (
              <div className={sectionBodyCls}>
                <div className="flex flex-row flex-wrap gap-[8px]">
                  {colors.map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => handleColorToggle(color)}
                      className={cn(
                        "flex h-[48px] w-[48%] items-center justify-center rounded-[12px]",
                        formData.selectedColors.includes(color)
                          ? "border-2 border-black bg-[#F2F2F7]"
                          : "border border-[#C7C7CC] bg-white",
                      )}
                    >
                      <span className="text-[15px] font-normal text-black">{color}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddColorModal(true)}
                  className="flex h-[48px] w-full items-center justify-center rounded-[12px] border-2 border-dashed border-[#C7C7CC]"
                >
                  <span className="text-[15px] font-medium text-black">+ Добавить цвет</span>
                </button>
              </div>
            )}
          </div>

          {/* 7. Документы и состояние */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("documents")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Документы и состояние</span>
              <SectionChevron expanded={expandedSections.documents} />
            </button>

            {expandedSections.documents && (
              <div className={sectionBodyCls}>
                {/* ПТС */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Паспорт транспортного средства</span>
                  <BottomSheetSelect
                    value={formData.pts}
                    onChange={(value) => setFormData({ ...formData, pts: value })}
                    options={ptsOptions}
                    placeholder="Выберите вариант"
                    title="Паспорт транспортного средства"
                  />
                </div>

                {/* Владельцев по ПТС */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Владельцев по ПТС</span>
                  <BottomSheetSelect
                    value={formData.owners}
                    onChange={(value) => setFormData({ ...formData, owners: value })}
                    options={ownersOptions}
                    placeholder="Выберите количество"
                    title="Владельцев по ПТС"
                  />
                </div>

                {/* Битый или не на ходу toggle */}
                <div className={toggleRowCls}>
                  <span className={toggleLabelCls}>Битый или не на ходу</span>
                  <Toggle
                    value={formData.isDamaged}
                    onPress={() => setFormData({ ...formData, isDamaged: !formData.isDamaged })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 8. Комплектация */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("equipment")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Комплектация</span>
              <SectionChevron expanded={expandedSections.equipment} />
            </button>

            {expandedSections.equipment && (
              <div className={sectionBodyCls}>
                {/* Equipment checkboxes */}
                <div className="flex flex-col gap-[4px]">
                  {equipmentOptions.map((item) => (
                    <div key={item.id} className="mb-[4px]">
                      <CustomCheckbox
                        label={item.label}
                        checked={formData.equipment.includes(item.id)}
                        onChange={() => handleEquipmentToggle(item.id)}
                      />
                    </div>
                  ))}
                </div>

                {/* Горный тормоз */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Горный тормоз</span>
                  <BottomSheetSelect
                    value={formData.mountainBrake}
                    onChange={(value) => setFormData({ ...formData, mountainBrake: value })}
                    options={mountainBrakeOptions}
                    placeholder="Выберите вариант"
                    title="Горный тормоз"
                  />
                </div>

                {/* Климат */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Климат</span>
                  <BottomSheetSelect
                    value={formData.climate}
                    onChange={(value) => setFormData({ ...formData, climate: value })}
                    options={climateOptions}
                    placeholder="Выберите вариант"
                    title="Климат"
                  />
                </div>

                {/* Подогрев сидений */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Подогрев сидений</span>
                  <BottomSheetSelect
                    value={formData.seatHeating}
                    onChange={(value) => setFormData({ ...formData, seatHeating: value })}
                    options={seatHeatingOptions}
                    placeholder="Выберите вариант"
                    title="Подогрев сидений"
                  />
                </div>

                {/* Электроподъёмники */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Электроподъёмники</span>
                  <BottomSheetSelect
                    value={formData.powerWindows}
                    onChange={(value) => setFormData({ ...formData, powerWindows: value })}
                    options={powerWindowsOptions}
                    placeholder="Выберите вариант"
                    title="Электроподъёмники"
                  />
                </div>

                {/* Магнитола */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Магнитола</span>
                  <BottomSheetSelect
                    value={formData.radio}
                    onChange={(value) => setFormData({ ...formData, radio: value })}
                    options={radioOptions}
                    placeholder="Выберите вариант"
                    title="Магнитола"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 9. Статус */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("status")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Статус</span>
              <SectionChevron expanded={expandedSections.status} />
            </button>

            {expandedSections.status && (
              <div className={sectionBodyCls}>
                {/* Status radio buttons */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Статус транспорта</span>
                  <div className="flex flex-col gap-[8px]">
                    {statusOptions.map((status) => (
                      <button
                        type="button"
                        key={status}
                        onClick={() => {
                          if (status !== "На заказ") {
                            setFormData({ ...formData, vehicleStatus: status, orderCountry: "" });
                          } else {
                            setFormData({ ...formData, vehicleStatus: status });
                          }
                        }}
                        className={cn(
                          "flex h-[48px] w-full flex-col justify-center rounded-[12px] bg-white px-[16px] text-left",
                          formData.vehicleStatus === status
                            ? "border-2 border-black"
                            : "border border-[#C7C7CC]",
                        )}
                      >
                        <span
                          className={cn(
                            "text-[15px] font-normal",
                            formData.vehicleStatus === status ? "text-black" : "text-[#8E8E93]",
                          )}
                        >
                          {status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Страна заказа - shown only for "На заказ" */}
                {formData.vehicleStatus === "На заказ" && (
                  <div className={fieldGroupCls}>
                    <span className={fieldLabelCls}>
                      Страна заказа<Required />
                    </span>
                    <input
                      placeholder="Введите страну"
                      value={formData.orderCountry}
                      onChange={(e) => setFormData({ ...formData, orderCountry: e.target.value })}
                      className={cn(
                        textInputCls,
                        attemptedSubmit && errors.orderCountry ? textInputErrorCls : undefined,
                      )}
                    />
                    {attemptedSubmit && errors.orderCountry && (
                      <span className={errorTextCls}>{errors.orderCountry}</span>
                    )}
                  </div>
                )}

                {/* Не растаможен toggle */}
                <div className={toggleRowCls}>
                  <div className="flex flex-row items-center gap-[8px]">
                    <span className={toggleLabelCls}>Не растаможен</span>
                    <button
                      type="button"
                      onClick={() => setShowInfoModal(true)}
                      className="flex h-[20px] w-[20px] items-center justify-center"
                    >
                      <Info color="#8E8E93" size={20} strokeWidth={2} />
                    </button>
                  </div>
                  <Toggle
                    value={formData.isCustomsCleared}
                    onPress={() => setFormData({ ...formData, isCustomsCleared: !formData.isCustomsCleared })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 10. Медиа */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("media")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Медиа</span>
              <SectionChevron expanded={expandedSections.media} />
            </button>

            {expandedSections.media && (
              <div className={sectionBodyCls}>
                {/* Photos */}
                <div>
                  <div className="mb-[8px] flex flex-row items-center justify-between">
                    <span className={fieldLabelCls}>Фото (до 30)</span>
                    {formData.photos.length > 0 && (
                      <span className="text-[12px] font-normal text-muted-foreground">
                        {formData.photos.length} / 30
                      </span>
                    )}
                  </div>

                  {/* Photo Grid */}
                  {formData.photos.length > 0 && (
                    <div className="mb-[12px] flex flex-row flex-wrap gap-[8px]">
                      {formData.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative aspect-square w-[31%] overflow-hidden rounded-[12px] bg-secondary"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photo} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute right-[4px] top-[4px] flex h-[24px] w-[24px] items-center justify-center rounded-[12px] bg-[rgba(0,0,0,0.6)]"
                          >
                            <X color="#FFFFFF" size={14} strokeWidth={2} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Photo Button */}
                  {formData.photos.length < 30 && (
                    <button type="button" onClick={handlePhotoUpload} className={mediaUploadButtonCls}>
                      <Camera color="#8E8E93" size={32} strokeWidth={1.5} />
                      <span className={mediaUploadTextCls}>Добавить фото</span>
                      <span className={mediaUploadHintCls}>До 30 фото</span>
                    </button>
                  )}
                </div>

                {/* Video */}
                <div className="flex flex-col gap-[8px]">
                  <span className={fieldLabelCls}>Видео (до 60 сек)</span>

                  {formData.video ? (
                    <div className="relative aspect-video overflow-hidden rounded-[12px] bg-[#F2F2F7]">
                      <video
                        src={formData.video}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.2)]">
                        <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[32px] bg-[rgba(255,255,255,0.9)]">
                          <Video className="text-foreground" size={32} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute right-[8px] top-[8px] flex h-[32px] w-[32px] items-center justify-center rounded-[16px] bg-[rgba(0,0,0,0.6)]"
                      >
                        <X color="#FFFFFF" size={18} strokeWidth={2} />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={handleVideoUpload} className={mediaUploadButtonCls}>
                      <Video color="#8E8E93" size={32} strokeWidth={1.5} />
                      <span className={mediaUploadTextCls}>Добавить видео</span>
                      <span className={mediaUploadHintCls}>До 60 секунд</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 11. Описание */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("description")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Описание</span>
              <SectionChevron expanded={expandedSections.description} />
            </button>

            {expandedSections.description && (
              <div className={sectionBodyCls}>
                <textarea
                  placeholder="Расскажите о транспорте подробнее"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="min-h-[120px] w-full resize-y rounded-[12px] border border-border bg-card px-[16px] py-[12px] align-top text-[15px] font-normal text-foreground outline-none placeholder:text-[#8E8E93]"
                />
              </div>
            )}
          </div>

          {/* 12. Цена */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("price")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>
                Цена<Required />
              </span>
              <SectionChevron expanded={expandedSections.price} />
            </button>

            {expandedSections.price && (
              <div className={sectionBodyCls}>
                <div className="flex flex-row items-center gap-[8px]">
                  <input
                    placeholder="Введите цену"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    inputMode="numeric"
                    className={cn(
                      textInputCls,
                      "min-w-0 flex-1",
                      attemptedSubmit && errors.price ? textInputErrorCls : undefined,
                    )}
                  />
                  <span className="text-[15px] font-normal text-muted-foreground">сомони</span>
                </div>
                {attemptedSubmit && errors.price && <span className={errorTextCls}>{errors.price}</span>}
              </div>
            )}
          </div>

          {/* 13. Контакты */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("contacts")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Контакты</span>
              <SectionChevron expanded={expandedSections.contacts} />
            </button>

            {expandedSections.contacts && (
              <div className={sectionBodyCls}>
                {/* Contact Info Display */}
                <div className="flex flex-col gap-[12px] rounded-[12px] border border-border bg-card p-[16px]">
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[12px] font-normal text-muted-foreground">Имя</span>
                    <span className="text-[15px] font-medium text-foreground">{formData.name}</span>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[12px] font-normal text-muted-foreground">Номер телефона</span>
                    <span className="text-[15px] font-medium text-foreground">+992 {formData.phone}</span>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[12px] font-normal text-muted-foreground">Город</span>
                    <span className="text-[15px] font-medium text-foreground">{formData.city || "Не указан"}</span>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => setShowEditContactsModal(true)}
                  className="flex h-[48px] w-full items-center justify-center rounded-[12px] bg-[#F2F2F7]"
                >
                  <span className="text-[15px] font-medium text-foreground">Изменить контакты</span>
                </button>

                {/* Error messages if validation fails */}
                {attemptedSubmit && (errors.name || errors.phone || errors.city) && (
                  <div className="flex flex-col rounded-[12px] border border-[#FF3B30] bg-[#FFF3F3] p-[12px]">
                    {errors.name && (
                      <span className="mb-[4px] text-[13px] font-normal text-[#FF3B30]">
                        {"•"} Имя: {errors.name}
                      </span>
                    )}
                    {errors.phone && (
                      <span className="mb-[4px] text-[13px] font-normal text-[#FF3B30]">
                        {"•"} Телефон: {errors.phone}
                      </span>
                    )}
                    {errors.city && (
                      <span className="mb-[4px] text-[13px] font-normal text-[#FF3B30]">
                        {"•"} Город: {errors.city}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom padding for floating button */}
          <div className="h-[96px]" />
        </div>
      </div>

      {/* Floating Submit Button */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mx-auto w-full max-w-[720px] px-[16px] pt-[16px]">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={cn(
              "flex h-[56px] w-full items-center justify-center rounded-[16px]",
              !isLoading ? "bg-[#111111]" : "bg-[#E5E5EA]",
            )}
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" color="#FFFFFF" />
            ) : (
              <span className="text-[17px] font-semibold text-white">Далее</span>
            )}
          </button>
        </div>
      </div>

      {/* Add Brand Modal */}
      <AddValueModal
        isOpen={showAddBrandModal}
        onClose={() => setShowAddBrandModal(false)}
        onAdd={(value) => {
          setFormData({ ...formData, brand: value, model: "" });
          setShowAddBrandModal(false);
        }}
        title="Добавить марку"
        placeholder="Введите марку"
        buttonText="Добавить"
      />

      {/* Add Model Modal */}
      <AddValueModal
        isOpen={showAddModelModal}
        onClose={() => setShowAddModelModal(false)}
        onAdd={(value) => {
          setFormData({ ...formData, model: value });
          setShowAddModelModal(false);
        }}
        title="Добавить модель"
        placeholder="Введите модель"
        buttonText="Добавить"
      />

      {/* Add Color Modal */}
      <AddValueModal
        isOpen={showAddColorModal}
        onClose={() => setShowAddColorModal(false)}
        onAdd={(value) => {
          handleAddCustomColor(value);
          setShowAddColorModal(false);
        }}
        title="Добавить цвет"
        placeholder="Введите цвет"
        buttonText="Добавить"
      />

      {/* Add City Modal */}
      <AddValueModal
        isOpen={showAddCityModal}
        onClose={() => setShowAddCityModal(false)}
        onAdd={(value) => {
          setFormData({ ...formData, city: value });
          setShowAddCityModal(false);
        }}
        title="Добавить город"
        placeholder="Введите название города"
        buttonText="Добавить"
      />

      {/* Back Confirmation Modal */}
      <BackConfirmationModal
        isOpen={showBackConfirmation}
        onStay={() => setShowBackConfirmation(false)}
        onBack={onBack}
      />

      {/* Exit Confirmation Modal */}
      <ExitConfirmationModal
        isOpen={showExitConfirmation}
        onStay={() => setShowExitConfirmation(false)}
        onExit={onClose}
      />

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetConfirmation}
        onClose={() => setShowResetConfirmation(false)}
        onConfirm={handleReset}
        title="Сбросить заполнение?"
        message="Все введённые данные будут удалены. Это действие нельзя отменить."
        confirmText="Сбросить"
        cancelText="Отмена"
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Не растаможен"
        message="Отметьте пункт, если вы ввезли транспорт из-за границы, но не растаможили его. Даже если он привезён из страны Таможенного союза, перед продажей всё равно нужно будет заплатить пошлину."
      />

      {/* Edit Contacts Modal */}
      <EditContactsModal
        isOpen={showEditContactsModal}
        onClose={() => setShowEditContactsModal(false)}
        currentName={formData.name}
        currentPhone={formData.phone}
        currentCity={formData.city}
        onSave={async (phone, city) => {
          setFormData((prev) => ({ ...prev, phone, city }));
          await userStore.updatePhone(phone);
          await userStore.updateCity(city);
          Toast.show({ type: "success", text1: "Контакты обновлены" });
        }}
      />
    </div>
  );
}
