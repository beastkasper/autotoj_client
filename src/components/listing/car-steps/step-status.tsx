"use client";

import type { CarListingForm, ValidationErrors } from "@/lib/types/listing";
import { VEHICLE_STATUSES } from "@/lib/data/listing-constants";
import { SegmentedControl } from "@/components/listing/segmented-control";
import { ToggleSwitch } from "@/components/listing/toggle-switch";
import { cn } from "@/lib/utils";

interface StepStatusProps {
  form: CarListingForm;
  errors: ValidationErrors;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepStatus({ form, errors, onUpdate }: StepStatusProps) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Статус автомобиля
      </h2>

      <div>
        <label className="block text-[13px] text-[#8E8E93] mb-2 font-[family-name:var(--font-manrope)]">
          Статус *
        </label>
        <SegmentedControl
          options={VEHICLE_STATUSES}
          value={form.status}
          onChange={(v) => onUpdate("status", v)}
          error={errors.status}
        />
      </div>

      <ToggleSwitch
        label="Не растаможен"
        checked={form.isNotCustomsCleared}
        onChange={(v) => onUpdate("isNotCustomsCleared", v)}
        infoText="Отметьте пункт, если вы ввезли транспорт из-за границы, но не растаможили его. Даже если он привезён из страны Таможенного союза, перед продажей всё равно нужно будет заплатить пошлину."
      />

      {form.status === "На заказ" && (
        <div>
          <label className="block text-[13px] text-[#8E8E93] mb-1.5 font-[family-name:var(--font-manrope)]">
            Страна поставки *
          </label>
          <input
            type="text"
            value={form.supplyCountry}
            onChange={(e) => onUpdate("supplyCountry", e.target.value)}
            placeholder="Например: Германия, Корея, США"
            className={cn(
              "w-full h-12 px-4 rounded-[14px] border text-[16px] font-[family-name:var(--font-manrope)] outline-none transition-colors",
              errors.supplyCountry
                ? "border-[#E53935]"
                : "border-[#D0D0D0] focus:border-black"
            )}
          />
          {errors.supplyCountry && (
            <p className="mt-1 text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
              {errors.supplyCountry}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
