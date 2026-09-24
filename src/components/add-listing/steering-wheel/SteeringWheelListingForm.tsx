"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, X, Camera, Loader2 } from "lucide-react";
import { BottomSheetSelect } from "@/components/add-listing/form/BottomSheetSelect";
import { AddValueModal } from "@/components/add-listing/form/AddValueModal";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";
import { ExitConfirmationModal } from "@/components/add-listing/modals/ExitConfirmationModal";
import { BackConfirmationModal } from "@/components/add-listing/modals/BackConfirmationModal";
import { EditContactsModal } from "@/components/add-listing/form/EditContactsModal";
import { SteeringWheelPreviewStep } from "@/components/add-listing/steering-wheel/SteeringWheelPreviewStep";
import { userStore } from "@/lib/add-listing/userStore";
import { Toast } from "@/lib/add-listing/alert";
import { pickPhotos } from "@/lib/add-listing/photoPicker";
import { buildSteeringWheelPayload, type PartPayload } from "@/lib/add-listing/partPayload";
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
const errorTextCls = "mt-[4px] text-[12px] font-normal text-[#E53935]";

interface SteeringWheelListingFormProps {
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

export function SteeringWheelListingForm({ onBack, onClose, onPublish }: SteeringWheelListingFormProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: false,
    parameters: false,
    compatibility: false,
    media: false,
    description: false,
    price: false,
    contacts: false,
  });

  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showEditContactsModal, setShowEditContactsModal] = useState(false);
  const [customCityInput, setCustomCityInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleType: "",
    condition: "",
    wheelType: "",
    diameter: "",
    material: "",
    carBrand: "",
    carModel: "",
    carYear: "",
    photos: [] as string[],
    description: "",
    price: "",
    name: "",
    phone: "",
    city: "",
  });

  // Data for selects
  const VEHICLE_TYPES = ["Легковые", "Коммерческие"];
  const CONDITIONS = ["Новый", "Б/у"];
  const WHEEL_TYPES = ["Обычный", "Спортивный", "Мультируль", "Классический", "Универсальный"];
  const MATERIALS = ["Кожа", "Экокожа", "Пластик", "Алькантара", "Дерево", "Комбинированный"];

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.vehicleType) newErrors.vehicleType = "Обязательное поле";
    if (!formData.condition) newErrors.condition = "Обязательное поле";
    if (!formData.wheelType) newErrors.wheelType = "Обязательное поле";
    if (!formData.price) newErrors.price = "Обязательное поле";
    if (!formData.phone) newErrors.phone = "Обязательное поле";
    if (formData.phone && formData.phone.length !== 9) newErrors.phone = "Номер должен содержать 9 цифр";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if required fields are filled for button activation
  const isFormValid =
    !!formData.vehicleType &&
    !!formData.condition &&
    !!formData.wheelType &&
    !!formData.price &&
    !!formData.phone &&
    formData.phone.length === 9;

  // Check if at least one field has data
  const hasAnyData =
    formData.vehicleType || formData.condition || formData.wheelType ||
    formData.diameter || formData.material || formData.carBrand ||
    formData.carModel || formData.carYear || formData.description ||
    formData.price || formData.photos.length > 0;

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
    onPublish(buildSteeringWheelPayload(formData));
  };

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
      condition: "",
      wheelType: "",
      diameter: "",
      material: "",
      carBrand: "",
      carModel: "",
      carYear: "",
      photos: [] as string[],
      description: "",
      price: "",
      name: profile.name || "",
      phone: profile.phone || "",
      city: profile.city || "",
    });
    setErrors({});
    setAttemptedSubmit(false);
    setShowResetConfirmation(false);
    Toast.show({ type: "success", text1: "Форма очищена" });
  };

  // Show preview step if validated
  if (showPreview) {
    return (
      <SteeringWheelPreviewStep
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
          <span className="flex-1 text-center text-[17px] font-semibold text-foreground">Руль</span>
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
                {/* Vehicle Type */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Тип транспортного средства<span className={requiredCls}> *</span>
                  </span>
                  <BottomSheetSelect
                    value={formData.vehicleType}
                    onChange={(value) => setFormData({ ...formData, vehicleType: value })}
                    options={VEHICLE_TYPES}
                    placeholder="Выберите тип транспортного средства"
                    title="Тип транспортного средства"
                    error={attemptedSubmit ? errors.vehicleType : undefined}
                  />
                </div>

                {/* Condition */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Состояние<span className={requiredCls}> *</span>
                  </span>
                  <BottomSheetSelect
                    value={formData.condition}
                    onChange={(value) => setFormData({ ...formData, condition: value })}
                    options={CONDITIONS}
                    placeholder="Выберите состояние"
                    title="Состояние"
                    error={attemptedSubmit ? errors.condition : undefined}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Steering Wheel Parameters */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("parameters")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Параметры руля</span>
              <SectionChevron expanded={expandedSections.parameters} />
            </button>

            {expandedSections.parameters && (
              <div className={sectionBodyCls}>
                {/* Wheel Type */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Тип руля<span className={requiredCls}> *</span>
                  </span>
                  <BottomSheetSelect
                    value={formData.wheelType}
                    onChange={(value) => setFormData({ ...formData, wheelType: value })}
                    options={WHEEL_TYPES}
                    placeholder="Выберите тип руля"
                    title="Тип руля"
                    error={attemptedSubmit ? errors.wheelType : undefined}
                  />
                </div>

                {/* Diameter */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Диаметр руля (мм)</span>
                  <input
                    type="text"
                    placeholder="Например: 380"
                    value={formData.diameter}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, "");
                      setFormData({ ...formData, diameter: value });
                    }}
                    inputMode="decimal"
                    className={cn(textInputCls, attemptedSubmit && errors.diameter ? textInputErrorCls : undefined)}
                  />
                  {attemptedSubmit && errors.diameter && <span className={errorTextCls}>{errors.diameter}</span>}
                </div>

                {/* Material */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Материал</span>
                  <BottomSheetSelect
                    value={formData.material}
                    onChange={(value) => setFormData({ ...formData, material: value })}
                    options={MATERIALS}
                    placeholder="Выберите материал"
                    title="Материал"
                    error={attemptedSubmit ? errors.material : undefined}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Compatibility */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("compatibility")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Совместимость</span>
              <SectionChevron expanded={expandedSections.compatibility} />
            </button>

            {expandedSections.compatibility && (
              <div className={sectionBodyCls}>
                {formData.wheelType === "Универсальный" && (
                  <p className="text-[13px] font-normal text-muted-foreground">
                    Для универсальных рулей можно не указывать марку и модель
                  </p>
                )}

                {/* Car Brand */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Марка автомобиля</span>
                  <input
                    type="text"
                    placeholder="Например: Toyota"
                    value={formData.carBrand}
                    onChange={(e) => setFormData({ ...formData, carBrand: e.target.value })}
                    className={cn(textInputCls, attemptedSubmit && errors.carBrand ? textInputErrorCls : undefined)}
                  />
                  {attemptedSubmit && errors.carBrand && <span className={errorTextCls}>{errors.carBrand}</span>}
                </div>

                {/* Car Model */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Модель автомобиля</span>
                  <input
                    type="text"
                    placeholder="Например: Camry"
                    value={formData.carModel}
                    onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                    className={cn(textInputCls, attemptedSubmit && errors.carModel ? textInputErrorCls : undefined)}
                  />
                  {attemptedSubmit && errors.carModel && <span className={errorTextCls}>{errors.carModel}</span>}
                </div>

                {/* Car Year */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Год выпуска автомобиля</span>
                  <input
                    type="text"
                    placeholder="Например: 2020"
                    value={formData.carYear}
                    onChange={(e) => setFormData({ ...formData, carYear: e.target.value })}
                    inputMode="numeric"
                    className={cn(textInputCls, attemptedSubmit && errors.carYear ? textInputErrorCls : undefined)}
                  />
                  {attemptedSubmit && errors.carYear && <span className={errorTextCls}>{errors.carYear}</span>}
                </div>
              </div>
            )}
          </div>

          {/* 4. Media */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("media")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Медиа</span>
              <SectionChevron expanded={expandedSections.media} />
            </button>

            {expandedSections.media && (
              <div className={sectionBodyCls}>
                <div className="flex flex-col">
                  <div className="mb-[8px] flex flex-row items-center justify-between">
                    <span className={fieldLabelCls}>Фотографии (макс. 10)</span>
                    {formData.photos.length > 0 && (
                      <span className="text-[12px] font-normal text-muted-foreground">
                        {formData.photos.length} / 10
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

          {/* 5. Description */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("description")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Описание</span>
              <SectionChevron expanded={expandedSections.description} />
            </button>

            {expandedSections.description && (
              <div className={sectionBodyCls}>
                <textarea
                  placeholder="Опишите состояние, дефекты, совместимость..."
                  value={formData.description}
                  onChange={(e) => {
                    const text = e.target.value;
                    if (text.length <= 1000) {
                      setFormData({ ...formData, description: text });
                    }
                  }}
                  className="min-h-[120px] w-full resize-none rounded-[12px] border border-border bg-card px-[16px] py-[12px] text-[15px] font-normal text-foreground outline-none placeholder:text-[#8E8E93]"
                />
                <div className="flex flex-col items-end">
                  <span className="text-[12px] font-normal text-[#8E8E93]">
                    {formData.description.length} / 1000
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 6. Price */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("price")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>
                Цена<span className={requiredCls}> *</span>
              </span>
              <SectionChevron expanded={expandedSections.price} />
            </button>

            {expandedSections.price && (
              <div className={sectionBodyCls}>
                <div className="flex flex-row items-center gap-[8px]">
                  <input
                    type="text"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, price: value });
                    }}
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
            )}
          </div>

          {/* 7. Contacts */}
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
                  <span className="text-[15px] font-medium text-foreground">Изменить контакты</span>
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

      {/* Add City Modal */}
      <AddValueModal
        isOpen={showAddCityModal}
        onClose={() => {
          setShowAddCityModal(false);
          setCustomCityInput("");
        }}
        onAdd={(value) => {
          if (value.trim()) {
            setFormData({ ...formData, city: value.trim() });
            setShowAddCityModal(false);
            setCustomCityInput("");
          }
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
        title="Сбросить форму?"
        message="Все введённые данные будут удалены."
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
