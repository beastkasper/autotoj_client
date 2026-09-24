"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, X, Camera, Loader2 } from "lucide-react";
import { BottomSheetSelect } from "@/components/add-listing/form/BottomSheetSelect";
import { AddValueModal } from "@/components/add-listing/form/AddValueModal";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";
import { TransmissionPreviewStep } from "@/components/add-listing/transmission/TransmissionPreviewStep";
import { ExitConfirmationModal } from "@/components/add-listing/modals/ExitConfirmationModal";
import { BackConfirmationModal } from "@/components/add-listing/modals/BackConfirmationModal";
import { EditContactsModal } from "@/components/add-listing/form/EditContactsModal";
import { userStore } from "@/lib/add-listing/userStore";
import { Toast } from "@/lib/add-listing/alert";
import { pickPhotos } from "@/lib/add-listing/photoPicker";
import { buildTransmissionPayload, type PartPayload } from "@/lib/add-listing/partPayload";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 10;

interface TransmissionListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartPayload) => void;
}

export function TransmissionListingForm({ onBack, onClose, onPublish }: TransmissionListingFormProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: false,
    specs: false,
    media: false,
    description: false,
    price: false,
    contacts: false,
  });

  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [showAddModelModal, setShowAddModelModal] = useState(false);
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
    brand: "",
    model: "",
    condition: "",
    transmissionType: "",
    gearCount: "",
    driveType: "",
    photos: [] as string[],
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
      setFormData(prev => ({
        ...prev,
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
      }));
    };
    loadProfile();
  }, []);

  // Экран формы/предпросмотра всегда открывается сверху (как новый ScrollView в мобилке)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showPreview]);

  // Select data
  const BRANDS = ["Toyota", "Honda", "Mercedes-Benz", "BMW", "Volkswagen", "Audi", "Lexus", "Nissan", "Mazda", "Hyundai", "Kia", "Ford", "Chevrolet"];
  const MODELS: Record<string, string[]> = {
    "Toyota": ["Camry", "Corolla", "Land Cruiser", "RAV4", "Highlander", "Prius"],
    "Honda": ["Accord", "Civic", "CR-V", "Pilot", "Fit"],
    "Mercedes-Benz": ["E-Class", "C-Class", "S-Class", "GLE", "GLC"],
    "BMW": ["3 Series", "5 Series", "7 Series", "X5", "X3"],
    "Volkswagen": ["Passat", "Golf", "Tiguan", "Polo", "Jetta"],
    "Audi": ["A4", "A6", "Q5", "Q7", "A3"],
    "Lexus": ["RX", "ES", "LX", "NX", "GX"],
    "Nissan": ["Altima", "Sentra", "Rogue", "Pathfinder", "Murano"],
    "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-9", "MX-5"],
    "Hyundai": ["Sonata", "Elantra", "Tucson", "Santa Fe", "Accent"],
    "Kia": ["Optima", "Forte", "Sportage", "Sorento", "Rio"],
    "Ford": ["Focus", "Fusion", "Escape", "Explorer", "F-150"],
    "Chevrolet": ["Malibu", "Cruze", "Equinox", "Traverse", "Silverado"],
  };

  const CONDITIONS = ["Новый", "Б/у"];
  const TRANSMISSION_TYPES = ["Механическая", "Автомат", "Робот", "Вариатор"];
  const DRIVE_TYPES = ["Передний", "Задний", "Полный"];

  const availableModels = formData.brand ? (MODELS[formData.brand] || []) : [];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.brand) newErrors.brand = "Обязательное поле";
    if (!formData.model) newErrors.model = "Обязательное поле";
    if (!formData.condition) newErrors.condition = "Обязательное поле";
    if (!formData.price) newErrors.price = "Обязательное поле";
    if (!formData.name) newErrors.name = "Обязательное поле";
    if (!formData.phone) newErrors.phone = "Обязательное поле";
    if (formData.phone && formData.phone.length !== 9) newErrors.phone = "Номер должен содержать 9 цифр";
    if (!formData.city) newErrors.city = "Обязательное поле";

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
    onPublish(buildTransmissionPayload(formData));
  };

  const isFormValid =
    formData.brand && formData.model && formData.condition &&
    formData.price && formData.name && formData.phone &&
    formData.phone.length === 9 && formData.city;

  // Check if at least one field has data
  const hasAnyData =
    formData.brand || formData.model || formData.condition ||
    formData.transmissionType || formData.gearCount || formData.driveType ||
    formData.description || formData.price || formData.photos.length > 0;

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
    const remaining = MAX_PHOTOS - formData.photos.length;
    const uris = await pickPhotos({ remaining });
    if (uris.length === 0) return;
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...uris].slice(0, MAX_PHOTOS),
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleReset = async () => {
    const profile = await userStore.getProfile();
    setFormData({
      brand: "",
      model: "",
      condition: "",
      transmissionType: "",
      gearCount: "",
      driveType: "",
      photos: [] as string[],
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

  const formatPrice = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Show preview step if validated
  if (showPreview) {
    return (
      <TransmissionPreviewStep
        formData={formData}
        onBack={() => setShowPreview(false)}
        onClose={onClose}
        onPublish={handlePublishConfirm}
      />
    );
  }

  const sectionCard = "mb-3 overflow-hidden rounded-[16px] bg-secondary";
  const sectionHeader = "flex w-full flex-row items-center justify-between px-4 py-4 text-left";
  const sectionTitle = "flex-1 text-[16px] font-semibold text-foreground";
  const sectionBody = "flex flex-col gap-3 px-4 pb-4";
  const fieldGroup = "flex flex-col gap-2";
  const fieldLabel = "text-[14px] font-medium text-foreground";
  const textInput =
    "h-[48px] w-full rounded-[12px] border border-[#C7C7CC] bg-white px-4 text-[15px] font-normal text-black outline-none placeholder:text-[#8E8E93]";

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 h-[calc(56px+env(safe-area-inset-top,0px))] border-b border-border bg-background pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex h-full w-full max-w-[720px] flex-row items-center px-4">
          <button type="button" onClick={handleBackClick} className="-ml-2 flex size-10 items-center justify-center">
            <ChevronLeft size={24} strokeWidth={1.5} className="text-foreground" />
          </button>
          <span className="flex-1 text-center text-[17px] font-semibold text-foreground">КПП</span>
          <button type="button" onClick={() => setShowResetConfirmation(true)} className="px-2">
            <span className="text-[15px] font-medium text-[#D32F2F]">Сброс</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="mx-auto w-full max-w-[720px] flex-1 p-4">
        {/* 1. Basic Info */}
        <div className={sectionCard}>
          <button type="button" onClick={() => toggleSection("basic")} className={sectionHeader}>
            <span className={sectionTitle}>Основная информация</span>
            {expandedSections.basic
              ? <ChevronUp size={20} className="text-foreground" />
              : <ChevronDown size={20} className="text-foreground" />
            }
          </button>

          {expandedSections.basic && (
            <div className={sectionBody}>
              {/* Brand */}
              <div className={fieldGroup}>
                <span className={fieldLabel}>
                  Марка<span className="text-[#E53935]"> *</span>
                </span>
                <BottomSheetSelect
                  value={formData.brand}
                  onChange={(value) => setFormData({ ...formData, brand: value, model: "" })}
                  options={BRANDS}
                  placeholder="Выберите марку"
                  title="Выберите марку"
                  error={attemptedSubmit ? errors.brand : undefined}
                  allowCustom
                  onAddCustom={() => setShowAddBrandModal(true)}
                  customButtonText="Добавить марку"
                />
              </div>

              {/* Model */}
              <div className={fieldGroup}>
                <span className={fieldLabel}>
                  Модель<span className="text-[#E53935]"> *</span>
                </span>
                <BottomSheetSelect
                  value={formData.model}
                  onChange={(value) => setFormData({ ...formData, model: value })}
                  options={availableModels}
                  placeholder={formData.brand ? "Выберите модель" : "Сначала выберите марку"}
                  title="Выберите модель"
                  error={attemptedSubmit ? errors.model : undefined}
                  allowCustom
                  onAddCustom={() => setShowAddModelModal(true)}
                  customButtonText="Добавить модель"
                />
              </div>

              {/* Condition */}
              <div className={fieldGroup}>
                <span className={fieldLabel}>
                  Состояние<span className="text-[#E53935]"> *</span>
                </span>
                <BottomSheetSelect
                  value={formData.condition}
                  onChange={(value) => setFormData({ ...formData, condition: value })}
                  options={CONDITIONS}
                  placeholder="Выберите состояние"
                  error={attemptedSubmit ? errors.condition : undefined}
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Transmission Specs */}
        <div className={sectionCard}>
          <button type="button" onClick={() => toggleSection("specs")} className={sectionHeader}>
            <span className={sectionTitle}>Параметры КПП</span>
            {expandedSections.specs
              ? <ChevronUp size={20} className="text-foreground" />
              : <ChevronDown size={20} className="text-foreground" />
            }
          </button>

          {expandedSections.specs && (
            <div className={sectionBody}>
              {/* Transmission Type */}
              <div className={fieldGroup}>
                <span className={fieldLabel}>Тип КПП</span>
                <BottomSheetSelect
                  value={formData.transmissionType}
                  onChange={(value) => setFormData({ ...formData, transmissionType: value })}
                  options={TRANSMISSION_TYPES}
                  placeholder="Выберите тип"
                />
              </div>

              {/* Gear Count */}
              <div className={fieldGroup}>
                <span className={fieldLabel}>Количество передач</span>
                <input
                  placeholder="0"
                  value={formData.gearCount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, gearCount: value });
                  }}
                  inputMode="numeric"
                  className={textInput}
                />
              </div>

              {/* Drive Type */}
              <div className={fieldGroup}>
                <span className={fieldLabel}>Привод</span>
                <BottomSheetSelect
                  value={formData.driveType}
                  onChange={(value) => setFormData({ ...formData, driveType: value })}
                  options={DRIVE_TYPES}
                  placeholder="Выберите тип привода"
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. Media */}
        <div className={sectionCard}>
          <button type="button" onClick={() => toggleSection("media")} className={sectionHeader}>
            <span className={sectionTitle}>Медиа</span>
            {expandedSections.media
              ? <ChevronUp size={20} className="text-foreground" />
              : <ChevronDown size={20} className="text-foreground" />
            }
          </button>

          {expandedSections.media && (
            <div className={sectionBody}>
              {/* Photos */}
              <div>
                <div className="mb-2 flex flex-row items-center justify-between">
                  <span className={fieldLabel}>Фото</span>
                  <span className="text-[12px] font-normal text-[#8E8E93]">{formData.photos.length}/10</span>
                </div>

                {/* Photo Grid */}
                {formData.photos.length > 0 && (
                  <div className="mb-3 flex flex-row flex-wrap gap-2">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square w-[31%] overflow-hidden rounded-[12px] bg-[#F2F2F7]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo} alt="" className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-[12px] bg-[rgba(0,0,0,0.6)]"
                        >
                          <X color="#FFFFFF" size={14} strokeWidth={2} />
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
                    className="flex h-[128px] w-full flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#C7C7CC] bg-white"
                  >
                    <Camera color="#8E8E93" size={32} strokeWidth={1.5} />
                    <span className="text-[15px] font-normal text-black">Добавить</span>
                    <span className="text-[12px] font-normal text-[#8E8E93]">До 10 фото</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. Description */}
        <div className={sectionCard}>
          <button type="button" onClick={() => toggleSection("description")} className={sectionHeader}>
            <span className={sectionTitle}>Описание</span>
            {expandedSections.description
              ? <ChevronUp size={20} className="text-foreground" />
              : <ChevronDown size={20} className="text-foreground" />
            }
          </button>

          {expandedSections.description && (
            <div className={sectionBody}>
              <textarea
                placeholder="Укажите состояние КПП, пробег, дефекты, совместимость"
                value={formData.description}
                onChange={(e) => {
                  const text = e.target.value;
                  if (text.length <= 1000) {
                    setFormData({ ...formData, description: text });
                  }
                }}
                className="field-sizing-content min-h-[120px] w-full resize-none rounded-[12px] border border-[#C7C7CC] bg-white px-4 py-3 text-[15px] font-normal text-black outline-none placeholder:text-[#8E8E93]"
              />
              <div className="mt-1 flex flex-col items-end">
                <span className="text-[13px] font-normal text-[#8E8E93]">{1000 - formData.description.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* 5. Price */}
        <div className={sectionCard}>
          <button type="button" onClick={() => toggleSection("price")} className={sectionHeader}>
            <span className={sectionTitle}>
              Цена<span className="text-[#E53935]"> *</span>
            </span>
            {expandedSections.price
              ? <ChevronUp size={20} className="text-foreground" />
              : <ChevronDown size={20} className="text-foreground" />
            }
          </button>

          {expandedSections.price && (
            <div className={sectionBody}>
              <div className="flex flex-row items-center gap-2">
                <input
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: formatPrice(e.target.value) })}
                  inputMode="numeric"
                  className={cn(
                    textInput,
                    "min-w-0 flex-1",
                    attemptedSubmit && errors.price ? "border-[#E53935]" : undefined,
                  )}
                />
                <span className="text-[15px] font-normal text-[#8E8E93]">сомони</span>
              </div>
              {attemptedSubmit && errors.price && (
                <span className="mt-1 text-[12px] font-normal text-[#E53935]">{errors.price}</span>
              )}
            </div>
          )}
        </div>

        {/* 6. Contacts */}
        <div className={sectionCard}>
          <button type="button" onClick={() => toggleSection("contacts")} className={sectionHeader}>
            <span className={sectionTitle}>Контакты</span>
            {expandedSections.contacts
              ? <ChevronUp size={20} className="text-foreground" />
              : <ChevronDown size={20} className="text-foreground" />
            }
          </button>

          {expandedSections.contacts && (
            <div className={sectionBody}>
              {/* Contact Info Display */}
              <div className="flex flex-col gap-3 rounded-[12px] border border-[#E5E5EA] bg-white p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-normal text-[#8E8E93]">Имя</span>
                  <span className="text-[15px] font-medium text-black">{formData.name || "Не указано"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-normal text-[#8E8E93]">Телефон</span>
                  <span className="text-[15px] font-medium text-black">{formData.phone ? `+992 ${formData.phone}` : "Не указано"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-normal text-[#8E8E93]">Город</span>
                  <span className="text-[15px] font-medium text-black">{formData.city || "Не указано"}</span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                type="button"
                onClick={() => setShowEditContactsModal(true)}
                className="flex h-[48px] w-full items-center justify-center rounded-[12px] bg-[#F2F2F7]"
              >
                <span className="text-[15px] font-medium text-black">Изменить контакты</span>
              </button>

              {/* Error messages if validation fails */}
              {attemptedSubmit && (errors.name || errors.phone || errors.city) && (
                <div className="rounded-[12px] border border-[#FF3B30] bg-[#FFF3F3] p-3">
                  {errors.name && (
                    <p className="mb-1 text-[13px] font-normal text-[#FF3B30]">{"•"} {errors.name}</p>
                  )}
                  {errors.phone && (
                    <p className="mb-1 text-[13px] font-normal text-[#FF3B30]">{"•"} {errors.phone}</p>
                  )}
                  {errors.city && (
                    <p className="mb-1 text-[13px] font-normal text-[#FF3B30]">{"•"} {errors.city}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom padding for floating button */}
        <div className="h-[calc(96px+env(safe-area-inset-bottom,0px))]" />
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
              <Loader2 className="size-5 animate-spin" color="#FFFFFF" />
            ) : (
              <span
                className={cn(
                  "text-[17px] font-semibold",
                  isFormValid ? "text-white" : "text-[#9E9E9E]",
                )}
              >
                Проверка объявления
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
        placeholder="Введите название марки"
        buttonText="Добавить"
      />

      {/* Add Model Modal */}
      <AddValueModal
        isOpen={showAddModelModal}
        onClose={() => setShowAddModelModal(false)}
        onAdd={(value) => setFormData({ ...formData, model: value })}
        title="Добавить модель"
        placeholder="Введите название модели"
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
          setFormData(prev => ({ ...prev, phone, city }));
          await userStore.updatePhone(phone);
          await userStore.updateCity(city);
          Toast.show({ type: "success", text1: "Контакты обновлены" });
        }}
      />
    </div>
  );
}
