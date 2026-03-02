"use client";

import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { CAR_DRIVE_TYPES } from "@/lib/data/listing-constants";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";

interface StepDriveProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepDrive({ form, errors, onUpdate }: StepDriveProps) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Тип привода
      </h2>

      <BottomSheetSelect
        label="Выберите тип привода *"
        placeholder="Выберите тип привода"
        value={form.driveType}
        options={CAR_DRIVE_TYPES}
        onSelect={(v) => onUpdate("driveType", v)}
        error={errors.driveType}
      />
    </div>
  );
}
