"use client";

import { useState, useEffect, useMemo, type ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, X, Camera, Video, Info, Loader2 } from "lucide-react";
import { BottomSheetSelect } from "@/components/add-listing/form/BottomSheetSelect";
import { AddValueModal } from "@/components/add-listing/form/AddValueModal";
import { CustomCheckbox } from "@/components/add-listing/form/CustomCheckbox";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";
import { InfoModal } from "@/components/add-listing/form/InfoModal";
import { MotoPreviewStep } from "@/components/add-listing/MotoPreviewStep";
import { ExitConfirmationModal } from "@/components/add-listing/modals/ExitConfirmationModal";
import { BackConfirmationModal } from "@/components/add-listing/modals/BackConfirmationModal";
import { EditContactsModal } from "@/components/add-listing/form/EditContactsModal";
import { userStore } from "@/lib/add-listing/userStore";
import { Toast } from "@/lib/add-listing/alert";
import { useDicts, useBrandCascade } from "@/lib/add-listing/dicts";
import { pickPhotos, pickVideo } from "@/lib/add-listing/photoPicker";
import { buildMotoPayload, type VehiclePublishData } from "@/lib/add-listing/vehiclePayload";
import { cascadeId } from "@/lib/add-listing/dictFallbacks";
import { cn } from "@/lib/utils";

/** Бэкенд принимает не больше 30 фото на объявление (photos[:30]). */
const MAX_PHOTOS = 30;

interface MotoFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: VehiclePublishData) => void;
  /** Subcategory chosen on the previous screen — used for the header title and forwarded on publish. */
  subcategory: string;
}

// styles.textInput
const textInputCls =
  "h-[48px] w-full rounded-[12px] border border-[#C7C7CC] bg-white px-4 text-[15px] font-normal text-black outline-none placeholder:text-[#8E8E93]";
// styles.textInputError
const textInputErrorCls = "border-[#E53935]";
// themed override { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }
const themedInputCls = "bg-card border-border text-foreground";
// styles.errorText
const errorTextCls = "mt-1 text-[12px] font-normal text-[#E53935]";
// styles.fieldLabel
const fieldLabelCls = "text-[14px] font-medium text-foreground";

function Required() {
  return <span className="text-[#E53935]"> *</span>;
}

/** sectionCard + sectionHeader (аккордеон). */
function SectionCard({ children }: { children: ReactNode }) {
  return <div className="mb-3 overflow-hidden rounded-[16px] bg-secondary">{children}</div>;
}

function SectionHeader({
  expanded,
  onToggle,
  children,
}: {
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full flex-row items-center justify-between p-4 text-left"
    >
      <span className="flex-1 text-[16px] font-semibold text-foreground">{children}</span>
      {expanded
        ? <ChevronUp className="text-foreground" size={20} />
        : <ChevronDown className="text-foreground" size={20} />
      }
    </button>
  );
}

function SectionBody({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 px-4 pb-4">{children}</div>;
}

export function MotoForm({ onBack, onClose, onPublish, subcategory }: MotoFormProps) {
  const { dicts } = useDicts();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: false,
    type: false,
    year: false,
    mileage: false,
    volume: false,
    engine: false,
    cylinderLayout: false,
    cylinderCount: false,
    power: false,
    drive: false,
    gearbox: false,
    strokes: false,
    color: false,
    equipment: false,
    vehicleStatus: false,
    documents: false,
    media: false,
    description: false,
    price: false,
    contacts: false,
  });

  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showEditContactsModal, setShowEditContactsModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    motorcycleType: "",
    year: "",
    mileage: "",
    engineVolume: "",
    engineType: "",
    cylinderLayout: "",
    cylinderCount: "",
    power: "",
    drive: "",
    gearbox: "",
    strokes: "",
    color: "",
    hasElectricStarter: false,
    hasABS: false,
    vehicleStatus: "",
    isCustomsCleared: false,
    originCountry: "",
    pts: "",
    owners: "",
    isDamaged: false,
    photos: [] as string[],
    video: "",
    description: "",
    price: "",
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

  // Экран формы и экран проверки — отдельные ScrollView на мобильном: при переключении
  // каждый начинается сверху. На вебе скроллится окно — возвращаем его наверх.
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, [showPreview]);

  // Brands & models cascade from API. /brands?type=moto сейчас пуст, поэтому
  // марка/модель чаще всего вводятся вручную и хранятся именами — такие значения
  // нельзя слать в /models?brand_id= (бэкенд ждёт UUID → 422), каскад получает
  // только UUID.
  const { brands: apiBrands, models: apiModels } = useBrandCascade(
    "moto",
    cascadeId(formData.brand),
    cascadeId(formData.model),
  );

  // Years generated client-side (no API equivalent).
  const yearsList = Array.from({ length: 2026 - 1980 + 1 }, (_, i) => (2026 - i).toString());

  const brandsList = useMemo(
    () => apiBrands.map((b) => ({ id: b.id, label: b.name })),
    [apiBrands]
  );
  const availableModels = useMemo(
    () => apiModels.map((m) => ({ id: m.id, label: m.name })),
    [apiModels]
  );
  const motorcycleTypes = useMemo(
    () => (dicts?.moto_motorcycle_types ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const engineTypes = useMemo(
    () => (dicts?.moto_engine_types ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const cylinderLayouts = useMemo(
    () => (dicts?.moto_cylinder_layouts ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const driveTypes = useMemo(
    () => (dicts?.moto_drive_types ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const gearboxTypes = useMemo(
    () => (dicts?.moto_transmission_types ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const strokesTypes = useMemo(
    () => (dicts?.moto_strokes ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const ptsTypes = useMemo(
    () => (dicts?.pts_options ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );
  const ownersTypes = ["1", "2", "3", "4+"];
  const colorOptions = useMemo(
    () => (dicts?.colors ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.brand) newErrors.brand = "Обязательное поле";
    if (!formData.model) newErrors.model = "Обязательное поле";
    if (!formData.motorcycleType) newErrors.motorcycleType = "Обязательное поле";
    if (!formData.year) newErrors.year = "Обязательное поле";
    if (!formData.mileage) newErrors.mileage = "Обязательное поле";
    if (!formData.engineVolume) newErrors.engineVolume = "Обязательное поле";
    if (!formData.engineType) newErrors.engineType = "Обязательное поле";
    if (!formData.drive) newErrors.drive = "Обязательное поле";
    if (!formData.gearbox) newErrors.gearbox = "Обязательное поле";
    if (!formData.strokes) newErrors.strokes = "Обязательное поле";

    // "Откуда" required only when status is "На заказ"
    if (formData.vehicleStatus === "На заказ" && !formData.originCountry) {
      newErrors.originCountry = "Обязательное поле";
    }

    // Documents required only for "В наличии"
    if (formData.vehicleStatus === "В наличии") {
      if (!formData.pts) newErrors.pts = "Обязательное поле";
      if (!formData.owners) newErrors.owners = "Обязательное поле";
    }

    if (!formData.price) newErrors.price = "Обязательное поле";
    if (!formData.name) newErrors.name = "Обязательное поле";
    if (!formData.phone) newErrors.phone = "Обязательное поле";

    // City required for "В наличии", not required for "В пути", hidden for "На заказ"
    if (formData.vehicleStatus === "В наличии" && !formData.city) {
      newErrors.city = "Обязательное поле";
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
    // formData holds dictionary ids (slugs / UUIDs); buildMotoPayload renames
    // them into the PATCH /my/ads/:id contract, sets category='moto',
    // converts strokes/owners/status and packs ABS + starter into options.
    onPublish(buildMotoPayload(formData, subcategory));
  };

  const isFormValid =
    formData.brand && formData.model && formData.motorcycleType &&
    formData.year && formData.mileage && formData.engineVolume &&
    formData.engineType && formData.drive && formData.gearbox && formData.strokes &&
    formData.price && formData.name && formData.phone;

  // Check if at least one field has data
  const hasAnyData =
    formData.brand || formData.model || formData.motorcycleType ||
    formData.year || formData.mileage || formData.engineVolume ||
    formData.engineType || formData.cylinderLayout || formData.cylinderCount ||
    formData.power || formData.drive || formData.gearbox ||
    formData.strokes || formData.hasElectricStarter || formData.hasABS ||
    formData.vehicleStatus || formData.isCustomsCleared || formData.originCountry ||
    formData.pts || formData.owners || formData.isDamaged ||
    formData.description || formData.price || formData.photos.length > 0 || formData.video;

  // Кнопки закрытия в шапке формы нет (как на мобильном) — оставлено для паритета.
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

  const handleReset = async () => {
    const profile = await userStore.getProfile();
    setFormData({
      brand: "",
      model: "",
      motorcycleType: "",
      year: "",
      mileage: "",
      engineVolume: "",
      engineType: "",
      cylinderLayout: "",
      cylinderCount: "",
      power: "",
      drive: "",
      gearbox: "",
      strokes: "",
      color: "",
      hasElectricStarter: false,
      hasABS: false,
      vehicleStatus: "",
      isCustomsCleared: false,
      originCountry: "",
      pts: "",
      owners: "",
      isDamaged: false,
      photos: [] as string[],
      video: "",
      description: "",
      price: "",
      name: profile.name,
      phone: profile.phone,
      city: profile.city,
    });
    setErrors({});
    setAttemptedSubmit(false);
    setShowResetConfirmation(false);
    Toast.show({ type: "success", text1: "Форма очищена" });
  };

  // Show preview step if validated
  if (showPreview) {
    // Form holds API-shaped IDs; resolve to display labels for the preview screen.
    const labelOf = (items: { id: string; label: string }[], v: string) =>
      items.find((it) => it.id === v)?.label ?? v;
    const previewData = {
      ...formData,
      brand: labelOf(brandsList, formData.brand),
      model: labelOf(availableModels, formData.model),
      motorcycleType: labelOf(motorcycleTypes, formData.motorcycleType),
      engineType: labelOf(engineTypes, formData.engineType),
      cylinderLayout: labelOf(cylinderLayouts, formData.cylinderLayout),
      drive: labelOf(driveTypes, formData.drive),
      gearbox: labelOf(gearboxTypes, formData.gearbox),
      strokes: labelOf(strokesTypes, formData.strokes),
      color: labelOf(colorOptions, formData.color),
      pts: labelOf(ptsTypes, formData.pts),
    };
    return (
      <MotoPreviewStep
        onBack={() => setShowPreview(false)}
        onClose={onClose}
        onPublish={handlePublishConfirm}
        subcategory={subcategory}
        formData={previewData}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b border-border bg-background"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="mx-auto flex h-[55px] w-full max-w-[720px] flex-row items-center px-4">
          <button
            type="button"
            onClick={handleBackClick}
            className="-ml-2 flex size-10 items-center justify-center text-foreground"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <span className="flex-1 text-center text-[17px] font-semibold text-foreground">{subcategory}</span>
          <button type="button" onClick={() => setShowResetConfirmation(true)} className="px-2">
            <span className="text-[15px] font-medium text-[#D32F2F]">Сброс</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1">
        <div className="mx-auto w-full max-w-[720px] p-4">
          {/* 1. Основная информация */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.basic} onToggle={() => toggleSection("basic")}>
              Основная информация
            </SectionHeader>

            {expandedSections.basic && (
              <SectionBody>
                <div className="flex flex-col gap-2">
                  <span className={fieldLabelCls}>
                    Марка<Required />
                  </span>
                  <BottomSheetSelect
                    value={formData.brand}
                    onChange={(value) => setFormData({ ...formData, brand: value, model: "" })}
                    options={brandsList}
                    placeholder="Выберите марку"
                    title="Выберите марку"
                    error={attemptedSubmit ? errors.brand : undefined}
                    allowCustom
                    onAddCustom={() => setShowAddBrandModal(true)}
                    customButtonText="Добавить марку"
                  />
                </div>

                <div className="flex flex-col gap-2">
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
              </SectionBody>
            )}
          </SectionCard>

          {/* 2. Тип мотоцикла */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.type} onToggle={() => toggleSection("type")}>
              Тип мотоцикла<Required />
            </SectionHeader>

            {expandedSections.type && (
              <SectionBody>
                <BottomSheetSelect
                  value={formData.motorcycleType}
                  onChange={(value) => setFormData({ ...formData, motorcycleType: value })}
                  options={motorcycleTypes}
                  placeholder="Выберите тип"
                  error={attemptedSubmit ? errors.motorcycleType : undefined}
                />
              </SectionBody>
            )}
          </SectionCard>

          {/* 3. Год */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.year} onToggle={() => toggleSection("year")}>
              Год<Required />
            </SectionHeader>

            {expandedSections.year && (
              <SectionBody>
                <BottomSheetSelect
                  value={formData.year}
                  onChange={(value) => setFormData({ ...formData, year: value })}
                  options={yearsList}
                  placeholder="Выберите год"
                  error={attemptedSubmit ? errors.year : undefined}
                />
              </SectionBody>
            )}
          </SectionCard>

          {/* 4. Пробег, км */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.mileage} onToggle={() => toggleSection("mileage")}>
              Пробег, км<Required />
            </SectionHeader>

            {expandedSections.mileage && (
              <SectionBody>
                <input
                  placeholder="Пробег, км"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  inputMode="numeric"
                  className={cn(textInputCls, attemptedSubmit && errors.mileage ? textInputErrorCls : undefined)}
                />
                {attemptedSubmit && errors.mileage && (
                  <span className={errorTextCls}>{errors.mileage}</span>
                )}
              </SectionBody>
            )}
          </SectionCard>

          {/* 5. Объём, см3 */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.volume} onToggle={() => toggleSection("volume")}>
              {"Объём, см³"}<Required />
            </SectionHeader>

            {expandedSections.volume && (
              <SectionBody>
                <input
                  placeholder={"Объём, см³"}
                  value={formData.engineVolume}
                  onChange={(e) => setFormData({ ...formData, engineVolume: e.target.value })}
                  inputMode="numeric"
                  className={cn(textInputCls, attemptedSubmit && errors.engineVolume ? textInputErrorCls : undefined)}
                />
                {attemptedSubmit && errors.engineVolume && (
                  <span className={errorTextCls}>{errors.engineVolume}</span>
                )}
              </SectionBody>
            )}
          </SectionCard>

          {/* 6. Двигатель */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.engine} onToggle={() => toggleSection("engine")}>
              Двигатель<Required />
            </SectionHeader>

            {expandedSections.engine && (
              <SectionBody>
                <BottomSheetSelect
                  value={formData.engineType}
                  onChange={(value) => setFormData({ ...formData, engineType: value })}
                  options={engineTypes}
                  placeholder="Выберите тип двигателя"
                  error={attemptedSubmit ? errors.engineType : undefined}
                />
              </SectionBody>
            )}
          </SectionCard>

          {/* 7. Расположение цилиндров */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.cylinderLayout} onToggle={() => toggleSection("cylinderLayout")}>
              Расположение цилиндров
            </SectionHeader>

            {expandedSections.cylinderLayout && (
              <SectionBody>
                <BottomSheetSelect
                  value={formData.cylinderLayout}
                  onChange={(value) => setFormData({ ...formData, cylinderLayout: value })}
                  options={cylinderLayouts}
                  placeholder="Выберите расположение"
                />
              </SectionBody>
            )}
          </SectionCard>

          {/* 8. Кол-во цилиндров */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.cylinderCount} onToggle={() => toggleSection("cylinderCount")}>
              Кол-во цилиндров
            </SectionHeader>

            {expandedSections.cylinderCount && (
              <SectionBody>
                <input
                  placeholder="Кол-во цилиндров"
                  value={formData.cylinderCount}
                  onChange={(e) => setFormData({ ...formData, cylinderCount: e.target.value })}
                  inputMode="numeric"
                  className={cn(textInputCls, themedInputCls)}
                />
              </SectionBody>
            )}
          </SectionCard>

          {/* 9. Мощность, л.с. */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.power} onToggle={() => toggleSection("power")}>
              Мощность, л.с.
            </SectionHeader>

            {expandedSections.power && (
              <SectionBody>
                <input
                  placeholder="Мощность, л.с."
                  value={formData.power}
                  onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                  inputMode="numeric"
                  className={cn(textInputCls, themedInputCls)}
                />
              </SectionBody>
            )}
          </SectionCard>

          {/* 10. Привод */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.drive} onToggle={() => toggleSection("drive")}>
              Привод<Required />
            </SectionHeader>

            {expandedSections.drive && (
              <SectionBody>
                <BottomSheetSelect
                  value={formData.drive}
                  onChange={(value) => setFormData({ ...formData, drive: value })}
                  options={driveTypes}
                  placeholder="Выберите привод"
                  error={attemptedSubmit ? errors.drive : undefined}
                />
              </SectionBody>
            )}
          </SectionCard>

          {/* 11. Коробка */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.gearbox} onToggle={() => toggleSection("gearbox")}>
              Коробка<Required />
            </SectionHeader>

            {expandedSections.gearbox && (
              <SectionBody>
                <BottomSheetSelect
                  value={formData.gearbox}
                  onChange={(value) => setFormData({ ...formData, gearbox: value })}
                  options={gearboxTypes}
                  placeholder="Выберите коробку передач"
                  error={attemptedSubmit ? errors.gearbox : undefined}
                />
              </SectionBody>
            )}
          </SectionCard>

          {/* 12. Число тактов */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.strokes} onToggle={() => toggleSection("strokes")}>
              Число тактов<Required />
            </SectionHeader>

            {expandedSections.strokes && (
              <SectionBody>
                <BottomSheetSelect
                  value={formData.strokes}
                  onChange={(value) => setFormData({ ...formData, strokes: value })}
                  options={strokesTypes}
                  placeholder="Выберите число тактов"
                  error={attemptedSubmit ? errors.strokes : undefined}
                />
              </SectionBody>
            )}
          </SectionCard>

          {/* 13. Цвет */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.color} onToggle={() => toggleSection("color")}>
              Цвет
            </SectionHeader>

            {expandedSections.color && (
              <SectionBody>
                <BottomSheetSelect
                  value={formData.color}
                  onChange={(value) => setFormData({ ...formData, color: value })}
                  options={colorOptions}
                  placeholder="Выберите цвет"
                  title="Выберите цвет"
                />
              </SectionBody>
            )}
          </SectionCard>

          {/* 14. Комплектация */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.equipment} onToggle={() => toggleSection("equipment")}>
              Комплектация
            </SectionHeader>

            {expandedSections.equipment && (
              <SectionBody>
                <div className="mb-1">
                  <CustomCheckbox
                    checked={formData.hasElectricStarter}
                    onChange={(checked) => setFormData({ ...formData, hasElectricStarter: checked })}
                    label="Электростартер"
                  />
                </div>
                <div className="mb-1">
                  <CustomCheckbox
                    checked={formData.hasABS}
                    onChange={(checked) => setFormData({ ...formData, hasABS: checked })}
                    label="Антиблокировочная система (ABS)"
                  />
                </div>
              </SectionBody>
            )}
          </SectionCard>

          {/* 15. Статус мото */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.vehicleStatus} onToggle={() => toggleSection("vehicleStatus")}>
              Статус мото
            </SectionHeader>

            {expandedSections.vehicleStatus && (
              <SectionBody>
                {/* Radio buttons for status */}
                {["В наличии", "На заказ"].map((status) => (
                  <button
                    type="button"
                    key={status}
                    onClick={() => {
                      if (status !== "На заказ") {
                        setFormData({ ...formData, vehicleStatus: status, originCountry: "" });
                      } else {
                        setFormData({ ...formData, vehicleStatus: status });
                      }
                    }}
                    className={cn(
                      "flex h-[48px] w-full flex-col justify-center rounded-[12px] bg-white px-4 text-left",
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

                {/* Toggle "Не растаможен" - always visible */}
                <div className="flex h-[48px] flex-row items-center justify-between rounded-[12px] border border-border bg-card px-4">
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-[15px] font-normal text-foreground">Не растаможен</span>
                    <button
                      type="button"
                      onClick={() => setShowInfoModal(true)}
                      className="flex size-5 items-center justify-center"
                    >
                      <Info color="#8E8E93" size={20} strokeWidth={1.5} />
                    </button>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.isCustomsCleared}
                    onClick={() => setFormData({ ...formData, isCustomsCleared: !formData.isCustomsCleared })}
                    className={cn(
                      "flex h-[28px] w-[48px] flex-row items-center rounded-[14px] px-[2px]",
                      formData.isCustomsCleared ? "justify-end bg-black" : "justify-start bg-[#C7C7CC]",
                    )}
                  >
                    <span className="size-6 rounded-full bg-white" />
                  </button>
                </div>

                {/* "Откуда" field - shown only for "На заказ" */}
                {formData.vehicleStatus === "На заказ" && (
                  <div className="flex flex-col gap-2">
                    <span className={fieldLabelCls}>
                      Откуда<Required />
                    </span>
                    <input
                      placeholder="Например: Корея, Япония, Германия"
                      value={formData.originCountry}
                      onChange={(e) => setFormData({ ...formData, originCountry: e.target.value })}
                      className={cn(textInputCls, attemptedSubmit && errors.originCountry ? textInputErrorCls : undefined)}
                    />
                    {attemptedSubmit && errors.originCountry && (
                      <span className={errorTextCls}>{errors.originCountry}</span>
                    )}
                  </div>
                )}
              </SectionBody>
            )}
          </SectionCard>

          {/* 16. Документы - only shown for "В наличии" */}
          {formData.vehicleStatus === "В наличии" && (
            <SectionCard>
              <SectionHeader expanded={expandedSections.documents} onToggle={() => toggleSection("documents")}>
                Документы
              </SectionHeader>

              {expandedSections.documents && (
                <SectionBody>
                  <div className="flex flex-col gap-2">
                    <span className={fieldLabelCls}>
                      Паспорт транспортного средства<Required />
                    </span>
                    <BottomSheetSelect
                      value={formData.pts}
                      onChange={(value) => setFormData({ ...formData, pts: value })}
                      options={ptsTypes}
                      placeholder="Выберите вариант"
                      error={attemptedSubmit ? errors.pts : undefined}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className={fieldLabelCls}>
                      Владельцев по ПТС<Required />
                    </span>
                    <BottomSheetSelect
                      value={formData.owners}
                      onChange={(value) => setFormData({ ...formData, owners: value })}
                      options={ownersTypes}
                      placeholder="Выберите количество"
                      error={attemptedSubmit ? errors.owners : undefined}
                    />
                  </div>
                </SectionBody>
              )}
            </SectionCard>
          )}

          {/* Состояние транспорта (битый/не на ходу) - always shown */}
          <SectionCard>
            <div className="p-4">
              <CustomCheckbox
                checked={formData.isDamaged}
                onChange={(checked) => setFormData({ ...formData, isDamaged: checked })}
                label="Битый или не на ходу"
              />
            </div>
          </SectionCard>

          {/* 17. Медиа */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.media} onToggle={() => toggleSection("media")}>
              Фото и видео
            </SectionHeader>

            {expandedSections.media && (
              <SectionBody>
                {/* Photos */}
                <div className="flex flex-col">
                  <div className="mb-2 flex flex-row items-center justify-between">
                    <span className={fieldLabelCls}>Фото</span>
                    {formData.photos.length > 0 && (
                      <span className="text-[12px] font-normal text-muted-foreground">{formData.photos.length} / 30</span>
                    )}
                  </div>

                  {/* Photo Grid */}
                  {formData.photos.length > 0 && (
                    <div className="mb-3 flex flex-row flex-wrap gap-2">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative aspect-square w-[31%] overflow-hidden rounded-[12px] bg-secondary">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photo} alt="" className="size-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60"
                          >
                            <X color="#FFFFFF" size={14} strokeWidth={2} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Photo Button */}
                  {formData.photos.length < 30 && (
                    <button
                      type="button"
                      onClick={handlePhotoUpload}
                      className="flex h-[128px] w-full flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-border bg-card"
                    >
                      <Camera color="#8E8E93" size={32} strokeWidth={1.5} />
                      <span className="text-[15px] font-normal text-foreground">Добавить фото</span>
                      <span className="text-[12px] font-normal text-muted-foreground">До 30 фото</span>
                    </button>
                  )}
                </div>

                {/* Video */}
                <div className="flex flex-col gap-2">
                  <span className={fieldLabelCls}>Видео</span>

                  {formData.video ? (
                    <div className="relative aspect-video overflow-hidden rounded-[12px] bg-[#F2F2F7]">
                      <video
                        src={formData.video}
                        muted
                        playsInline
                        preload="metadata"
                        className="size-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="flex size-16 items-center justify-center rounded-full bg-white/90">
                          <Video className="text-foreground" size={32} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/60"
                      >
                        <X color="#FFFFFF" size={18} strokeWidth={2} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleVideoUpload}
                      className="flex h-[128px] w-full flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-border bg-card"
                    >
                      <Video color="#8E8E93" size={32} strokeWidth={1.5} />
                      <span className="text-[15px] font-normal text-foreground">Добавить видео</span>
                      <span className="text-[12px] font-normal text-muted-foreground">До 60 секунд</span>
                    </button>
                  )}
                </div>
              </SectionBody>
            )}
          </SectionCard>

          {/* 18. Описание */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.description} onToggle={() => toggleSection("description")}>
              Описание
            </SectionHeader>

            {expandedSections.description && (
              <SectionBody>
                <textarea
                  placeholder="Опишите состояние мотоцикла, особенности и комплектацию"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="field-sizing-content min-h-[120px] w-full resize-none rounded-[12px] border border-border bg-card px-4 py-3 align-top text-[15px] font-normal text-foreground outline-none placeholder:text-[#8E8E93]"
                />
              </SectionBody>
            )}
          </SectionCard>

          {/* 19. Цена */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.price} onToggle={() => toggleSection("price")}>
              Цена<Required />
            </SectionHeader>

            {expandedSections.price && (
              <SectionBody>
                <div className="flex flex-row items-center gap-2">
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
                {attemptedSubmit && errors.price && (
                  <span className={errorTextCls}>{errors.price}</span>
                )}
              </SectionBody>
            )}
          </SectionCard>

          {/* 20. Контакты */}
          <SectionCard>
            <SectionHeader expanded={expandedSections.contacts} onToggle={() => toggleSection("contacts")}>
              Контакты
            </SectionHeader>

            {expandedSections.contacts && (
              <SectionBody>
                {/* Contact Info Display */}
                <div className="flex flex-col gap-3 rounded-[12px] border border-border bg-card p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-normal text-muted-foreground">Имя</span>
                    <span className="text-[15px] font-medium text-foreground">{formData.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-normal text-muted-foreground">Номер телефона</span>
                    <span className="text-[15px] font-medium text-foreground">+992 {formData.phone}</span>
                  </div>
                  {formData.vehicleStatus !== "На заказ" && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-normal text-muted-foreground">Город</span>
                      <span className="text-[15px] font-medium text-foreground">{formData.city || "Не указан"}</span>
                    </div>
                  )}
                  {formData.vehicleStatus === "На заказ" && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-normal text-muted-foreground">Страна заказа</span>
                      <span className="text-[15px] font-medium text-foreground">{formData.originCountry}</span>
                    </div>
                  )}
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
                  <div className="flex flex-col rounded-[12px] border border-[#FF3B30] bg-[#FFF3F3] p-3">
                    {errors.name && (
                      <span className="mb-1 text-[13px] font-normal text-[#FF3B30]">{"•"} {errors.name}</span>
                    )}
                    {errors.phone && (
                      <span className="mb-1 text-[13px] font-normal text-[#FF3B30]">{"•"} {errors.phone}</span>
                    )}
                    {errors.city && (
                      <span className="mb-1 text-[13px] font-normal text-[#FF3B30]">{"•"} {errors.city}</span>
                    )}
                  </div>
                )}
              </SectionBody>
            )}
          </SectionCard>

          {/* Bottom padding for floating button */}
          <div className="h-[calc(96px+env(safe-area-inset-bottom,0px))]" />
        </div>
      </div>

      {/* Floating Submit Button */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background">
        <div className="mx-auto w-full max-w-[720px] px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className={cn(
              "flex h-[56px] w-full items-center justify-center rounded-[16px]",
              isFormValid && !isLoading ? "bg-[#111111]" : "bg-[#E5E5EA]",
            )}
          >
            {isLoading ? (
              <Loader2 color="#FFFFFF" className="size-5 animate-spin" />
            ) : (
              <span
                className={cn(
                  "text-[17px] font-semibold",
                  isFormValid ? "text-white" : "text-[#9E9E9E]",
                )}
              >
                Опубликовать объявление
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Add Brand Modal */}
      <AddValueModal
        isOpen={showAddBrandModal}
        onClose={() => setShowAddBrandModal(false)}
        onAdd={(value) => setFormData({ ...formData, brand: value, model: "" })}
        title="Добавить марку"
        placeholder="Введите марку"
        buttonText="Добавить"
      />

      {/* Add Model Modal */}
      <AddValueModal
        isOpen={showAddModelModal}
        onClose={() => setShowAddModelModal(false)}
        onAdd={(value) => setFormData({ ...formData, model: value })}
        title="Добавить модель"
        placeholder="Введите модель"
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
        cancelText="Отмена"
        confirmText="Сбросить"
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
