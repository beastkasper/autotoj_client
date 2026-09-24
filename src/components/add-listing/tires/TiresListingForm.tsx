"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, X, Camera, Loader2 } from "lucide-react";
import { BottomSheetSelect } from "@/components/add-listing/form/BottomSheetSelect";
import { AddValueModal } from "@/components/add-listing/form/AddValueModal";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";
import { EditContactsModal } from "@/components/add-listing/form/EditContactsModal";
import { ExitConfirmationModal } from "@/components/add-listing/modals/ExitConfirmationModal";
import { BackConfirmationModal } from "@/components/add-listing/modals/BackConfirmationModal";
import { TiresPreviewStep } from "@/components/add-listing/tires/TiresPreviewStep";
import { userStore } from "@/lib/add-listing/userStore";
import { Toast } from "@/lib/add-listing/alert";
import { pickPhotos } from "@/lib/add-listing/photoPicker";
import { buildTiresPayload, type PartPayload } from "@/lib/add-listing/partPayload";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 10;

// Styles (1:1 с мобильным StyleSheet)
const sectionCardCls = "mb-[12px] overflow-hidden rounded-[16px] bg-secondary";
const sectionHeaderCls = "flex w-full flex-row items-center justify-between px-[16px] py-[16px] text-left";
const sectionTitleCls = "flex-1 text-[16px] font-semibold text-foreground";
const sectionBodyCls = "flex flex-col gap-[12px] px-[16px] pb-[16px]";
const fieldGroupCls = "flex flex-col gap-[8px]";
const fieldLabelCls = "text-[14px] font-medium text-foreground";
const requiredCls = "text-[#E53935]";
// styles.textInput (жёсткие цвета как в мобильном)
const textInputCls =
  "h-[48px] w-full rounded-[12px] border border-[#C7C7CC] bg-[#FFFFFF] px-[16px] text-[15px] font-normal text-[#000000] outline-none placeholder:text-[#8E8E93]";
const textInputErrorCls = "border-[#E53935]";
// styles.textInput + { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }
const textInputThemedCls =
  "h-[48px] w-full rounded-[12px] border border-border bg-card px-[16px] text-[15px] font-normal text-foreground outline-none placeholder:text-[#8E8E93]";
const errorTextCls = "mt-[4px] text-[12px] font-normal text-[#E53935]";

interface TiresListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartPayload) => void;
}

function SectionChevron({ expanded }: { expanded: boolean }) {
  return expanded ? (
    <ChevronUp size={20} className="shrink-0 text-foreground" />
  ) : (
    <ChevronDown size={20} className="shrink-0 text-foreground" />
  );
}

function Toggle({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <div className="flex h-[48px] flex-row items-center justify-between rounded-[12px] border border-border bg-card px-[16px]">
      <span className="text-[15px] font-normal text-foreground">{label}</span>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex h-[28px] w-[48px] flex-col justify-center rounded-[14px] px-[2px]",
          value ? "bg-[#000000]" : "bg-[#C7C7CC]",
        )}
      >
        <span
          className={cn(
            "block size-[24px] rounded-[12px] bg-[#FFFFFF]",
            value ? "self-end" : "self-start",
          )}
        />
      </button>
    </div>
  );
}

export function TiresListingForm({ onBack, onClose, onPublish }: TiresListingFormProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: false,
    size: false,
    characteristics: false,
    manufacturer: false,
    quantity: false,
    media: false,
    description: false,
    price: false,
    contacts: false,
  });

  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showEditContactsModal, setShowEditContactsModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleType: "",
    tireType: "",
    condition: "",
    width: "",
    profile: "",
    diameter: "",
    loadIndex: "",
    speedIndex: "",
    runFlat: false,
    studded: false,
    reinforced: false,
    brand: "",
    model: "",
    countryOfOrigin: "",
    photos: [] as string[],
    description: "",
    price: "",
    quantity: "",
    name: "",
    phone: "",
    city: "",
  });

  // Data for selects
  const VEHICLE_TYPES = ["Легковые", "Мото", "Коммерческие"];
  const TIRE_TYPES = ["Летние", "Зимние", "Всесезонные"];
  const CONDITIONS = ["Новые", "Б/у"];
  const TIRE_BRANDS = [
    "Michelin", "Bridgestone", "Continental", "Goodyear", "Pirelli",
    "Dunlop", "Yokohama", "Hankook", "Nokian", "Toyo",
    "Cooper", "BFGoodrich", "Firestone", "Kumho", "Maxxis",
    "Nitto", "Falken", "General Tire", "Nexen", "GT Radial",
  ];
  const CITIES = [
    "Душанбе", "Худжанд", "Куляб", "Курган-Тюбе", "Истаравшан",
    "Вахдат", "Турсунзаде", "Хорог", "Пенджикент", "Канибадам",
  ];

  // Load user profile data on mount (async in mobile)
  useEffect(() => {
    const loadProfile = async () => {
      const profile = await userStore.getProfile();
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        phone: profile.phone || "",
        city: profile.city || "",
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

  const isFormValid =
    formData.tireType &&
    formData.condition &&
    formData.width &&
    formData.profile &&
    formData.diameter &&
    formData.price &&
    formData.phone &&
    formData.phone.length === 9;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tireType) newErrors.tireType = "Обязательное поле";
    if (!formData.condition) newErrors.condition = "Обязательное поле";
    if (!formData.width) newErrors.width = "Обязательное поле";
    if (!formData.profile) newErrors.profile = "Обязательное поле";
    if (!formData.diameter) newErrors.diameter = "Обязательное поле";
    if (!formData.price) newErrors.price = "Обязательное поле";
    if (!formData.phone) newErrors.phone = "Обязательное поле";
    if (formData.phone && formData.phone.length !== 9) newErrors.phone = "Номер должен содержать 9 цифр";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setAttemptedSubmit(true);

    if (validateForm()) {
      setShowPreview(true);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePublishConfirm = () => {
    setIsLoading(true);
    onPublish(buildTiresPayload(formData));
  };

  // Check if at least one field has data
  const hasAnyData =
    formData.vehicleType || formData.tireType || formData.condition ||
    formData.width || formData.profile || formData.diameter ||
    formData.loadIndex || formData.speedIndex ||
    formData.runFlat || formData.studded || formData.reinforced ||
    formData.brand || formData.model || formData.countryOfOrigin ||
    formData.description || formData.price || formData.quantity ||
    formData.photos.length > 0;

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
    const remaining = MAX_PHOTOS - formData.photos.length;
    const uris = await pickPhotos({ remaining });
    if (uris.length === 0) return;
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...uris].slice(0, MAX_PHOTOS),
    }));
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleReset = async () => {
    const profile = await userStore.getProfile();
    setFormData({
      vehicleType: "",
      tireType: "",
      condition: "",
      width: "",
      profile: "",
      diameter: "",
      loadIndex: "",
      speedIndex: "",
      runFlat: false,
      studded: false,
      reinforced: false,
      brand: "",
      model: "",
      countryOfOrigin: "",
      photos: [] as string[],
      description: "",
      price: "",
      quantity: "",
      name: profile.name || "",
      phone: profile.phone || "",
      city: profile.city || "",
    });
    setErrors({});
    setAttemptedSubmit(false);
    setShowResetConfirmation(false);
    Toast.show({ type: "success", text1: "Форма очищена" });
  };

  const formatPrice = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Show preview step if validated
  if (showPreview) {
    return (
      <TiresPreviewStep
        formData={formData}
        onBack={() => setShowPreview(false)}
        onClose={onClose}
        onPublish={handlePublishConfirm}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b border-border bg-background"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          height: "calc(56px + env(safe-area-inset-top, 0px))",
        }}
      >
        <div className="mx-auto flex h-full w-full max-w-[720px] flex-row items-center px-[16px]">
          <button
            type="button"
            onClick={handleBackClick}
            className="ml-[-8px] flex size-[40px] items-center justify-center"
          >
            <ChevronLeft size={24} strokeWidth={1.5} className="text-foreground" />
          </button>
          <span className="flex-1 text-center text-[17px] font-semibold text-foreground">Шины</span>
          <button type="button" onClick={() => setShowResetConfirmation(true)} className="px-[8px]">
            <span className="text-[15px] font-medium text-[#D32F2F]">Сброс</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1">
        <div
          className="mx-auto w-full max-w-[720px] p-[16px]"
          style={{ paddingBottom: "calc(105px + env(safe-area-inset-bottom, 0px))" }}
        >
          {/* 1. Basic Info */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("basic")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Основная информация</span>
              <SectionChevron expanded={expandedSections.basic} />
            </button>

            {expandedSections.basic && (
              <div className={sectionBodyCls}>
                {/* Tire Type */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Тип шин<span className={requiredCls}> *</span>
                  </span>
                  <BottomSheetSelect
                    title="Тип шин"
                    options={TIRE_TYPES}
                    value={formData.tireType}
                    onChange={(value) => setFormData({ ...formData, tireType: value })}
                    placeholder="Выберите тип"
                    error={attemptedSubmit ? errors.tireType : undefined}
                  />
                </div>

                {/* Condition */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Состояние<span className={requiredCls}> *</span>
                  </span>
                  <BottomSheetSelect
                    title="Состояние"
                    options={CONDITIONS}
                    value={formData.condition}
                    onChange={(value) => setFormData({ ...formData, condition: value })}
                    placeholder="Выберите состояние"
                    error={attemptedSubmit ? errors.condition : undefined}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Quantity */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("quantity")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Количество</span>
              <SectionChevron expanded={expandedSections.quantity} />
            </button>

            {expandedSections.quantity && (
              <div className={sectionBodyCls}>
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Количество шин</span>
                  <input
                    type="text"
                    placeholder="Например: 4"
                    value={formData.quantity}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, quantity: value });
                    }}
                    inputMode="numeric"
                    className={textInputThemedCls}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Size */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("size")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Размер</span>
              <SectionChevron expanded={expandedSections.size} />
            </button>

            {expandedSections.size && (
              <div className={sectionBodyCls}>
                {/* Width */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Ширина<span className={requiredCls}> *</span>
                  </span>
                  <input
                    type="text"
                    placeholder="Например: 205"
                    value={formData.width}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, width: value });
                    }}
                    inputMode="numeric"
                    className={cn(textInputCls, attemptedSubmit && errors.width ? textInputErrorCls : undefined)}
                  />
                  {attemptedSubmit && errors.width && <span className={errorTextCls}>{errors.width}</span>}
                </div>

                {/* Profile */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Профиль<span className={requiredCls}> *</span>
                  </span>
                  <input
                    type="text"
                    placeholder="Например: 55"
                    value={formData.profile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, profile: value });
                    }}
                    inputMode="numeric"
                    className={cn(textInputCls, attemptedSubmit && errors.profile ? textInputErrorCls : undefined)}
                  />
                  {attemptedSubmit && errors.profile && <span className={errorTextCls}>{errors.profile}</span>}
                </div>

                {/* Diameter */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Диаметр (R)<span className={requiredCls}> *</span>
                  </span>
                  <input
                    type="text"
                    placeholder="Например: 16"
                    value={formData.diameter}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, diameter: value });
                    }}
                    inputMode="numeric"
                    className={cn(textInputCls, attemptedSubmit && errors.diameter ? textInputErrorCls : undefined)}
                  />
                  {attemptedSubmit && errors.diameter && <span className={errorTextCls}>{errors.diameter}</span>}
                </div>
              </div>
            )}
          </div>

          {/* 4. Characteristics */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("characteristics")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Характеристики</span>
              <SectionChevron expanded={expandedSections.characteristics} />
            </button>

            {expandedSections.characteristics && (
              <div className={sectionBodyCls}>
                {/* Load Index */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Индекс нагрузки</span>
                  <input
                    type="text"
                    placeholder="Например: 91"
                    value={formData.loadIndex}
                    onChange={(e) => setFormData({ ...formData, loadIndex: e.target.value })}
                    className={textInputThemedCls}
                  />
                </div>

                {/* Speed Index */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Индекс скорости</span>
                  <input
                    type="text"
                    placeholder="Например: H"
                    value={formData.speedIndex}
                    onChange={(e) => setFormData({ ...formData, speedIndex: e.target.value })}
                    className={textInputThemedCls}
                  />
                </div>

                {/* RunFlat Toggle */}
                <Toggle
                  label="RunFlat"
                  value={formData.runFlat}
                  onToggle={() => setFormData({ ...formData, runFlat: !formData.runFlat })}
                />

                {/* Studded Toggle */}
                <Toggle
                  label="Шипы"
                  value={formData.studded}
                  onToggle={() => setFormData({ ...formData, studded: !formData.studded })}
                />

                {/* Reinforced Toggle */}
                <Toggle
                  label="Усиленные (XL)"
                  value={formData.reinforced}
                  onToggle={() => setFormData({ ...formData, reinforced: !formData.reinforced })}
                />
              </div>
            )}
          </div>

          {/* 5. Manufacturer */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("manufacturer")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Производитель</span>
              <SectionChevron expanded={expandedSections.manufacturer} />
            </button>

            {expandedSections.manufacturer && (
              <div className={sectionBodyCls}>
                {/* Brand */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Бренд</span>
                  <BottomSheetSelect
                    title="Бренд шин"
                    options={TIRE_BRANDS}
                    value={formData.brand}
                    onChange={(value) => setFormData({ ...formData, brand: value })}
                    placeholder="Выберите бренд"
                    allowCustom
                    onAddCustom={() => setShowAddBrandModal(true)}
                    customButtonText="Добавить бренд"
                  />
                </div>

                {/* Model */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Модель</span>
                  <input
                    type="text"
                    placeholder="Например: Pilot Sport 4"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className={textInputThemedCls}
                  />
                </div>

                {/* Country of Origin */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Страна производства</span>
                  <input
                    type="text"
                    placeholder="Например: Германия"
                    value={formData.countryOfOrigin}
                    onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })}
                    className={textInputThemedCls}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 6. Media */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("media")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Медиа</span>
              <SectionChevron expanded={expandedSections.media} />
            </button>

            {expandedSections.media && (
              <div className={sectionBodyCls}>
                {/* Photos */}
                <div className="flex flex-col">
                  <div className="mb-[8px] flex flex-row items-center justify-between">
                    <span className={fieldLabelCls}>Фото</span>
                    <span className="text-[12px] font-normal text-muted-foreground">
                      {formData.photos.length}/10
                    </span>
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
                          <img src={photo} alt="" className="size-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute right-[4px] top-[4px] flex size-[24px] items-center justify-center rounded-[12px] bg-[rgba(0,0,0,0.6)]"
                          >
                            <X size={14} strokeWidth={2} color="#FFFFFF" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Photo Button */}
                  {formData.photos.length < 10 && (
                    <button
                      type="button"
                      onClick={handlePhotoUpload}
                      className="flex h-[128px] w-full flex-col items-center justify-center gap-[8px] rounded-[12px] border-2 border-dashed border-border bg-card"
                    >
                      <Camera size={32} strokeWidth={1.5} color="#8E8E93" />
                      <span className="text-[15px] font-normal text-foreground">Добавить фото</span>
                      <span className="text-[12px] font-normal text-muted-foreground">До 10 фото</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 7. Description */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("description")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Описание</span>
              <SectionChevron expanded={expandedSections.description} />
            </button>

            {expandedSections.description && (
              <div className={sectionBodyCls}>
                <textarea
                  placeholder="Опишите состояние, остаток протектора, любую важную информацию..."
                  value={formData.description}
                  onChange={(e) => {
                    const text = e.target.value;
                    if (text.length <= 1000) {
                      setFormData({ ...formData, description: text });
                    }
                  }}
                  className="min-h-[120px] w-full resize-none rounded-[12px] border border-border bg-card px-[16px] py-[12px] text-[15px] font-normal text-foreground outline-none placeholder:text-[#8E8E93]"
                />
                <div className="mt-[4px] flex flex-col items-end">
                  <span className="text-[13px] font-normal text-[#8E8E93]">
                    {1000 - formData.description.length}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 8. Price */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("price")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>
                Цена<span className={requiredCls}> *</span>
              </span>
              <SectionChevron expanded={expandedSections.price} />
            </button>

            {expandedSections.price && (
              <div className={sectionBodyCls}>
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Цена<span className={requiredCls}> *</span>
                  </span>
                  <div className="flex flex-row items-center gap-[8px]">
                    <input
                      type="text"
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: formatPrice(e.target.value) })}
                      inputMode="numeric"
                      className={cn(
                        textInputCls,
                        "w-auto min-w-0 flex-1",
                        attemptedSubmit && errors.price ? textInputErrorCls : undefined,
                      )}
                    />
                    <span className="text-[15px] font-normal text-muted-foreground">сомони</span>
                  </div>
                  {attemptedSubmit && errors.price && <span className={errorTextCls}>{errors.price}</span>}
                </div>
              </div>
            )}
          </div>

          {/* 9. Contacts */}
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
                    <span className="text-[15px] font-medium text-foreground">{formData.name || "Не указано"}</span>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[12px] font-normal text-muted-foreground">Телефон</span>
                    <span className="text-[15px] font-medium text-foreground">
                      {formData.phone ? `+992 ${formData.phone}` : "Не указано"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[12px] font-normal text-muted-foreground">Город</span>
                    <span className="text-[15px] font-medium text-foreground">{formData.city || "Не указано"}</span>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => setShowEditContactsModal(true)}
                  className="flex h-[48px] w-full items-center justify-center rounded-[12px] bg-[#F2F2F7]"
                >
                  <span className="text-[15px] font-medium text-foreground">Изменить данные</span>
                </button>

                {/* Error messages if validation fails */}
                {attemptedSubmit && errors.phone && (
                  <div className="rounded-[12px] border border-[#FF3B30] bg-[#FFF3F3] p-[12px]">
                    {errors.phone && (
                      <p className="mb-[4px] text-[13px] font-normal text-[#FF3B30]">
                        {"•"} {errors.phone}
                      </p>
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
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background">
        <div
          className="mx-auto w-full max-w-[720px] p-[16px]"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom, 0px))" }}
        >
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
              <Loader2 className="size-5 animate-spin" color="#FFFFFF" />
            ) : (
              <span
                className={cn(
                  "text-[17px] font-semibold",
                  isFormValid ? "text-[#FFFFFF]" : "text-[#9E9E9E]",
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
        onAdd={(value) => setFormData({ ...formData, brand: value })}
        title="Добавить бренд"
        placeholder="Введите название бренда"
        buttonText="Добавить"
      />

      {/* Add City Modal */}
      <AddValueModal
        isOpen={showAddCityModal}
        onClose={() => setShowAddCityModal(false)}
        onAdd={(value) => setFormData({ ...formData, city: value })}
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
        cancelText="Отмена"
        confirmText="Сбросить"
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
