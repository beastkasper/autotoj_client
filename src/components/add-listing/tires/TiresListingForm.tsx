"use client";

import { useState, useCallback } from "react";
import { PartsFormWrapper } from "@/components/add-listing/PartsFormWrapper";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";
import { ToggleSwitch } from "@/components/listing/toggle-switch";
import type { PartsFormData, PartsValidationErrors } from "@/lib/types/parts-listing";
import { INITIAL_PARTS_FORM } from "@/lib/types/parts-listing";
import { TIRE_VEHICLE_TYPES, TIRE_TYPES, TIRE_CONDITIONS, TIRE_BRANDS } from "@/lib/data/parts-constants";
import { cn } from "@/lib/utils";

interface TiresListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartsFormData) => void;
}

export function TiresListingForm({ onBack, onClose, onPublish }: TiresListingFormProps) {
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
    if (!formData.fields.tireType) e.tireType = "Обязательное поле";
    if (!formData.fields.condition) e.condition = "Обязательное поле";
    if (!formData.fields.width) e.width = "Обязательное поле";
    if (!formData.fields.profile) e.profile = "Обязательное поле";
    if (!formData.fields.diameter) e.diameter = "Обязательное поле";
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

  return (
    <PartsFormWrapper
      title="Шины"
      formData={formData} errors={errors}
      onUpdateField={updateField} onUpdateToggle={updateToggle} onUpdateForm={updateForm}
      onBack={onBack} onClose={onClose} onReset={handleReset} onPublish={handlePublish}
    >
      <div className="space-y-4">
        {/* Основная информация */}
        <BottomSheetSelect label="Тип ТС" value={formData.fields.vehicleType || ""} options={[...TIRE_VEHICLE_TYPES]} onSelect={(v) => updateField("vehicleType", v)} />
        <BottomSheetSelect label="Тип шин *" value={formData.fields.tireType || ""} options={[...TIRE_TYPES]} onSelect={(v) => updateField("tireType", v)} error={errors.tireType} />
        <BottomSheetSelect label="Состояние *" value={formData.fields.condition || ""} options={[...TIRE_CONDITIONS]} onSelect={(v) => updateField("condition", v)} error={errors.condition} />

        {/* Размер */}
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Ширина *</label>
          <input type="text" inputMode="numeric" value={formData.fields.width || ""} onChange={(e) => updateField("width", e.target.value.replace(/\D/g, ""))} placeholder="205" className={inputCn("width")} style={font} />
          {errors.width && <p className="mt-1 text-[12px] text-[#D32F2F]" style={font}>{errors.width}</p>}
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Профиль *</label>
          <input type="text" inputMode="numeric" value={formData.fields.profile || ""} onChange={(e) => updateField("profile", e.target.value.replace(/\D/g, ""))} placeholder="55" className={inputCn("profile")} style={font} />
          {errors.profile && <p className="mt-1 text-[12px] text-[#D32F2F]" style={font}>{errors.profile}</p>}
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Диаметр *</label>
          <input type="text" inputMode="numeric" value={formData.fields.diameter || ""} onChange={(e) => updateField("diameter", e.target.value.replace(/\D/g, ""))} placeholder="16" className={inputCn("diameter")} style={font} />
          {errors.diameter && <p className="mt-1 text-[12px] text-[#D32F2F]" style={font}>{errors.diameter}</p>}
        </div>

        {/* Характеристики */}
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Индекс нагрузки</label>
          <input type="text" value={formData.fields.loadIndex || ""} onChange={(e) => updateField("loadIndex", e.target.value)} placeholder="91" className={inputCn("loadIndex")} style={font} />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Индекс скорости</label>
          <input type="text" value={formData.fields.speedIndex || ""} onChange={(e) => updateField("speedIndex", e.target.value)} placeholder="V" className={inputCn("speedIndex")} style={font} />
        </div>
        <ToggleSwitch label="RunFlat" checked={formData.toggles.runFlat || false} onChange={(v) => updateToggle("runFlat", v)} />
        <ToggleSwitch label="Шипованные" checked={formData.toggles.studded || false} onChange={(v) => updateToggle("studded", v)} />
        <ToggleSwitch label="Усиленные (XL)" checked={formData.toggles.reinforced || false} onChange={(v) => updateToggle("reinforced", v)} />

        {/* Производитель */}
        <BottomSheetSelect label="Бренд" value={formData.fields.brand || ""} options={[...TIRE_BRANDS]} onSelect={(v) => updateField("brand", v)} searchable searchPlaceholder="Поиск бренда..." allowCustom customLabel="Добавить бренд" onAddCustom={(v) => updateField("brand", v)} />
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Модель</label>
          <input type="text" value={formData.fields.model || ""} onChange={(e) => updateField("model", e.target.value)} placeholder="Pilot Sport 4" className={inputCn("model")} style={font} />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Страна производства</label>
          <input type="text" value={formData.fields.countryOfOrigin || ""} onChange={(e) => updateField("countryOfOrigin", e.target.value)} placeholder="Германия" className={inputCn("countryOfOrigin")} style={font} />
        </div>

        {/* Количество */}
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Количество</label>
          <input type="text" inputMode="numeric" value={formData.fields.quantity || ""} onChange={(e) => updateField("quantity", e.target.value.replace(/\D/g, ""))} placeholder="4" className={inputCn("quantity")} style={font} />
        </div>
      </div>
    </PartsFormWrapper>
  );
}
