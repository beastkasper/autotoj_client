"use client";

import { useState, useCallback } from "react";
import { PartsFormWrapper } from "@/components/add-listing/PartsFormWrapper";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";
import type { PartsFormData, PartsValidationErrors } from "@/lib/types/parts-listing";
import { INITIAL_PARTS_FORM } from "@/lib/types/parts-listing";
import {
  OPTICS_CONDITIONS, OPTICS_TYPES, OPTICS_SIDES, LAMP_TYPES,
  OPTICS_ORIGIN, CAR_BRANDS_SHORT, CAR_MODELS,
} from "@/lib/data/parts-constants";
import { cn } from "@/lib/utils";

interface OpticsListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartsFormData) => void;
}

export function OpticsListingForm({ onBack, onClose, onPublish }: OpticsListingFormProps) {
  const [formData, setFormData] = useState<PartsFormData>({ ...INITIAL_PARTS_FORM });
  const [errors, setErrors] = useState<PartsValidationErrors>({});

  const updateField = useCallback((key: string, value: string) => {
    setFormData((prev) => ({ ...prev, fields: { ...prev.fields, [key]: value } }));
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }, []);
  const updateToggle = useCallback((key: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, toggles: { ...prev.toggles, [key]: value } }));
  }, []);
  const updateForm = useCallback((updates: Partial<PartsFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    Object.keys(updates).forEach((k) => setErrors((prev) => { const n = { ...prev }; delete n[k]; return n; }));
  }, []);
  const handleReset = useCallback(() => { setFormData({ ...INITIAL_PARTS_FORM }); setErrors({}); }, []);

  const handlePublish = useCallback(() => {
    const e: PartsValidationErrors = {};
    if (!formData.fields.condition) e.condition = "Выберите состояние";
    if (!formData.fields.opticsType) e.opticsType = "Выберите тип оптики";
    if (!formData.fields.side) e.side = "Выберите сторону";
    if (!formData.fields.lampType) e.lampType = "Выберите тип лампы";
    if (!formData.fields.originalOrAnalog) e.originalOrAnalog = "Выберите оригинал или аналог";
    if (!formData.fields.carBrand) e.carBrand = "Укажите марку автомобиля";
    if (!formData.fields.carModel) e.carModel = "Укажите модель автомобиля";
    if (formData.photos.length === 0) e.photos = "Добавьте хотя бы одно фото";
    if (!formData.price.trim()) e.price = "Укажите цену";
    if (!formData.name.trim()) e.name = "Укажите ваше имя";
    if (!formData.phone || formData.phone.length !== 9) e.phone = "Укажите номер телефона";
    if (!formData.city) e.city = "Выберите город";
    setErrors(e);
    if (Object.keys(e).length === 0) onPublish(formData);
  }, [formData, onPublish]);

  const inputCn = (field: string) => cn(
    "w-full h-12 px-4 rounded-[12px] text-[15px] border bg-white outline-none",
    errors[field] ? "border-[#D32F2F] bg-[#FFEBEE]" : "border-[#E5E5EA] focus:border-[#000000]"
  );
  const font = { fontFamily: "Manrope, system-ui, sans-serif" } as const;

  const carModels = formData.fields.carBrand ? (CAR_MODELS[formData.fields.carBrand] || []) : [];

  return (
    <PartsFormWrapper
      title="Оптика"
      formData={formData} errors={errors}
      onUpdateField={updateField} onUpdateToggle={updateToggle} onUpdateForm={updateForm}
      onBack={onBack} onClose={onClose} onReset={handleReset} onPublish={handlePublish}
    >
      <div className="space-y-4">
        <BottomSheetSelect label="Состояние *" value={formData.fields.condition || ""} options={[...OPTICS_CONDITIONS]} onSelect={(v) => updateField("condition", v)} error={errors.condition} />
        <BottomSheetSelect label="Тип оптики *" value={formData.fields.opticsType || ""} options={[...OPTICS_TYPES]} onSelect={(v) => updateField("opticsType", v)} error={errors.opticsType} />
        <BottomSheetSelect label="Сторона *" value={formData.fields.side || ""} options={[...OPTICS_SIDES]} onSelect={(v) => updateField("side", v)} error={errors.side} />
        <BottomSheetSelect label="Тип лампы *" value={formData.fields.lampType || ""} options={[...LAMP_TYPES]} onSelect={(v) => updateField("lampType", v)} error={errors.lampType} />
        <BottomSheetSelect label="Оригинал / Аналог *" value={formData.fields.originalOrAnalog || ""} options={[...OPTICS_ORIGIN]} onSelect={(v) => updateField("originalOrAnalog", v)} error={errors.originalOrAnalog} />
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Количество</label>
          <input type="text" inputMode="numeric" value={formData.fields.quantity || ""} onChange={(e) => updateField("quantity", e.target.value.replace(/\D/g, ""))} placeholder="1" className={inputCn("quantity")} style={font} />
        </div>
        <BottomSheetSelect label="Марка авто *" value={formData.fields.carBrand || ""} options={[...CAR_BRANDS_SHORT]} onSelect={(v) => { updateField("carBrand", v); updateField("carModel", ""); }} searchable searchPlaceholder="Поиск марки..." error={errors.carBrand} />
        <BottomSheetSelect label="Модель авто *" value={formData.fields.carModel || ""} options={carModels} onSelect={(v) => updateField("carModel", v)} searchable searchPlaceholder="Поиск модели..." error={errors.carModel} />
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Год авто</label>
          <input type="text" inputMode="numeric" value={formData.fields.carYear || ""} onChange={(e) => updateField("carYear", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="2020" className={inputCn("carYear")} style={font} />
        </div>
      </div>
    </PartsFormWrapper>
  );
}
