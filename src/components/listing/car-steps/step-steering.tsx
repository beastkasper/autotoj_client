"use client";

import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { useGetDictsQuery } from "@/lib/features/dicts/dictsApi";
import { cn } from "@/lib/utils";

interface StepSteeringProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepSteering({ form, errors, onUpdate }: StepSteeringProps) {
  const { data: dicts, isLoading } = useGetDictsQuery();
  const positions = dicts?.steering_positions ?? [];

  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Руль
      </h2>

      {isLoading ? (
        <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
          Загрузка...
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {positions.map((p) => {
            const isSelected = form.steeringWheel === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onUpdate("steeringWheel", p.id)}
                className={cn(
                  "h-12 rounded-xl border text-[15px] font-[family-name:var(--font-manrope)] transition-all",
                  isSelected
                    ? "bg-black text-white border-black font-semibold"
                    : "bg-white text-black border-[#D1D1D6] active:bg-[#F2F2F7]"
                )}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      )}

      {errors.steeringWheel && (
        <p className="text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
          {errors.steeringWheel}
        </p>
      )}
    </div>
  );
}
