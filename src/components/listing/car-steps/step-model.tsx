"use client";

import { useMemo } from "react";
import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { CAR_MODELS } from "@/lib/data/listing-constants";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";

interface StepModelProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepModel({ form, errors, onUpdate }: StepModelProps) {
  const models = useMemo(() => {
    if (form.customBrand) return [];
    return CAR_MODELS[form.brand] || [];
  }, [form.brand, form.customBrand]);

  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Модель
      </h2>
      <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)] -mt-2">
        Марка: <span className="font-medium text-black">{form.customBrand || form.brand}</span>
      </p>

      <BottomSheetSelect
        label="Выберите модель *"
        placeholder="Выберите модель"
        value={form.customModel || form.model}
        options={models}
        onSelect={(v) => {
          onUpdate("model", v);
          onUpdate("customModel", "");
        }}
        searchable
        searchPlaceholder="Поиск модели..."
        allowCustom
        customLabel="Добавить модель"
        onAddCustom={(v) => {
          onUpdate("customModel", v);
          onUpdate("model", "");
        }}
        error={errors.model}
      />
    </div>
  );
}
