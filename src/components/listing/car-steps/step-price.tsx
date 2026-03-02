"use client";

import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { PriceInput } from "@/components/listing/price-input";
import { Checkbox } from "@/components/ui/checkbox";

interface StepPriceProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepPrice({ form, errors, onUpdate }: StepPriceProps) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Цена
      </h2>

      <PriceInput
        value={form.price}
        onChange={(v) => onUpdate("price", v)}
        error={errors.price}
      />

      <div className="flex flex-col gap-3 mt-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={form.exchangePossible}
            onCheckedChange={(checked) => onUpdate("exchangePossible", !!checked)}
            className="w-5 h-5 rounded-[6px] border-2 border-[#D1D1D6] data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
          <span className="text-[15px] text-[#1C1C1E] font-[family-name:var(--font-manrope)]">
            Возможен обмен
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={form.negotiable}
            onCheckedChange={(checked) => onUpdate("negotiable", !!checked)}
            className="w-5 h-5 rounded-[6px] border-2 border-[#D1D1D6] data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
          <span className="text-[15px] text-[#1C1C1E] font-[family-name:var(--font-manrope)]">
            Возможен торг
          </span>
        </label>
      </div>
    </div>
  );
}
