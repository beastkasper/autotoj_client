"use client";

import { useState, useCallback } from "react";
import { PartsFormWrapper } from "@/components/add-listing/PartsFormWrapper";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";
import type { PartsFormData, PartsValidationErrors } from "@/lib/types/parts-listing";
import { INITIAL_PARTS_FORM } from "@/lib/types/parts-listing";
import {
  STEERING_VEHICLE_TYPES, STEERING_CONDITIONS, STEERING_TYPES,
  STEERING_MATERIALS, CAR_BRANDS_SHORT, CAR_MODELS,
} from "@/lib/data/parts-constants";
import { cn } from "@/lib/utils";

interface SteeringWheelListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartsFormData) => void;
}

export function SteeringWheelListingForm({ onBack, onClose, onPublish }: SteeringWheelListingFormProps) {
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
    if (!formData.fields.vehicleType) e.vehicleType = "Обязательное поле";
    if (!formData.fields.condition) e.condition = "Обязательное поле";
    if (!formData.fields.wheelType) e.wheelType = "Обязательное поле";
    if (!formData.price.trim()) e.price = "Укажите цену";
    if (formData.phone && formData.phone.length !== 9) e.phone = "Номер должен содержать 9 цифр";
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
      title="Руль"
      formData={formData} errors={errors}
      onUpdateField={updateField} onUpdateToggle={updateToggle} onUpdateForm={updateForm}
      onBack={onBack} onClose={onClose} onReset={handleReset} onPublish={handlePublish}
    >
      <div className="space-y-4">
        <BottomSheetSelect label="Тип ТС *" value={formData.fields.vehicleType || ""} options={[...STEERING_VEHICLE_TYPES]} onSelect={(v) => updateField("vehicleType", v)} error={errors.vehicleType} />
        <BottomSheetSelect label="Состояние *" value={formData.fields.condition || ""} options={[...STEERING_CONDITIONS]} onSelect={(v) => updateField("condition", v)} error={errors.condition} />
        <BottomSheetSelect label="Тип руля *" value={formData.fields.wheelType || ""} options={[...STEERING_TYPES]} onSelect={(v) => updateField("wheelType", v)} error={errors.wheelType} />
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Диаметр</label>
          <input type="text" inputMode="numeric" value={formData.fields.diameter || ""} onChange={(e) => updateField("diameter", e.target.value.replace(/\D/g, ""))} placeholder="370" className={inputCn("diameter")} style={font} />
        </div>
        <BottomSheetSelect label="Материал" value={formData.fields.material || ""} options={[...STEERING_MATERIALS]} onSelect={(v) => updateField("material", v)} />
        <BottomSheetSelect label="Марка авто" value={formData.fields.carBrand || ""} options={[...CAR_BRANDS_SHORT]} onSelect={(v) => { updateField("carBrand", v); updateField("carModel", ""); }} searchable searchPlaceholder="Поиск марки..." />
        <BottomSheetSelect label="Модель авто" value={formData.fields.carModel || ""} options={carModels} onSelect={(v) => updateField("carModel", v)} searchable searchPlaceholder="Поиск модели..." />
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Год авто</label>
          <input type="text" inputMode="numeric" value={formData.fields.carYear || ""} onChange={(e) => updateField("carYear", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="2020" className={inputCn("carYear")} style={font} />
        </div>
      </div>
    </PartsFormWrapper>
  );
}
