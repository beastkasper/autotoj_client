"use client";

import { useMemo } from "react";
import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { useGetDictsQuery } from "@/lib/features/dicts/dictsApi";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";

interface StepDriveProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepDrive({ form, errors, onUpdate }: StepDriveProps) {
  const { data: dicts, isLoading } = useGetDictsQuery();

  const options = useMemo(
    () => (dicts?.drive_types ?? []).map((d) => ({ id: d.id, label: d.name })),
    [dicts]
  );

  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Тип привода
      </h2>

      <BottomSheetSelect
        label="Выберите тип привода *"
        placeholder={isLoading ? "Загрузка..." : "Выберите тип привода"}
        value={form.driveType}
        options={options}
        onSelect={(v) => onUpdate("driveType", v)}
        error={errors.driveType}
      />
    </div>
  );
}
