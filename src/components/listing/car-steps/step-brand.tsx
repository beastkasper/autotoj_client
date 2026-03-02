"use client";

import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { CAR_BRANDS } from "@/lib/data/listing-constants";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";

interface StepBrandProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepBrand({ form, errors, onUpdate }: StepBrandProps) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Марка
      </h2>

      <BottomSheetSelect
        label="Выберите марку *"
        placeholder="Выберите марку"
        value={form.customBrand || form.brand}
        options={CAR_BRANDS}
        onSelect={(v) => {
          onUpdate("brand", v);
          onUpdate("customBrand", "");
          onUpdate("model", "");
          onUpdate("customModel", "");
        }}
        searchable
        searchPlaceholder="Поиск марки..."
        allowCustom
        customLabel="Добавить марку"
        onAddCustom={(v) => {
          onUpdate("customBrand", v);
          onUpdate("brand", "");
          onUpdate("model", "");
          onUpdate("customModel", "");
        }}
        error={errors.brand}
      />
    </div>
  );
}
