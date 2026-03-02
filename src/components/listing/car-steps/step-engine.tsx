"use client";

import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { CAR_ENGINE_TYPES } from "@/lib/data/listing-constants";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";

interface StepEngineProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepEngine({ form, errors, onUpdate }: StepEngineProps) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Тип двигателя
      </h2>

      <BottomSheetSelect
        label="Выберите тип двигателя *"
        placeholder="Выберите тип двигателя"
        value={form.engineType}
        options={CAR_ENGINE_TYPES}
        onSelect={(v) => onUpdate("engineType", v)}
        error={errors.engineType}
      />
    </div>
  );
}
