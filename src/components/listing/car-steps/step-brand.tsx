"use client";

import { useMemo } from "react";
import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { useGetBrandsQuery } from "@/lib/features/dicts/dictsApi";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";

interface StepBrandProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepBrand({ form, errors, onUpdate }: StepBrandProps) {
  const { data: brands, isLoading } = useGetBrandsQuery({ type: "cars" });

  const options = useMemo(
    () => (brands ?? []).map((b) => ({ id: b.id, label: b.name })),
    [brands]
  );

  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Марка
      </h2>

      <BottomSheetSelect
        label="Выберите марку *"
        placeholder={isLoading ? "Загрузка..." : "Выберите марку"}
        value={form.brand}
        options={options}
        onSelect={(v) => {
          onUpdate("brand", v);
          onUpdate("customBrand", "");
          onUpdate("model", "");
          onUpdate("customModel", "");
          onUpdate("generation", "");
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
          onUpdate("generation", "");
        }}
        error={errors.brand}
      />
    </div>
  );
}
