"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, X, Camera, Loader2 } from "lucide-react";
import { BottomSheetSelect } from "@/components/add-listing/form/BottomSheetSelect";
import { AddValueModal } from "@/components/add-listing/form/AddValueModal";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";
import { ExitConfirmationModal } from "@/components/add-listing/modals/ExitConfirmationModal";
import { BackConfirmationModal } from "@/components/add-listing/modals/BackConfirmationModal";
import { EditContactsModal } from "@/components/add-listing/form/EditContactsModal";
import { SuspensionPreviewStep } from "@/components/add-listing/suspension/SuspensionPreviewStep";
import { userStore } from "@/lib/add-listing/userStore";
import { Toast } from "@/lib/add-listing/alert";
import { pickPhotos } from "@/lib/add-listing/photoPicker";
import { buildSuspensionPayload, type PartPayload } from "@/lib/add-listing/partPayload";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 10;

interface SuspensionListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartPayload) => void;
}

export function SuspensionListingForm({ onBack, onClose, onPublish }: SuspensionListingFormProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: false,
    type: false,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [customCityInput, setCustomCityInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    condition: "",
    partType: "",
    axle: "",
    side: "",
    quantity: "",
    carBrand: "",
    carModel: "",
    carYear: "",
    bodyType: "",
    photos: [] as string[],
    description: "",
    price: "",
    name: "",
    phone: "",
    city: "",
  });

  // Data for selects
  const CONDITIONS = ["Новое", "Б/у"];
  const PART_TYPES = [
    "Амортизатор",
    "Пружина",
    "Рычаг подвески",
    "Шаровая опора",
    "Стойка стабилизатора",
    "Сайлентблок",
    "Ступица",
    "Подшипник ступицы",
    "Рулевой наконечник",
    "Тяга",
    "Опора стойки",
    "Балка",
    "Подрамник",
    "Другое",
  ];
  const AXLES = ["Передняя", "Задняя"];
  const SIDES = ["Левая", "Правая", "Комплект"];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const CITIES = [
    "Душанбе", "Худжанд", "Куляб", "Курган-Тюбе", "Истаравшан",
    "Вахдат", "Турсунзаде", "Хорог", "Пенджикент", "Канибадам",
  ];

  // Load user profile data on mount (async in mobile)
  useEffect(() => {
    const loadProfile = async () => {
      const profile = await userStore.getProfile();
      setFormData(prev => ({
        ...prev,
        name: profile.name || "",
        phone: profile.phone || "",
        city: profile.city || "",
      }));
    };
    loadProfile();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic info
    if (!formData.condition) newErrors.condition = "Выберите состояние";

    // Part type
    if (!formData.partType) newErrors.partType = "Выберите тип детали";

    // Parameters
    if (!formData.axle) newErrors.axle = "Выберите ось установки";
    if (!formData.side) newErrors.side = "Выберите сторону";

    // Compatibility
    if (!formData.carBrand) newErrors.carBrand = "Укажите марку автомобиля";
    if (!formData.carModel) newErrors.carModel = "Укажите модель автомобиля";

    // Media
    if (formData.photos.length === 0) newErrors.photos = "Добавьте хотя бы одно фото";

    // Price
    if (!formData.price) newErrors.price = "Укажите цену";

    // Contacts
    if (!formData.name) newErrors.name = "Укажите ваше имя";
    if (!formData.phone) newErrors.phone = "Укажите номер телефона";
    if (!formData.city) newErrors.city = "Выберите город";

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
    onPublish(buildSuspensionPayload(formData));
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
      condition: "",
      partType: "",
      axle: "",
      side: "",
      quantity: "",
      carBrand: "",
      carModel: "",
      carYear: "",
      bodyType: "",
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

  // Check if at least one field has data
  const hasAnyData =
    formData.condition || formData.partType || formData.axle ||
    formData.side || formData.quantity || formData.carBrand ||
    formData.carModel || formData.carYear || formData.bodyType ||
    formData.description || formData.price || formData.photos.length > 0;

  const isFormValid =
    formData.condition && formData.partType && formData.axle &&
    formData.side && formData.carBrand && formData.carModel &&
    formData.photos.length > 0 && formData.price &&
    formData.name && formData.phone && formData.city;

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

  // Show preview step if validated
  if (showPreview) {
    return (
      <SuspensionPreviewStep
        formData={formData}
        onBack={() => setShowPreview(false)}
        onClose={onClose}
        onPublish={handlePublishConfirm}
      />
    );
  }

  const sectionChevron = (expanded: boolean) =>
    expanded
      ? <ChevronUp className="shrink-0 text-foreground" size={20} />
      : <ChevronDown className="shrink-0 text-foreground" size={20} />;

  const textInputBase =
    "h-[48px] w-full rounded-[12px] border border-[#C7C7CC] bg-[#FFFFFF] px-4 text-[15px] font-normal text-[#000000] outline-none placeholder:text-[#8E8E93]";
  const textInputThemed = "border-border bg-card text-foreground";

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
          <span className="flex-1 text-center text-[17px] font-semibold text-foreground">Ходовая часть</span>
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
        {/* 1. Основная информация */}
        <div className="mb-3 overflow-hidden rounded-[16px] bg-secondary">
          <button type="button" onClick={() => toggleSection("basic")} className="flex w-full flex-row items-center justify-between p-4 text-left">
            <span className="flex-1 text-[16px] font-semibold text-foreground">Основная информация</span>
            {sectionChevron(expandedSections.basic)}
          </button>

          {expandedSections.basic && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">
                  Состояние<span className="text-[#E53935]"> *</span>
                </p>
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

        {/* 2. Тип детали */}
        <div className="mb-3 overflow-hidden rounded-[16px] bg-secondary">
          <button type="button" onClick={() => toggleSection("type")} className="flex w-full flex-row items-center justify-between p-4 text-left">
            <span className="flex-1 text-[16px] font-semibold text-foreground">
              Тип детали<span className="text-[#E53935]"> *</span>
            </span>
            {sectionChevron(expandedSections.type)}
          </button>

          {expandedSections.type && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              <BottomSheetSelect
                value={formData.partType}
                onChange={(value) => setFormData({ ...formData, partType: value })}
                options={PART_TYPES}
                placeholder="Выберите тип детали"
                error={attemptedSubmit ? errors.partType : undefined}
              />
            </div>
          )}
        </div>

        {/* 3. Параметры детали */}
        <div className="mb-3 overflow-hidden rounded-[16px] bg-secondary">
          <button type="button" onClick={() => toggleSection("parameters")} className="flex w-full flex-row items-center justify-between p-4 text-left">
            <span className="flex-1 text-[16px] font-semibold text-foreground">Параметры детали</span>
            {sectionChevron(expandedSections.parameters)}
          </button>

          {expandedSections.parameters && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              {/* Ось установки */}
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">
                  Ось установки<span className="text-[#E53935]"> *</span>
                </p>
                <BottomSheetSelect
                  value={formData.axle}
                  onChange={(value) => setFormData({ ...formData, axle: value })}
                  options={AXLES}
                  placeholder="Выберите ось"
                  error={attemptedSubmit ? errors.axle : undefined}
                />
              </div>

              {/* Сторона */}
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">
                  Сторона<span className="text-[#E53935]"> *</span>
                </p>
                <BottomSheetSelect
                  value={formData.side}
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      side: value,
                      quantity: value === "Комплект" ? "Комплект" : "1 штука",
                    });
                  }}
                  options={SIDES}
                  placeholder="Выберите сторону"
                  error={attemptedSubmit ? errors.side : undefined}
                />
                <p className="text-[12px] font-normal text-muted-foreground">
                  Комплект = левая + правая
                </p>
              </div>

              {/* Количество */}
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">Количество</p>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Например: 1"
                  value={formData.quantity}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, quantity: value });
                  }}
                  className={cn(textInputBase, textInputThemed)}
                />
                <p className="text-[12px] font-normal text-muted-foreground">
                  Используется, если продаётся несколько одинаковых деталей
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4. Совместимость */}
        <div className="mb-3 overflow-hidden rounded-[16px] bg-secondary">
          <button type="button" onClick={() => toggleSection("compatibility")} className="flex w-full flex-row items-center justify-between p-4 text-left">
            <span className="flex-1 text-[16px] font-semibold text-foreground">Совместимость</span>
            {sectionChevron(expandedSections.compatibility)}
          </button>

          {expandedSections.compatibility && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              {/* Марка автомобиля */}
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">
                  Марка автомобиля<span className="text-[#E53935]"> *</span>
                </p>
                <input
                  type="text"
                  placeholder="Например: Toyota"
                  value={formData.carBrand}
                  onChange={(e) => setFormData({ ...formData, carBrand: e.target.value })}
                  className={cn(textInputBase, attemptedSubmit && errors.carBrand ? "border-[#E53935]" : undefined)}
                />
                {attemptedSubmit && errors.carBrand && (
                  <p className="mt-1 text-[12px] font-normal text-[#E53935]">{errors.carBrand}</p>
                )}
              </div>

              {/* Модель автомобиля */}
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">
                  Модель автомобиля<span className="text-[#E53935]"> *</span>
                </p>
                <input
                  type="text"
                  placeholder="Например: Camry"
                  value={formData.carModel}
                  onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                  className={cn(textInputBase, attemptedSubmit && errors.carModel ? "border-[#E53935]" : undefined)}
                />
                {attemptedSubmit && errors.carModel && (
                  <p className="mt-1 text-[12px] font-normal text-[#E53935]">{errors.carModel}</p>
                )}
              </div>

              {/* Год выпуска автомобиля */}
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">Год выпуска автомобиля</p>
                <input
                  type="text"
                  placeholder="Например: 2020 или 2018-2022"
                  value={formData.carYear}
                  onChange={(e) => setFormData({ ...formData, carYear: e.target.value })}
                  className={cn(textInputBase, textInputThemed)}
                />
              </div>

              {/* Тип кузова (необязательно) */}
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">
                  Тип кузова <span className="text-[14px] font-normal text-[#8E8E93]">(необязательно)</span>
                </p>
                <input
                  type="text"
                  placeholder="Например: Седан"
                  value={formData.bodyType}
                  onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                  className={cn(textInputBase, textInputThemed)}
                />
              </div>
            </div>
          )}
        </div>

        {/* 5. Медиа */}
        <div className="mb-3 overflow-hidden rounded-[16px] bg-secondary">
          <button type="button" onClick={() => toggleSection("media")} className="flex w-full flex-row items-center justify-between p-4 text-left">
            <span className="flex-1 text-[16px] font-semibold text-foreground">Медиа</span>
            {sectionChevron(expandedSections.media)}
          </button>

          {expandedSections.media && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              <div>
                <div className="mb-2 flex flex-row items-center justify-between">
                  <p className="text-[14px] font-medium text-foreground">
                    Фотографии (макс. 10)<span className="text-[#E53935]"> *</span>
                  </p>
                  {formData.photos.length > 0 && (
                    <span className="text-[12px] font-normal text-muted-foreground">{formData.photos.length} / 10</span>
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
                    className={cn(
                      "flex h-[128px] w-full flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#C7C7CC] bg-[#FFFFFF]",
                      attemptedSubmit && errors.photos ? "border-[#E53935] bg-[#FFF3F3]" : undefined,
                    )}
                  >
                    <Camera color="#8E8E93" size={32} strokeWidth={1.5} />
                    <span className="text-[15px] font-normal text-foreground">Добавить фото</span>
                    <span className="text-[12px] font-normal text-muted-foreground">До 10 фото</span>
                  </button>
                )}

                {attemptedSubmit && errors.photos && (
                  <p className="mt-1 text-[12px] font-normal text-[#E53935]">{errors.photos}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 6. Описание */}
        <div className="mb-3 overflow-hidden rounded-[16px] bg-secondary">
          <button type="button" onClick={() => toggleSection("description")} className="flex w-full flex-row items-center justify-between p-4 text-left">
            <span className="flex-1 text-[16px] font-semibold text-foreground">Описание</span>
            {sectionChevron(expandedSections.description)}
          </button>

          {expandedSections.description && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              <textarea
                placeholder="Опишите состояние детали, оригинал или аналог, пробег, любые нюансы"
                value={formData.description}
                onChange={(e) => {
                  const text = e.target.value;
                  if (text.length <= 1000) {
                    setFormData({ ...formData, description: text });
                  }
                }}
                rows={5}
                maxLength={1000}
                className="min-h-[120px] w-full resize-none rounded-[12px] border border-border bg-card px-4 py-3 text-[15px] font-normal text-foreground outline-none placeholder:text-[#8E8E93]"
              />
              <div className="mt-1 flex flex-row justify-end">
                <span className="text-[12px] font-normal text-[#8E8E93]">
                  {formData.description.length} / 1000
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 7. Цена */}
        <div className="mb-3 overflow-hidden rounded-[16px] bg-secondary">
          <button type="button" onClick={() => toggleSection("price")} className="flex w-full flex-row items-center justify-between p-4 text-left">
            <span className="flex-1 text-[16px] font-semibold text-foreground">
              Цена<span className="text-[#E53935]"> *</span>
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
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, price: value });
                  }}
                  className={cn(
                    textInputBase,
                    "w-auto min-w-0 flex-1",
                    attemptedSubmit && errors.price ? "border-[#E53935]" : undefined,
                  )}
                />
                <span className="text-[15px] font-normal text-muted-foreground">сомони</span>
              </div>
              {attemptedSubmit && errors.price && (
                <p className="mt-1 text-[12px] font-normal text-[#E53935]">{errors.price}</p>
              )}
            </div>
          )}
        </div>

        {/* 8. Контакты */}
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
                <span className="text-[15px] font-medium text-foreground">Изменить данные</span>
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
