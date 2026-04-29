"use client";

import { useMemo } from "react";
import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import {
  useGetBrandsQuery,
  useGetModelsQuery,
} from "@/lib/features/dicts/dictsApi";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";

interface StepModelProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepModel({ form, errors, onUpdate }: StepModelProps) {
  const { data: brands } = useGetBrandsQuery({ type: "cars" });
  const { data: models, isFetching } = useGetModelsQuery(
    { brand_id: form.brand },
    { skip: !form.brand }
  );

  const brandLabel = useMemo(
    () => brands?.find((b) => b.id === form.brand)?.name ?? form.customBrand,
    [brands, form.brand, form.customBrand]
  );

  const options = useMemo(
    () => (models ?? []).map((m) => ({ id: m.id, label: m.name })),
    [models]
  );

  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Модель
      </h2>
      <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)] -mt-2">
        Марка: <span className="font-medium text-black">{brandLabel || "—"}</span>
      </p>

      <BottomSheetSelect
        label="Выберите модель *"
        placeholder={isFetching ? "Загрузка..." : "Выберите модель"}
        value={form.model}
        options={options}
        onSelect={(v) => {
          onUpdate("model", v);
          onUpdate("customModel", "");
          onUpdate("generation", "");
        }}
        searchable
        searchPlaceholder="Поиск модели..."
        allowCustom
        customLabel="Добавить модель"
        onAddCustom={(v) => {
          onUpdate("customModel", v);
          onUpdate("model", "");
          onUpdate("generation", "");
        }}
        error={errors.model}
      />
    </div>
  );
}
