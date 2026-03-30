"use client";

import { useState, useCallback } from "react";
import { PartsFormWrapper } from "@/components/add-listing/PartsFormWrapper";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";
import type { PartsFormData, PartsValidationErrors } from "@/lib/types/parts-listing";
import { INITIAL_PARTS_FORM } from "@/lib/types/parts-listing";
import {
  BODY_PART_CONDITIONS, BODY_PART_TYPES, BODY_PART_SIDES, BODY_PART_COLORS,
} from "@/lib/data/parts-constants";
import { cn } from "@/lib/utils";

interface BodyPartsListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartsFormData) => void;
}

export function BodyPartsListingForm({ onBack, onClose, onPublish }: BodyPartsListingFormProps) {
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
    if (!formData.fields.partCategory) e.partCategory = "Обязательное поле";
    if (!formData.fields.condition) e.condition = "Обязательное поле";
    if (!formData.price.trim()) e.price = "Укажите цену";
    if (!formData.name.trim()) e.name = "Укажите ваше имя";
    if (!formData.phone || formData.phone.length !== 9) e.phone = "Номер должен содержать 9 цифр";
    setErrors(e);
    if (Object.keys(e).length === 0) onPublish(formData);
  }, [formData, onPublish]);

  return (
    <PartsFormWrapper
      title="Детали кузова"
      formData={formData} errors={errors}
      onUpdateField={updateField} onUpdateToggle={updateToggle} onUpdateForm={updateForm}
      onBack={onBack} onClose={onClose} onReset={handleReset} onPublish={handlePublish}
    >
      <div className="space-y-4">
        <BottomSheetSelect label="Категория детали *" value={formData.fields.partCategory || ""} options={[...BODY_PART_TYPES]} onSelect={(v) => updateField("partCategory", v)} error={errors.partCategory} searchable searchPlaceholder="Поиск детали..." />
        <BottomSheetSelect label="Сторона" value={formData.fields.side || ""} options={[...BODY_PART_SIDES]} onSelect={(v) => updateField("side", v)} />
        <BottomSheetSelect label="Состояние *" value={formData.fields.condition || ""} options={[...BODY_PART_CONDITIONS]} onSelect={(v) => updateField("condition", v)} error={errors.condition} />
        <BottomSheetSelect label="Цвет" value={formData.fields.color || ""} options={[...BODY_PART_COLORS]} onSelect={(v) => updateField("color", v)} />
      </div>
    </PartsFormWrapper>
  );
}
