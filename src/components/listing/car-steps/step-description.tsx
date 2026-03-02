"use client";

import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { cn } from "@/lib/utils";

interface StepDescriptionProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepDescription({ form, errors, onUpdate }: StepDescriptionProps) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Описание
      </h2>
      <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)] -mt-2">
        Необязательное. Расскажите подробнее о вашем автомобиле.
      </p>

      <div className="relative">
        <textarea
          value={form.description}
          onChange={(e) => {
            if (e.target.value.length <= 3000) {
              onUpdate("description", e.target.value);
            }
          }}
          placeholder={`Расскажите о своём автомобиле:\n• Состояние\n• Особенности\n• История обслуживания\n• Дополнительное оборудование`}
          rows={6}
          className={cn(
            "w-full min-h-[120px] p-4 rounded-[14px] border text-[16px] font-[family-name:var(--font-manrope)] outline-none resize-none transition-colors",
            errors.description ? "border-[#E53935]" : "border-[#D0D0D0] focus:border-black"
          )}
        />
        <span className="absolute bottom-3 right-4 text-[12px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
          {form.description.length} / 3000
        </span>
      </div>

      {errors.description && (
        <p className="text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
          {errors.description}
        </p>
      )}
    </div>
  );
}
