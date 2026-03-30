"use client";

import { useState, useCallback } from "react";
import { PartsFormWrapper } from "@/components/add-listing/PartsFormWrapper";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";
import type { PartsFormData, PartsValidationErrors } from "@/lib/types/parts-listing";
import { INITIAL_PARTS_FORM } from "@/lib/types/parts-listing";
import { CONSUMABLE_CONDITIONS, CONSUMABLE_TYPES } from "@/lib/data/parts-constants";
import { cn } from "@/lib/utils";

interface ConsumablesListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartsFormData) => void;
}

export function ConsumablesListingForm({ onBack, onClose, onPublish }: ConsumablesListingFormProps) {
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
    if (!formData.fields.condition) e.condition = "Обязательное поле";
    if (!formData.fields.consumableType) e.consumableType = "Обязательное поле";
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

  return (
    <PartsFormWrapper
      title="Расходники"
      publishButtonLabel="Проверка объявления"
      formData={formData} errors={errors}
      onUpdateField={updateField} onUpdateToggle={updateToggle} onUpdateForm={updateForm}
      onBack={onBack} onClose={onClose} onReset={handleReset} onPublish={handlePublish}
    >
      <div className="space-y-4">
        <BottomSheetSelect label="Состояние *" value={formData.fields.condition || ""} options={[...CONSUMABLE_CONDITIONS]} onSelect={(v) => updateField("condition", v)} error={errors.condition} />
        <BottomSheetSelect label="Тип расходника *" value={formData.fields.consumableType || ""} options={[...CONSUMABLE_TYPES]} onSelect={(v) => updateField("consumableType", v)} error={errors.consumableType} searchable searchPlaceholder="Поиск..." />
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Объём</label>
          <input type="text" value={formData.fields.volume || ""} onChange={(e) => updateField("volume", e.target.value)} placeholder="4 л" className={inputCn("volume")} style={font} />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Вязкость</label>
          <input type="text" value={formData.fields.viscosity || ""} onChange={(e) => updateField("viscosity", e.target.value)} placeholder="5W-30" className={inputCn("viscosity")} style={font} />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Артикул</label>
          <input type="text" value={formData.fields.articleNumber || ""} onChange={(e) => updateField("articleNumber", e.target.value)} placeholder="OE 12345" className={inputCn("articleNumber")} style={font} />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Производитель</label>
          <input type="text" value={formData.fields.manufacturer || ""} onChange={(e) => updateField("manufacturer", e.target.value)} placeholder="Mobil" className={inputCn("manufacturer")} style={font} />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Совместимость</label>
          <textarea
            value={formData.fields.compatibility || ""}
            onChange={(e) => { if (e.target.value.length <= 500) updateField("compatibility", e.target.value); }}
            placeholder="Укажите марки и модели авто"
            rows={3}
            className="w-full px-4 py-3 rounded-[12px] text-[15px] border border-[#E5E5EA] bg-white focus:border-[#000000] outline-none resize-none"
            style={font}
          />
          <span className="text-[12px] text-[#8E8E93]" style={font}>{500 - (formData.fields.compatibility || "").length}</span>
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Количество</label>
          <input type="text" inputMode="numeric" value={formData.fields.quantity || ""} onChange={(e) => updateField("quantity", e.target.value.replace(/\D/g, ""))} placeholder="1" className={inputCn("quantity")} style={font} />
        </div>
      </div>
    </PartsFormWrapper>
  );
}
