"use client";

import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { useGetDictsQuery } from "@/lib/features/dicts/dictsApi";
import { cn } from "@/lib/utils";

interface StepConditionProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepCondition({ form, errors, onUpdate }: StepConditionProps) {
  const { data: dicts, isLoading } = useGetDictsQuery();
  const conditions = dicts?.conditions ?? [];

  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Состояние
      </h2>

      {isLoading ? (
        <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
          Загрузка...
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {conditions.map((c) => {
            const isSelected = form.condition === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onUpdate("condition", c.id)}
                className={cn(
                  "h-12 rounded-xl border text-[15px] font-[family-name:var(--font-manrope)] transition-all",
                  isSelected
                    ? "bg-black text-white border-black font-semibold"
                    : "bg-white text-black border-[#D1D1D6] active:bg-[#F2F2F7]"
                )}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      {errors.condition && (
        <p className="text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
          {errors.condition}
        </p>
      )}
    </div>
  );
}
