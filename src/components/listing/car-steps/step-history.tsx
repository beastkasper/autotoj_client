"use client";

import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { PTS_OPTIONS, OWNERS_OPTIONS } from "@/lib/data/listing-constants";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface StepHistoryProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepHistory({ form, errors, onUpdate }: StepHistoryProps) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        История автомобиля
      </h2>

      {/* Mileage */}
      <div>
        <label className="block text-[13px] text-[#8E8E93] mb-1.5 font-[family-name:var(--font-manrope)]">
          Пробег, км *
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={form.mileage}
          onChange={(e) => onUpdate("mileage", e.target.value.replace(/\D/g, ""))}
          placeholder="Например: 45000"
          className={cn(
            "w-full h-12 px-4 rounded-[14px] border text-[16px] font-[family-name:var(--font-manrope)] outline-none transition-colors",
            errors.mileage ? "border-[#E53935]" : "border-[#D0D0D0] focus:border-black"
          )}
        />
        {errors.mileage && (
          <p className="mt-1 text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
            {errors.mileage}
          </p>
        )}
      </div>

      {/* PTS */}
      <BottomSheetSelect
        label="ПТС *"
        placeholder="Выберите ПТС"
        value={form.pts}
        options={PTS_OPTIONS}
        onSelect={(v) => onUpdate("pts", v)}
        error={errors.pts}
      />

      {/* Owners */}
      <BottomSheetSelect
        label="Владельцев по ПТС *"
        placeholder="Количество владельцев"
        value={form.owners}
        options={OWNERS_OPTIONS}
        onSelect={(v) => onUpdate("owners", v)}
        error={errors.owners}
      />

      {/* Accident */}
      <label className="flex items-center gap-3 cursor-pointer">
        <Checkbox
          checked={form.hasAccident}
          onCheckedChange={(checked) => onUpdate("hasAccident", !!checked)}
          className="w-5 h-5 rounded-[6px] border-2 border-[#D1D1D6] data-[state=checked]:bg-black data-[state=checked]:border-black"
        />
        <span className="text-[15px] text-[#1C1C1E] font-[family-name:var(--font-manrope)]">
          Автомобиль побывал в ДТП
        </span>
      </label>
    </div>
  );
}
