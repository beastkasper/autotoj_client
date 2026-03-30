"use client";

import { useState, useCallback } from "react";
import { PartsFormWrapper } from "@/components/add-listing/PartsFormWrapper";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";
import type { PartsFormData, PartsValidationErrors } from "@/lib/types/parts-listing";
import { INITIAL_PARTS_FORM } from "@/lib/types/parts-listing";
import {
  TRANSMISSION_CONDITIONS, TRANSMISSION_TYPES, TRANSMISSION_DRIVE_TYPES,
  CAR_BRANDS_SHORT, CAR_MODELS,
} from "@/lib/data/parts-constants";
interface TransmissionListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartsFormData) => void;
}

export function TransmissionListingForm({ onBack, onClose, onPublish }: TransmissionListingFormProps) {
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

  const carModels = formData.fields.brand ? (CAR_MODELS[formData.fields.brand] || []) : [];

  return (
    <PartsFormWrapper
      title="КПП"
      publishButtonLabel="Проверка объявления"
      formData={formData} errors={errors}
      onUpdateField={updateField} onUpdateToggle={updateToggle} onUpdateForm={updateForm}
      onBack={onBack} onClose={onClose} onReset={handleReset} onPublish={handlePublish}
    >
      <div className="space-y-4">
        <BottomSheetSelect label="Марка авто *" value={formData.fields.brand || ""} options={[...CAR_BRANDS_SHORT]} onSelect={handleBrandSelect} searchable searchPlaceholder="Поиск марки..." error={errors.brand} />
        <BottomSheetSelect label="Модель авто *" value={formData.fields.model || ""} options={carModels} onSelect={(v) => updateField("model", v)} searchable searchPlaceholder="Поиск модели..." error={errors.model} />
        <BottomSheetSelect label="Состояние *" value={formData.fields.condition || ""} options={[...TRANSMISSION_CONDITIONS]} onSelect={(v) => updateField("condition", v)} error={errors.condition} />
        <BottomSheetSelect label="Тип КПП" value={formData.fields.transmissionType || ""} options={[...TRANSMISSION_TYPES]} onSelect={(v) => updateField("transmissionType", v)} />
        <BottomSheetSelect label="Тип привода" value={formData.fields.driveType || ""} options={[...TRANSMISSION_DRIVE_TYPES]} onSelect={(v) => updateField("driveType", v)} />
      </div>
    </PartsFormWrapper>
  );
}
