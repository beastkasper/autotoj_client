"use client";

import { useMemo } from "react";
import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { useGetDictsQuery } from "@/lib/features/dicts/dictsApi";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";

interface StepBodyTypeProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepBodyType({ form, errors, onUpdate }: StepBodyTypeProps) {
  const { data: dicts, isLoading } = useGetDictsQuery();

  const options = useMemo(
    () => (dicts?.body_types ?? []).map((b) => ({ id: b.id, label: b.name })),
    [dicts]
  );

  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Тип кузова
      </h2>

      <BottomSheetSelect
        label="Выберите тип кузова *"
        placeholder={isLoading ? "Загрузка..." : "Выберите тип кузова"}
        value={form.bodyType}
        options={options}
        onSelect={(v) => onUpdate("bodyType", v)}
        error={errors.bodyType}
      />
    </div>
  );
}
