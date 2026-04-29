"use client";

import { useMemo } from "react";
import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { useGetDictsQuery } from "@/lib/features/dicts/dictsApi";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";

interface StepTransmissionProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepTransmission({ form, errors, onUpdate }: StepTransmissionProps) {
  const { data: dicts, isLoading } = useGetDictsQuery();

  const options = useMemo(
    () => (dicts?.transmission_types ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );

  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Коробка передач
      </h2>

      <BottomSheetSelect
        label="Выберите КПП *"
        placeholder={isLoading ? "Загрузка..." : "Выберите КПП"}
        value={form.transmission}
        options={options}
        onSelect={(v) => onUpdate("transmission", v)}
        error={errors.transmission}
      />
    </div>
  );
}
