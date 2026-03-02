"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

function formatPrice(val: string): string {
  const digits = val.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function PriceInput({
  value,
  onChange,
  error,
  label = "Цена",
}: PriceInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      onChange(raw);
    },
    [onChange]
  );

  return (
    <div>
      <label className="block text-[13px] text-[#8E8E93] mb-1.5 font-[family-name:var(--font-manrope)]">
        {label}
      </label>
      <div
        className={cn(
          "flex items-center h-16 px-4 rounded-2xl border bg-white",
          error ? "border-[#E53935]" : "border-[#C7C7CC] focus-within:border-black"
        )}
      >
        <input
          type="text"
          inputMode="numeric"
          value={formatPrice(value)}
          onChange={handleChange}
          placeholder="0"
          className="flex-1 text-[24px] font-bold font-[family-name:var(--font-manrope)] outline-none bg-transparent"
        />
        <span className="text-[20px] font-bold text-[#8E8E93] ml-2 font-[family-name:var(--font-manrope)]">
          с
        </span>
      </div>
      {error && (
        <p className="mt-1 text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
          {error}
        </p>
      )}
    </div>
  );
}
