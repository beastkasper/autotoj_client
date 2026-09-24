"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, X, Camera } from "lucide-react";
import { BottomSheetSelect } from "@/components/add-listing/form/BottomSheetSelect";
import { AddValueModal } from "@/components/add-listing/form/AddValueModal";
import { ConfirmationModal } from "@/components/add-listing/form/ConfirmationModal";
import { EditContactsModal } from "@/components/add-listing/form/EditContactsModal";
import { WheelsPreviewStep } from "@/components/add-listing/wheels/WheelsPreviewStep";
import { userStore } from "@/lib/add-listing/userStore";
import { Toast } from "@/lib/add-listing/alert";
import { pickPhotos } from "@/lib/add-listing/photoPicker";
import { buildWheelsPayload, type PartPayload } from "@/lib/add-listing/partPayload";
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

interface WheelsListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartPayload) => void;
}

function SectionChevron({ expanded }: { expanded: boolean }) {
  return expanded ? (
    <ChevronUp size={20} color="#8E8E93" className="shrink-0" />
  ) : (
    <ChevronDown size={20} color="#8E8E93" className="shrink-0" />
  );
}

export function WheelsListingForm({ onBack, onClose, onPublish }: WheelsListingFormProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: false,
    parameters: false,
    type: false,
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
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showEditContactsModal, setShowEditContactsModal] = useState(false);
  const [customBrandInput, setCustomBrandInput] = useState("");
  const [customCityInput, setCustomCityInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleType: "",
    condition: "",
    diameter: "",
    width: "",
    pcd: "",
    offset: "",
    dia: "",
    wheelType: "",
    material: "",
    brand: "",
    model: "",
    quantity: "",
    photos: [] as string[],
    description: "",
    price: "",
    name: "",
    phone: "",
    city: "",
  });

  // Select data
  const CONDITIONS = ["Новые", "Б/у"];
  const WHEEL_TYPES = ["Литые", "Кованые", "Штампованные"];
  const MATERIALS = ["Алюминиевые", "Стальные"];

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

  // Check if at least one field has data
  const hasAnyData =
    formData.condition || formData.diameter || formData.width ||
    formData.pcd || formData.offset || formData.dia ||
    formData.wheelType || formData.material || formData.brand ||
    formData.model || formData.quantity || formData.description ||
    formData.price || formData.photos.length > 0;

  const isFormValid =
    formData.condition &&
    formData.diameter &&
    formData.width &&
    formData.pcd &&
    formData.price &&
    formData.phone &&
    formData.phone.length === 9;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.condition) newErrors.condition = "Обязательное поле";
    if (!formData.diameter) newErrors.diameter = "Обязательное поле";
    if (!formData.width) newErrors.width = "Обязательное поле";
    if (!formData.pcd) newErrors.pcd = "Обязательное поле";
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
    onPublish(buildWheelsPayload(formData));
  };

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
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...uris].slice(0, MAX_PHOTOS),
    }));
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleAddCustomBrand = () => {
    if (customBrandInput.trim()) {
      setFormData((prev) => ({ ...prev, brand: customBrandInput.trim() }));
      setCustomBrandInput("");
      setShowAddBrandModal(false);
    }
  };

  const handleAddCustomCity = () => {
    if (customCityInput.trim()) {
      setFormData((prev) => ({ ...prev, city: customCityInput.trim() }));
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
      vehicleType: "",
      condition: "",
      diameter: "",
      width: "",
      pcd: "",
      offset: "",
      dia: "",
      wheelType: "",
      material: "",
      brand: "",
      model: "",
      quantity: "",
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

  // Show preview step if validated
  if (showPreview) {
    return (
      <WheelsPreviewStep
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
          <span className="flex-1 text-center text-[17px] font-semibold text-foreground">Диски</span>
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
          {/* 1. Основная информация */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("basic")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Основная информация</span>
              <SectionChevron expanded={expandedSections.basic} />
            </button>

            {expandedSections.basic && (
              <div className={sectionBodyCls}>
                {/* Состояние */}
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

          {/* 2. Параметры диска */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("parameters")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Параметры диска</span>
              <SectionChevron expanded={expandedSections.parameters} />
            </button>

            {expandedSections.parameters && (
              <div className={sectionBodyCls}>
                {/* Диаметр (R) */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Диаметр (R)<span className={requiredCls}> *</span>
                  </span>
                  <input
                    type="text"
                    className={cn(textInputCls, attemptedSubmit && errors.diameter ? textInputErrorCls : null)}
                    value={formData.diameter}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, diameter: value });
                    }}
                    placeholder="Например: 17"
                    inputMode="numeric"
                  />
                  {attemptedSubmit && errors.diameter ? (
                    <span className={errorTextCls}>{errors.diameter}</span>
                  ) : null}
                </div>

                {/* Ширина диска (J) */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Ширина диска (J)<span className={requiredCls}> *</span>
                  </span>
                  <input
                    type="text"
                    className={cn(textInputCls, attemptedSubmit && errors.width ? textInputErrorCls : null)}
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    placeholder="Например: 7.5"
                    inputMode="decimal"
                  />
                  {attemptedSubmit && errors.width ? (
                    <span className={errorTextCls}>{errors.width}</span>
                  ) : null}
                </div>

                {/* Разболтовка (PCD) */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>
                    Разболтовка (PCD)<span className={requiredCls}> *</span>
                  </span>
                  <input
                    type="text"
                    className={cn(textInputCls, attemptedSubmit && errors.pcd ? textInputErrorCls : null)}
                    value={formData.pcd}
                    onChange={(e) => setFormData({ ...formData, pcd: e.target.value })}
                    placeholder="Например: 5x114.3"
                  />
                  {attemptedSubmit && errors.pcd ? (
                    <span className={errorTextCls}>{errors.pcd}</span>
                  ) : null}
                </div>

                {/* Вылет (ET) */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Вылет (ET) -- мм</span>
                  <input
                    type="text"
                    className={textInputThemedCls}
                    value={formData.offset}
                    onChange={(e) => setFormData({ ...formData, offset: e.target.value })}
                    placeholder="Например: 45"
                    inputMode="numeric"
                  />
                </div>

                {/* Центральное отверстие (DIA) */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Центральное отверстие (DIA) -- мм</span>
                  <input
                    type="text"
                    className={textInputThemedCls}
                    value={formData.dia}
                    onChange={(e) => setFormData({ ...formData, dia: e.target.value })}
                    placeholder="Например: 67.1"
                    inputMode="decimal"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Тип и материал */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("type")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Тип и материал</span>
              <SectionChevron expanded={expandedSections.type} />
            </button>

            {expandedSections.type && (
              <div className={sectionBodyCls}>
                {/* Тип диска */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Тип диска</span>
                  <BottomSheetSelect
                    title="Тип диска"
                    options={WHEEL_TYPES}
                    value={formData.wheelType}
                    onChange={(value) => setFormData({ ...formData, wheelType: value })}
                    placeholder="Выберите тип"
                  />
                </div>

                {/* Материал */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Материал</span>
                  <BottomSheetSelect
                    title="Материал"
                    options={MATERIALS}
                    value={formData.material}
                    onChange={(value) => setFormData({ ...formData, material: value })}
                    placeholder="Выберите материал"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. Производитель */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("manufacturer")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Производитель</span>
              <SectionChevron expanded={expandedSections.manufacturer} />
            </button>

            {expandedSections.manufacturer && (
              <div className={sectionBodyCls}>
                {/* Бренд */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Бренд</span>
                  <input
                    type="text"
                    className={textInputThemedCls}
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Например: BBS"
                  />
                </div>

                {/* Модель */}
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Модель</span>
                  <input
                    type="text"
                    className={textInputThemedCls}
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Например: CH-R"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. Количество */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("quantity")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Количество</span>
              <SectionChevron expanded={expandedSections.quantity} />
            </button>

            {expandedSections.quantity && (
              <div className={sectionBodyCls}>
                <div className={fieldGroupCls}>
                  <span className={fieldLabelCls}>Количество дисков</span>
                  <input
                    type="text"
                    className={textInputThemedCls}
                    value={formData.quantity}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, quantity: value });
                    }}
                    placeholder="Например: 4"
                    inputMode="numeric"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 6. Медиа */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("media")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Медиа</span>
              <SectionChevron expanded={expandedSections.media} />
            </button>

            {expandedSections.media && (
              <div className={sectionBodyCls}>
                <div className="mb-[8px] flex flex-row items-center justify-between">
                  <span className={fieldLabelCls}>Фото</span>
                  <span className="text-[12px] font-normal text-muted-foreground">
                    {formData.photos.length}/10
                  </span>
                </div>

                <div className="flex flex-row flex-wrap gap-[8px]">
                  {formData.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square w-[31%] overflow-hidden rounded-[12px] bg-secondary"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt="" className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute right-[4px] top-[4px] flex size-[24px] items-center justify-center rounded-[12px] bg-[rgba(0,0,0,0.6)]"
                      >
                        <X size={14} strokeWidth={2} color="#FFFFFF" />
                      </button>
                    </div>
                  ))}

                  {formData.photos.length < 10 && (
                    <button
                      type="button"
                      onClick={handlePhotoUpload}
                      className="flex aspect-square w-[31%] flex-col items-center justify-center gap-[4px] rounded-[12px] border-2 border-dashed border-[#C7C7CC] bg-[#FFFFFF]"
                    >
                      <Camera size={24} color="#8E8E93" />
                      <span className="text-[11px] font-normal text-[#8E8E93]">Добавить</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 7. Описание */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("description")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Описание</span>
              <SectionChevron expanded={expandedSections.description} />
            </button>

            {expandedSections.description && (
              <div className={sectionBodyCls}>
                <textarea
                  className="min-h-[120px] w-full resize-none rounded-[12px] border border-border bg-card px-[16px] py-[12px] text-[15px] font-normal text-foreground outline-none placeholder:text-[#8E8E93]"
                  value={formData.description}
                  onChange={(e) => {
                    const text = e.target.value;
                    if (text.length <= 1000) {
                      setFormData({ ...formData, description: text });
                    }
                  }}
                  placeholder="Опишите состояние дисков, любые дефекты, комплектацию..."
                />
                <div className="mt-[4px] flex flex-col items-end">
                  <span className="text-[13px] font-normal text-[#8E8E93]">{1000 - formData.description.length}</span>
                </div>
              </div>
            )}
          </div>

          {/* 8. Цена */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("price")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Цена</span>
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
                      className={cn(
                        textInputCls,
                        "w-auto min-w-0 flex-1",
                        attemptedSubmit && errors.price ? textInputErrorCls : null,
                      )}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: formatPrice(e.target.value) })}
                      placeholder="0"
                      inputMode="numeric"
                    />
                    <span className="text-[15px] font-normal text-muted-foreground">сомони</span>
                  </div>
                  {attemptedSubmit && errors.price ? (
                    <span className={errorTextCls}>{errors.price}</span>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* 9. Контакты */}
          <div className={sectionCardCls}>
            <button type="button" onClick={() => toggleSection("contacts")} className={sectionHeaderCls}>
              <span className={sectionTitleCls}>Контакты</span>
              <SectionChevron expanded={expandedSections.contacts} />
            </button>

            {expandedSections.contacts && (
              <div className={sectionBodyCls}>
                {/* Header with Edit Button */}
                <div className="mb-[8px] flex flex-row items-center justify-between">
                  <span className="text-[14px] font-medium text-[#111111]">Контактные данные</span>
                  <button type="button" onClick={() => setShowEditContactsModal(true)}>
                    <span className="text-[14px] font-medium text-[#007AFF]">Изменить данные</span>
                  </button>
                </div>

                {/* Contact card */}
                <div className="flex flex-col gap-[12px] rounded-[12px] border border-border bg-card p-[16px]">
                  {/* Имя */}
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[13px] font-normal text-muted-foreground">Имя</span>
                    <div className="flex h-[52px] flex-col justify-center rounded-[16px] bg-[#F8F8F8] px-[16px]">
                      <span className="text-[16px] font-normal text-foreground">
                        {formData.name || "Не указано"}
                      </span>
                    </div>
                  </div>

                  {/* Телефон */}
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[13px] font-normal text-muted-foreground">Телефон</span>
                    <div className="flex h-[52px] flex-col justify-center rounded-[16px] bg-[#F8F8F8] px-[16px]">
                      <span className="text-[16px] font-normal text-foreground">
                        {formData.phone ? `+992 ${formData.phone}` : "Не указано"}
                      </span>
                    </div>
                  </div>

                  {/* Город */}
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[13px] font-normal text-muted-foreground">Город</span>
                    <div className="flex h-[52px] flex-col justify-center rounded-[16px] bg-[#F8F8F8] px-[16px]">
                      <span className="text-[16px] font-normal text-foreground">
                        {formData.city || "Не указано"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background">
        <div
          className="mx-auto w-full max-w-[720px] p-[16px]"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom, 0px))" }}
        >
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={cn(
              "flex h-[56px] w-full items-center justify-center rounded-[16px]",
              isFormValid ? "bg-[#111111]" : "bg-[#E5E5EA]",
            )}
          >
            <span
              className={cn(
                "text-[17px] font-semibold",
                isFormValid ? "text-[#FFFFFF]" : "text-[#9E9E9E]",
              )}
            >
              Опубликовать объявление
            </span>
          </button>
        </div>
      </div>

      {/* Add Brand Modal */}
      <AddValueModal
        isOpen={showAddBrandModal}
        onClose={() => {
          setShowAddBrandModal(false);
          setCustomBrandInput("");
        }}
        title="Добавить бренд"
        placeholder="Введите название бренда"
        onAdd={(value) => {
          setFormData((prev) => ({ ...prev, brand: value }));
          setShowAddBrandModal(false);
        }}
      />

      {/* Add City Modal */}
      <AddValueModal
        isOpen={showAddCityModal}
        onClose={() => {
          setShowAddCityModal(false);
          setCustomCityInput("");
        }}
        title="Добавить город"
        placeholder="Введите название города"
        onAdd={(value) => {
          setFormData((prev) => ({ ...prev, city: value }));
          setShowAddCityModal(false);
        }}
      />

      {/* Close / Back Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCloseConfirmation}
        onClose={() => setShowCloseConfirmation(false)}
        onConfirm={() => {
          setShowCloseConfirmation(false);
          onClose();
        }}
        title="Закрыть форму?"
        message="Вы уверены, что хотите закрыть форму? Все несохраненные данные будут утеряны."
        cancelText="Остаться"
        confirmText="Выйти"
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
          setShowEditContactsModal(false);
          await userStore.updatePhone(phone);
          await userStore.updateCity(city);
          Toast.show({ type: "success", text1: "Контакты обновлены" });
        }}
      />
    </div>
  );
}
