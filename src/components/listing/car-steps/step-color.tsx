"use client";

import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { COLORS } from "@/lib/data/listing-constants";
import { cn } from "@/lib/utils";

interface StepColorProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepColor({ form, errors, onUpdate }: StepColorProps) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Цвет
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onUpdate("color", color)}
            className={cn(
              "h-12 rounded-xl border text-[15px] font-[family-name:var(--font-manrope)] transition-all",
              form.color === color
                ? "bg-black text-white border-black font-semibold"
                : "bg-white text-black border-[#D1D1D6] active:bg-[#F2F2F7]"
            )}
          >
            {color}
          </button>
        ))}
      </div>

      {errors.color && (
        <p className="text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
          {errors.color}
        </p>
      )}
    </div>
  );
}
