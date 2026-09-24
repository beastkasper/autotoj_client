"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, X, Camera, Loader2 } from "lucide-react";
import { BottomSheetSelect } from "@/components/add-listing/form/BottomSheetSelect";
import { AddValueModal } from "@/components/add-listing/form/AddValueModal";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";
import { EditContactsModal } from "@/components/add-listing/form/EditContactsModal";
import { BodyPartsPreviewStep } from "@/components/add-listing/body-parts/BodyPartsPreviewStep";
import { userStore } from "@/lib/add-listing/userStore";
import { Toast } from "@/lib/add-listing/alert";
import { pickPhotos } from "@/lib/add-listing/photoPicker";
import { buildBodyPartsPayload, type PartPayload } from "@/lib/add-listing/partPayload";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 10;

interface BodyPartsListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartPayload) => void;
}

export function BodyPartsListingForm({ onBack, onClose, onPublish }: BodyPartsListingFormProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: false,
    media: false,
    description: false,
    price: false,
    contacts: false,
  });

  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showEditContactsModal, setShowEditContactsModal] = useState(false);
  const [customCityInput, setCustomCityInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    partCategory: "",
    side: "",
    condition: "",
    color: "",
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
      if (profile) {
        setFormData(prev => ({
          ...prev,
          name: profile.name || "",
          phone: profile.phone || "",
          city: profile.city || "",
        }));
      }
    };
    loadProfile();
  }, []);

  // Data for selects
  const PART_CATEGORIES = [
    "Бампер",
    "Капот",
    "Крыло",
    "Дверь",
    "Крышка багажника",
    "Крыша",
    "Порог",
    "Панель кузова",
    "Лонжерон",
    "Решётка радиатора",
    "Зеркало",
    "Стекло",
    "Фара",
    "Фонарь",
    "Молдинг",
    "Усилитель бампера",
    "Подкрылок",
    "Защита двигателя",
  ];
  const SIDES = ["Левая", "Правая", "Передняя", "Задняя", "Не имеет значения"];
  const CONDITIONS = ["Новая", "Б/у"];
  const COLORS = ["Белый", "Чёрный", "Серый", "Серебристый", "Синий", "Красный", "Зелёный", "Жёлтый", "Другой"];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isFormValid = () => {
    return !!(
      formData.partCategory &&
      formData.condition &&
      formData.price &&
      formData.name &&
      formData.phone &&
      formData.phone.length === 9
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.partCategory) newErrors.partCategory = "Обязательное поле";
    if (!formData.condition) newErrors.condition = "Обязательное поле";
    if (!formData.price) newErrors.price = "Обязательное поле";
    if (!formData.name) newErrors.name = "Обязательное поле";
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
      // Scroll to top on error
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePublishConfirm = () => {
    setIsLoading(true);
    onPublish(buildBodyPartsPayload(formData));
  };

  // Check if at least one field has data
  const hasAnyData =
    formData.partCategory || formData.side || formData.condition ||
    formData.color || formData.description || formData.price ||
    formData.photos.length > 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCloseClick = () => {
    if (hasAnyData) {
      setShowCloseConfirmation(true);
    } else {
      onClose();
    }
  };

  const handleBackClick = () => {
    if (hasAnyData) {
      setShowCloseConfirmation(true);
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

  const handleAddCustomCity = () => {
    if (customCityInput.trim()) {
      setFormData(prev => ({ ...prev, city: customCityInput.trim() }));
      setCustomCityInput("");
      setShowAddCityModal(false);
    }
  };

  const formatPrice = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleReset = async () => {
    const profile = await userStore.getProfile();
    setFormData({
      partCategory: "",
      side: "",
      condition: "",
      color: "",
      photos: [] as string[],
      description: "",
      price: "",
      name: profile?.name || "",
      phone: profile?.phone || "",
      city: profile?.city || "",
    });
    setErrors({});
    setAttemptedSubmit(false);
    setShowResetConfirmation(false);
    Toast.show({ type: "success", text1: "Форма очищена" });
  };

  // Show preview step if validated
  if (showPreview) {
    return (
      <BodyPartsPreviewStep
        formData={formData}
        onBack={() => setShowPreview(false)}
        onClose={onClose}
        onPublish={handlePublishConfirm}
      />
    );
  }

  const sectionChevron = (expanded: boolean) =>
    expanded
      ? <ChevronUp className="shrink-0" color="#8E8E93" size={20} />
      : <ChevronDown className="shrink-0" color="#8E8E93" size={20} />;

  const textInputBase =
    "h-[48px] w-full rounded-[12px] border border-[#C7C7CC] bg-[#FFFFFF] px-4 text-[15px] font-normal text-[#000000] outline-none placeholder:text-[#8E8E93]";

  return (
    <div ref={scrollRef} className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b border-border bg-background"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)", height: "calc(56px + env(safe-area-inset-top, 0px))" }}
      >
        <div className="mx-auto flex h-full w-full max-w-[720px] flex-row items-center px-4">
          <button type="button" onClick={handleBackClick} className="-ml-2 flex size-10 items-center justify-center">
            <ChevronLeft className="text-foreground" size={24} strokeWidth={1.5} />
          </button>
          <span className="flex-1 text-center text-[17px] font-semibold text-foreground">Детали кузова</span>
          <button type="button" onClick={() => setShowResetConfirmation(true)} className="px-2">
            <span className="text-[15px] font-medium text-[#D32F2F]">Сброс</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div
        className="mx-auto w-full max-w-[720px] flex-1 p-4"
        style={{ paddingBottom: "calc(89px + max(16px, env(safe-area-inset-bottom, 0px)))" }}
      >
        {/* 1. Basic Info */}
        <div className="mb-3 overflow-hidden rounded-[16px] bg-secondary">
          <button type="button" onClick={() => toggleSection("basic")} className="flex w-full flex-row items-center justify-between p-4 text-left">
            <span className="flex-1 text-[16px] font-semibold text-foreground">Основная информация</span>
            {sectionChevron(expandedSections.basic)}
          </button>

          {expandedSections.basic && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              {/* Part Category */}
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">
                  Категория детали<span className="text-[#D32F2F]"> *</span>
                </p>
                <BottomSheetSelect
                  title="Категория детали"
                  options={PART_CATEGORIES}
                  value={formData.partCategory}
                  onChange={(value) => setFormData({ ...formData, partCategory: value })}
                  placeholder="Выберите деталь"
                  error={attemptedSubmit ? errors.partCategory : undefined}
                />
              </div>

              {/* Side */}
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">Сторона</p>
                <BottomSheetSelect
                  title="Сторона"
                  options={SIDES}
                  value={formData.side}
                  onChange={(value) => setFormData({ ...formData, side: value })}
                  placeholder="Выберите сторону"
                />
              </div>

              {/* Condition */}
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">
                  Состояние<span className="text-[#D32F2F]"> *</span>
                </p>
                <BottomSheetSelect
                  title="Состояние"
                  options={CONDITIONS}
                  value={formData.condition}
                  onChange={(value) => setFormData({ ...formData, condition: value })}
                  placeholder="Выберите состояние"
                  error={attemptedSubmit ? errors.condition : undefined}
                />
              </div>

              {/* Color */}
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">Цвет</p>
                <BottomSheetSelect
                  title="Цвет"
                  options={COLORS}
                  value={formData.color}
                  onChange={(value) => setFormData({ ...formData, color: value })}
                  placeholder="Выберите цвет"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Media */}
        <div className="mb-3 overflow-hidden rounded-[16px] bg-secondary">
          <button type="button" onClick={() => toggleSection("media")} className="flex w-full flex-row items-center justify-between p-4 text-left">
            <span className="flex-1 text-[16px] font-semibold text-foreground">Медиа</span>
            {sectionChevron(expandedSections.media)}
          </button>

          {expandedSections.media && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              {/* Photos */}
              <div>
                <div className="mb-2 flex flex-row items-center justify-between">
                  <p className="text-[14px] font-medium text-foreground">Фото</p>
                  <span className="text-[13px] font-normal text-muted-foreground">{formData.photos.length}/10</span>
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
                    className="flex h-[128px] w-full flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-border bg-card"
                  >
                    <Camera color="#8E8E93" size={32} strokeWidth={1.5} />
                    <span className="text-[15px] font-normal text-foreground">Добавить фото</span>
                    <span className="text-[12px] font-normal text-muted-foreground">До 10 фото</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. Description */}
        <div className="mb-3 overflow-hidden rounded-[16px] bg-secondary">
          <button type="button" onClick={() => toggleSection("description")} className="flex w-full flex-row items-center justify-between p-4 text-left">
            <span className="flex-1 text-[16px] font-semibold text-foreground">Описание</span>
            {sectionChevron(expandedSections.description)}
          </button>

          {expandedSections.description && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              <textarea
                placeholder="Опишите состояние детали, дефекты, совместимость"
                value={formData.description}
                onChange={(e) => {
                  const text = e.target.value;
                  if (text.length <= 1000) {
                    setFormData({ ...formData, description: text });
                  }
                }}
                rows={6}
                className="min-h-[120px] w-full resize-none rounded-[12px] border border-border bg-card px-4 py-3 text-[15px] font-normal text-foreground outline-none placeholder:text-[#8E8E93]"
              />
              <div className="mt-1 flex flex-col items-end">
                <span className="text-[13px] font-normal text-[#8E8E93]">{1000 - formData.description.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Price */}
        <div className="mb-3 overflow-hidden rounded-[16px] bg-secondary">
          <button type="button" onClick={() => toggleSection("price")} className="flex w-full flex-row items-center justify-between p-4 text-left">
            <span className="flex-1 text-[16px] font-semibold text-foreground">
              Цена<span className="text-[#D32F2F]"> *</span>
            </span>
            {sectionChevron(expandedSections.price)}
          </button>

          {expandedSections.price && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              <div className="flex flex-row items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: formatPrice(e.target.value) })}
                  className={cn(
                    textInputBase,
                    "w-auto min-w-0 flex-1",
                    attemptedSubmit && errors.price ? "border-[#D32F2F]" : undefined,
                  )}
                />
                <span className="text-[15px] font-normal text-muted-foreground">сомони</span>
              </div>
              {attemptedSubmit && errors.price && (
                <p className="mt-1 text-[12px] font-normal text-[#D32F2F]">{errors.price}</p>
              )}
            </div>
          )}
        </div>

        {/* 5. Contacts */}
        <div className="mb-3 overflow-hidden rounded-[16px] bg-secondary">
          <button type="button" onClick={() => toggleSection("contacts")} className="flex w-full flex-row items-center justify-between p-4 text-left">
            <span className="flex-1 text-[16px] font-semibold text-foreground">Контакты</span>
            {sectionChevron(expandedSections.contacts)}
          </button>

          {expandedSections.contacts && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              {/* Contact Info Display */}
              <div className="flex flex-col gap-3 rounded-[12px] border border-border bg-card p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-normal text-muted-foreground">Имя</span>
                  <span className="text-[15px] font-medium text-foreground">{formData.name || "Не указано"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-normal text-muted-foreground">Телефон</span>
                  <span className="text-[15px] font-medium text-foreground">
                    {formData.phone ? `+992 ${formData.phone}` : "Не указано"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
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
              {attemptedSubmit && (errors.name || errors.phone) && (
                <div className="rounded-[12px] border border-[#FF3B30] bg-[#FFF3F3] p-3">
                  {errors.name && (
                    <p className="mb-1 text-[13px] font-normal text-[#FF3B30]">{"•"} {errors.name}</p>
                  )}
                  {errors.phone && (
                    <p className="mb-1 text-[13px] font-normal text-[#FF3B30]">{"•"} {errors.phone}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom padding for floating button */}
        <div className="h-[96px]" />
      </div>

      {/* Floating Submit Button */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background">
        <div
          className="mx-auto w-full max-w-[720px] px-4 pt-4"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom, 0px))" }}
        >
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid() || isLoading}
            className={cn(
              "flex h-[56px] w-full items-center justify-center rounded-[16px]",
              isFormValid() && !isLoading ? "bg-[#111111]" : "bg-[#E5E5EA]",
            )}
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" color="#FFFFFF" />
            ) : (
              <span
                className={cn(
                  "text-[17px] font-semibold",
                  isFormValid() ? "text-[#FFFFFF]" : "text-[#9E9E9E]",
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
        onAdd={handleAddCustomCity}
        title="Добавить город"
        placeholder="Введите название города"
        buttonText="Добавить"
      />

      {/* Close / Back Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCloseConfirmation}
        onClose={() => setShowCloseConfirmation(false)}
        onConfirm={onClose}
        title="Закрыть форму"
        message="Вы уверены, что хотите закрыть форму? Все несохраненные данные будут утеряны."
        confirmText="Закрыть"
        cancelText="Отмена"
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
