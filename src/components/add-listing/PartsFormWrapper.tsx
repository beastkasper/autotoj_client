"use client";

import { useState, useCallback, useRef } from "react";
import { ArrowLeft, X as XIcon, Camera, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PartsFormData, PartsValidationErrors } from "@/lib/types/parts-listing";
import { CITIES } from "@/lib/data/parts-constants";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";
import { ConfirmDialog } from "@/components/listing/confirm-dialog";

interface PartsFormWrapperProps {
  title: string;
  publishButtonLabel?: string;
  formData: PartsFormData;
  errors: PartsValidationErrors;
  onUpdateField: (key: string, value: string) => void;
  onUpdateToggle: (key: string, value: boolean) => void;
  onUpdateForm: (updates: Partial<PartsFormData>) => void;
  onBack: () => void;
  onClose: () => void;
  onReset: () => void;
  onPublish: () => void;
  isPublishing?: boolean;
  children: React.ReactNode;
}

export function PartsFormWrapper({
  title,
  publishButtonLabel = "Опубликовать объявление",
  formData,
  errors,
  onUpdateForm,
  onBack,
  onClose,
  onReset,
  onPublish,
  isPublishing = false,
  children,
}: PartsFormWrapperProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: false,
    media: false,
    description: false,
    price: false,
    contacts: false,
  });
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  // ── Photo handlers ──
  const handleAddPhotos = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const newFiles = Array.from(files);
      const remaining = 10 - formData.photos.length;
      const toAdd = newFiles.slice(0, remaining);
      onUpdateForm({
        photos: [...formData.photos, ...toAdd],
        photoPreviewUrls: [
          ...formData.photoPreviewUrls,
          ...toAdd.map((f) => URL.createObjectURL(f)),
        ],
      });
      e.target.value = "";
    },
    [formData.photos, formData.photoPreviewUrls, onUpdateForm]
  );

  const handleRemovePhoto = useCallback(
    (index: number) => {
      URL.revokeObjectURL(formData.photoPreviewUrls[index]);
      onUpdateForm({
        photos: formData.photos.filter((_, i) => i !== index),
        photoPreviewUrls: formData.photoPreviewUrls.filter((_, i) => i !== index),
      });
    },
    [formData.photos, formData.photoPreviewUrls, onUpdateForm]
  );

  // ── Price formatting ──
  const formatPrice = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) return "";
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // ── Phone formatting ──
  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
  };

  const handleBack = useCallback(() => {
    const hasData = formData.price || formData.description || formData.photos.length > 0 ||
      Object.keys(formData.fields).some(k => formData.fields[k]);
    if (hasData) {
      setShowConfirmExit(true);
    } else {
      onBack();
    }
  }, [formData, onBack]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* ── Header ── */}
      <div className="bg-white border-b border-[#EDEDED]">
        <div className="flex items-center h-14 px-4">
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 -ml-2 flex items-center justify-center active:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5 text-[#111111]" />
          </button>
          <h1
            className="flex-1 text-center text-[17px] font-semibold text-[#000000]"
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          >
            {title}
          </h1>
          <button
            type="button"
            onClick={onReset}
            className="text-[14px] text-[#D32F2F] active:opacity-60 transition-opacity"
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          >
            Сброс
          </button>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]" ref={formRef}>
        <div className="max-w-md mx-auto px-4 py-4 space-y-3">
          {/* ── Секция 1: Основная информация ── */}
          <SectionCard
            title="Основная информация"
            expanded={expandedSections.basic}
            onToggle={() => toggleSection("basic")}
          >
            {children}
          </SectionCard>

          {/* ── Секция 2: Медиа (Фото) ── */}
          <SectionCard
            title={`Фото ${formData.photos.length}/10`}
            expanded={expandedSections.media}
            onToggle={() => toggleSection("media")}
          >
            <div className="grid grid-cols-3 gap-2">
              {formData.photoPreviewUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-[12px] overflow-hidden bg-[#F5F5F5]">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 w-6 h-6 bg-[#000000]/70 rounded-full flex items-center justify-center"
                  >
                    <XIcon className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ))}
              {formData.photos.length < 10 && (
                <label className="aspect-square rounded-[12px] border-2 border-dashed border-[#E5E5EA] bg-[#F5F5F5] flex flex-col items-center justify-center cursor-pointer hover:bg-[#EAEAEF] active:opacity-70 transition-all gap-1">
                  <Camera className="w-6 h-6 text-[#8E8E93]" />
                  <span
                    className="text-[11px] text-[#8E8E93]"
                    style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                  >
                    Добавить
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleAddPhotos}
                  />
                </label>
              )}
            </div>
            {errors.photos && (
              <p className="mt-1 text-[12px] text-[#D32F2F]" style={{ fontFamily: "Manrope, system-ui, sans-serif" }}>
                {errors.photos}
              </p>
            )}
          </SectionCard>

          {/* ── Секция 3: Описание ── */}
          <SectionCard
            title="Описание"
            expanded={expandedSections.description}
            onToggle={() => toggleSection("description")}
          >
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => {
                  if (e.target.value.length <= 1000)
                    onUpdateForm({ description: e.target.value });
                }}
                placeholder="Опишите состояние детали, дефекты, совместимость"
                rows={6}
                className="w-full px-4 py-3 rounded-[12px] text-[16px] border border-[#E5E5EA] bg-white focus:border-[#000000] outline-none resize-none"
                style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
              />
              <span
                className="absolute bottom-3 right-4 text-[12px] text-[#8E8E93]"
                style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
              >
                {1000 - formData.description.length}
              </span>
            </div>
          </SectionCard>

          {/* ── Секция 4: Цена ── */}
          <SectionCard
            title="Цена"
            expanded={expandedSections.price}
            onToggle={() => toggleSection("price")}
          >
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={formatPrice(formData.price)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  onUpdateForm({ price: raw });
                }}
                placeholder="0"
                className={cn(
                  "w-full h-12 px-4 pr-20 rounded-[12px] text-[15px] border bg-white outline-none",
                  errors.price ? "border-[#D32F2F] bg-[#FFEBEE]" : "border-[#E5E5EA] focus:border-[#000000]"
                )}
                style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#8E8E93]"
                style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
              >
                сомони
              </span>
            </div>
            {errors.price && (
              <p className="mt-1 text-[12px] text-[#D32F2F]" style={{ fontFamily: "Manrope, system-ui, sans-serif" }}>
                {errors.price}
              </p>
            )}
          </SectionCard>

          {/* ── Секция 5: Контакты ── */}
          <SectionCard
            title="Контакты"
            expanded={expandedSections.contacts}
            onToggle={() => toggleSection("contacts")}
          >
            <div className="space-y-3">
              {/* Имя */}
              <div>
                <label
                  className="block text-[14px] font-medium text-[#000000] mb-2"
                  style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                >
                  Имя
                </label>
                <div className="w-full h-[52px] px-4 bg-[#F8F8F8] rounded-[16px] flex items-center">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => onUpdateForm({ name: e.target.value })}
                    placeholder="Ваше имя"
                    className="w-full bg-transparent outline-none text-[15px]"
                    style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-[12px] text-[#D32F2F]" style={{ fontFamily: "Manrope, system-ui, sans-serif" }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Телефон */}
              <div>
                <label
                  className="block text-[14px] font-medium text-[#000000] mb-2"
                  style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                >
                  Телефон
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="+992"
                    disabled
                    className="w-20 h-[52px] px-4 rounded-[12px] text-[15px] bg-[#F5F5F5] text-[#000000] font-medium border border-[#E5E5EA]"
                    style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                  />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={formatPhone(formData.phone)}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                      onUpdateForm({ phone: digits });
                    }}
                    placeholder="900 00 00"
                    className={cn(
                      "flex-1 h-[52px] px-4 bg-white border rounded-[12px] text-[15px] outline-none focus:border-2 focus:border-[#000000]",
                      errors.phone ? "border-[#D32F2F]" : "border-[#C7C7CC]"
                    )}
                    style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-[12px] text-[#D32F2F]" style={{ fontFamily: "Manrope, system-ui, sans-serif" }}>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Город */}
              <BottomSheetSelect
                label="Город"
                value={formData.city}
                options={CITIES as unknown as string[]}
                onSelect={(v) => onUpdateForm({ city: v })}
                error={errors.city}
              />
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ── Footer: Кнопка публикации ── */}
      <div className="border-t border-[#E5E5EA] px-4 py-3 pb-safe">
        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className={cn(
            "w-full h-14 rounded-[16px] text-[17px] font-semibold transition-all",
            isPublishing
              ? "bg-[#E5E5EA] text-[#9E9E9E] cursor-not-allowed"
              : "bg-[#111111] text-white active:opacity-80 cursor-pointer"
          )}
          style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
        >
          {isPublishing ? "Публикация..." : publishButtonLabel}
        </button>
      </div>

      {/* ── Confirm exit dialog ── */}
      <ConfirmDialog
        open={showConfirmExit}
        onOpenChange={setShowConfirmExit}
        title="Выйти без сохранения?"
        description="Все введённые данные будут потеряны"
        confirmLabel="Выйти"
        onConfirm={() => {
          setShowConfirmExit(false);
          onBack();
        }}
      />
    </div>
  );
}

// ── Collapsible Section Card ──

interface SectionCardProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function SectionCard({ title, expanded, onToggle, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-[16px] overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-center justify-between active:bg-[#F5F5F5] transition-colors"
      >
        <span
          className="text-[16px] font-semibold text-[#000000]"
          style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
        >
          {title}
        </span>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-[#8E8E93]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#8E8E93]" />
        )}
      </button>
      {expanded && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}
