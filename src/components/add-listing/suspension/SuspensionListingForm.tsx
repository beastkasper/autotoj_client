"use client";

import { useState, useCallback } from "react";
import { PartsFormWrapper } from "@/components/add-listing/PartsFormWrapper";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";
import type { PartsFormData, PartsValidationErrors } from "@/lib/types/parts-listing";
import { INITIAL_PARTS_FORM } from "@/lib/types/parts-listing";
import {
  SUSPENSION_CONDITIONS, SUSPENSION_TYPES, SUSPENSION_AXLES, SUSPENSION_SIDES,
  CAR_BRANDS_SHORT, CAR_MODELS,
} from "@/lib/data/parts-constants";
import { cn } from "@/lib/utils";

interface SuspensionListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartsFormData) => void;
}

export function SuspensionListingForm({ onBack, onClose, onPublish }: SuspensionListingFormProps) {
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

  const handleSideSelect = useCallback((v: string) => {
    updateField("side", v);
    // Auto-set quantity based on side selection
    if (v === "Комплект") {
      updateField("quantity", "Комплект");
    } else {
      updateField("quantity", "1 штука");
    }
  }, [updateField]);

  const handlePublish = useCallback(() => {
    const e: PartsValidationErrors = {};
    if (!formData.fields.condition) e.condition = "Обязательное поле";
    if (!formData.fields.partType) e.partType = "Обязательное поле";
    if (!formData.fields.axle) e.axle = "Обязательное поле";
    if (!formData.fields.side) e.side = "Обязательное поле";
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
      title="Ходовая часть"
      formData={formData} errors={errors}
      onUpdateField={updateField} onUpdateToggle={updateToggle} onUpdateForm={updateForm}
      onBack={onBack} onClose={onClose} onReset={handleReset} onPublish={handlePublish}
    >
      <div className="space-y-4">
        <BottomSheetSelect label="Состояние *" value={formData.fields.condition || ""} options={[...SUSPENSION_CONDITIONS]} onSelect={(v) => updateField("condition", v)} error={errors.condition} />
        <BottomSheetSelect label="Тип детали *" value={formData.fields.partType || ""} options={[...SUSPENSION_TYPES]} onSelect={(v) => updateField("partType", v)} error={errors.partType} searchable searchPlaceholder="Поиск..." />
        <BottomSheetSelect label="Ось *" value={formData.fields.axle || ""} options={[...SUSPENSION_AXLES]} onSelect={(v) => updateField("axle", v)} error={errors.axle} />
        <BottomSheetSelect label="Сторона *" value={formData.fields.side || ""} options={[...SUSPENSION_SIDES]} onSelect={handleSideSelect} error={errors.side} />
        {formData.fields.quantity && (
          <div>
            <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Количество</label>
            <div className="w-full h-12 px-4 rounded-[12px] text-[15px] border border-[#E5E5EA] bg-[#F5F5F5] flex items-center text-[#8E8E93]" style={font}>
              {formData.fields.quantity}
            </div>
          </div>
        )}
        <BottomSheetSelect label="Марка авто *" value={formData.fields.carBrand || ""} options={[...CAR_BRANDS_SHORT]} onSelect={(v) => { updateField("carBrand", v); updateField("carModel", ""); }} searchable searchPlaceholder="Поиск марки..." error={errors.carBrand} />
        <BottomSheetSelect label="Модель авто *" value={formData.fields.carModel || ""} options={carModels} onSelect={(v) => updateField("carModel", v)} searchable searchPlaceholder="Поиск модели..." error={errors.carModel} />
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Год авто</label>
          <input type="text" inputMode="numeric" value={formData.fields.carYear || ""} onChange={(e) => updateField("carYear", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="2020" className={inputCn("carYear")} style={font} />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Тип кузова</label>
          <input type="text" value={formData.fields.bodyType || ""} onChange={(e) => updateField("bodyType", e.target.value)} placeholder="Седан" className={inputCn("bodyType")} style={font} />
        </div>
      </div>
    </PartsFormWrapper>
  );
}
