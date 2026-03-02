"use client";

import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { CAR_BODY_TYPES } from "@/lib/data/listing-constants";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";

interface StepBodyTypeProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepBodyType({ form, errors, onUpdate }: StepBodyTypeProps) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Тип кузова
      </h2>

      <BottomSheetSelect
        label="Выберите тип кузова *"
        placeholder="Выберите тип кузова"
        value={form.bodyType}
        options={CAR_BODY_TYPES}
        onSelect={(v) => onUpdate("bodyType", v)}
        error={errors.bodyType}
      />
    </div>
  );
}
