"use client";

import type { CarListingForm } from "@/lib/types/listing";
import { cn } from "@/lib/utils";

interface StepEngineVolumeProps {
  form: CarListingForm;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepEngineVolume({ form, onUpdate }: StepEngineVolumeProps) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Объём двигателя
      </h2>
      <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)] -mt-2">
        Необязательное поле
      </p>

      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={form.engineVolume}
          onChange={(e) => onUpdate("engineVolume", e.target.value.replace(/[^\d.,]/g, "").replace(",", "."))}
          placeholder="2.0"
          className={cn(
            "w-full h-12 px-4 pr-10 rounded-[14px] border border-[#D0D0D0] text-[16px] font-[family-name:var(--font-manrope)] outline-none transition-colors focus:border-black"
          )}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
          л
        </span>
      </div>
    </div>
  );
}
