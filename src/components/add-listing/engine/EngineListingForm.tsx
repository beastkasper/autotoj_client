"use client";

import { useState, useCallback } from "react";
import { PartsFormWrapper } from "@/components/add-listing/PartsFormWrapper";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";
import type { PartsFormData, PartsValidationErrors } from "@/lib/types/parts-listing";
import { INITIAL_PARTS_FORM } from "@/lib/types/parts-listing";
import {
  ENGINE_CONDITIONS, ENGINE_TYPES, ENGINE_CYLINDER_LAYOUTS, ENGINE_CYLINDER_COUNTS,
  CAR_BRANDS_SHORT, CAR_MODELS,
} from "@/lib/data/parts-constants";
import { cn } from "@/lib/utils";

interface EngineListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartsFormData) => void;
}

export function EngineListingForm({ onBack, onClose, onPublish }: EngineListingFormProps) {
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

  const handleBrandSelect = useCallback((v: string) => {
    updateField("brand", v);
    updateField("model", "");
  }, [updateField]);

  const handlePublish = useCallback(() => {
    const e: PartsValidationErrors = {};
    if (!formData.fields.brand) e.brand = "Укажите марку";
    if (!formData.fields.model) e.model = "Укажите модель";
    if (!formData.fields.condition) e.condition = "Обязательное поле";
    if (!formData.price.trim()) e.price = "Укажите цену";
    if (!formData.name.trim()) e.name = "Укажите ваше имя";
    if (!formData.phone || formData.phone.length !== 9) e.phone = "Номер должен содержать 9 цифр";
    if (!formData.city) e.city = "Выберите город";
    setErrors(e);
    if (Object.keys(e).length === 0) onPublish(formData);
  }, [formData, onPublish]);

  const inputCn = (field: string) => cn(
    "w-full h-12 px-4 rounded-[12px] text-[15px] border bg-white outline-none",
    errors[field] ? "border-[#D32F2F] bg-[#FFEBEE]" : "border-[#E5E5EA] focus:border-[#000000]"
  );
  const font = { fontFamily: "Manrope, system-ui, sans-serif" } as const;

  const carModels = formData.fields.brand ? (CAR_MODELS[formData.fields.brand] || []) : [];

  return (
    <PartsFormWrapper
      title="Двигатель"
      publishButtonLabel="Проверка объявления"
      formData={formData} errors={errors}
      onUpdateField={updateField} onUpdateToggle={updateToggle} onUpdateForm={updateForm}
      onBack={onBack} onClose={onClose} onReset={handleReset} onPublish={handlePublish}
    >
      <div className="space-y-4">
        <BottomSheetSelect label="Марка авто *" value={formData.fields.brand || ""} options={[...CAR_BRANDS_SHORT]} onSelect={handleBrandSelect} searchable searchPlaceholder="Поиск марки..." error={errors.brand} />
        <BottomSheetSelect label="Модель авто *" value={formData.fields.model || ""} options={carModels} onSelect={(v) => updateField("model", v)} searchable searchPlaceholder="Поиск модели..." error={errors.model} />
        <BottomSheetSelect label="Тип двигателя" value={formData.fields.engineType || ""} options={[...ENGINE_TYPES]} onSelect={(v) => updateField("engineType", v)} />
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Объём (см³)</label>
          <input type="text" inputMode="numeric" value={formData.fields.displacement || ""} onChange={(e) => updateField("displacement", e.target.value.replace(/\D/g, ""))} placeholder="2000" className={inputCn("displacement")} style={font} />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Мощность (л.с.)</label>
          <input type="text" inputMode="numeric" value={formData.fields.power || ""} onChange={(e) => updateField("power", e.target.value.replace(/\D/g, ""))} placeholder="150" className={inputCn("power")} style={font} />
        </div>
        <BottomSheetSelect label="Расположение цилиндров" value={formData.fields.cylinderLayout || ""} options={[...ENGINE_CYLINDER_LAYOUTS]} onSelect={(v) => updateField("cylinderLayout", v)} />
        <BottomSheetSelect label="Количество цилиндров" value={formData.fields.cylinderCount || ""} options={[...ENGINE_CYLINDER_COUNTS]} onSelect={(v) => updateField("cylinderCount", v)} />
        <BottomSheetSelect label="Состояние *" value={formData.fields.condition || ""} options={[...ENGINE_CONDITIONS]} onSelect={(v) => updateField("condition", v)} error={errors.condition} />
      </div>
    </PartsFormWrapper>
  );
}
