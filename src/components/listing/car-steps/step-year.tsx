"use client";

import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { YEARS } from "@/lib/data/listing-constants";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";

interface StepYearProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepYear({ form, errors, onUpdate }: StepYearProps) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Год выпуска
      </h2>

      <BottomSheetSelect
        label="Выберите год *"
        placeholder="Выберите год"
        value={form.year?.toString() || ""}
        options={YEARS.map(String)}
        onSelect={(v) => onUpdate("year", parseInt(v, 10))}
        error={errors.year}
      />
    </div>
  );
}
