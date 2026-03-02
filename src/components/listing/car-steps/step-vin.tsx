"use client";

import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { cn } from "@/lib/utils";

interface StepVinProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepVin({ form, errors, onUpdate }: StepVinProps) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        VIN-номер
      </h2>
      <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)] -mt-2">
        Необязательное поле. VIN поможет покупателям проверить историю автомобиля.
      </p>

      <div>
        <label className="block text-[13px] text-[#8E8E93] mb-1.5 font-[family-name:var(--font-manrope)]">
          VIN-номер
        </label>
        <input
          type="text"
          value={form.vin}
          onChange={(e) =>
            onUpdate("vin", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17))
          }
          placeholder="Введите 17 символов"
          maxLength={17}
          className={cn(
            "w-full h-12 px-4 rounded-[14px] border text-[16px] font-[family-name:var(--font-manrope)] outline-none uppercase tracking-wider transition-colors",
            errors.vin
              ? "border-[#E53935]"
              : "border-[#D0D0D0] focus:border-black"
          )}
        />
        <div className="flex justify-between mt-1">
          {errors.vin ? (
            <p className="text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
              {errors.vin}
            </p>
          ) : (
            <span />
          )}
          <span className="text-[12px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
            {form.vin.length} / 17
          </span>
        </div>
      </div>
    </div>
  );
}
