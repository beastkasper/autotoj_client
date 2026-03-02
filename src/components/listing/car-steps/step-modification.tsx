"use client";

import type { CarListingForm } from "@/lib/types/listing";
import { cn } from "@/lib/utils";

interface StepModificationProps {
  form: CarListingForm;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepModification({ form, onUpdate }: StepModificationProps) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Модификация
      </h2>
      <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)] -mt-2">
        Необязательное поле. Укажите модификацию для более точного описания.
      </p>

      <div>
        <label className="block text-[13px] text-[#8E8E93] mb-1.5 font-[family-name:var(--font-manrope)]">
          Модификация
        </label>
        <input
          type="text"
          value={form.modification}
          onChange={(e) => onUpdate("modification", e.target.value)}
          placeholder="Например: 2.5 AT Premium"
          className={cn(
            "w-full h-12 px-4 rounded-[14px] border border-[#D0D0D0] text-[16px] font-[family-name:var(--font-manrope)] outline-none transition-colors focus:border-black"
          )}
        />
      </div>
    </div>
  );
}
