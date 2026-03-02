"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function formatPhoneDisplay(digits: string): string {
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
}

export function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
      onChange(raw);
    },
    [onChange]
  );

  return (
    <div>
      <label className="block text-[13px] text-[#8E8E93] mb-1.5 font-[family-name:var(--font-manrope)]">
        Телефон
      </label>
      <div
        className={cn(
          "flex items-center h-12 rounded-[14px] border bg-white overflow-hidden",
          error ? "border-[#E53935]" : "border-[#C7C7CC] focus-within:border-black"
        )}
      >
        <span className="flex items-center justify-center h-full px-3 bg-[#F2F2F7] text-[16px] font-medium text-[#1C1C1E] font-[family-name:var(--font-manrope)] border-r border-[#C7C7CC]">
          +992
        </span>
        <input
          type="tel"
          inputMode="numeric"
          value={formatPhoneDisplay(value)}
          onChange={handleChange}
          placeholder="XX XXX XXXX"
          className="flex-1 h-full px-4 text-[16px] font-[family-name:var(--font-manrope)] outline-none bg-transparent"
        />
      </div>
      {error && (
        <p className="mt-1 text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
          {error}
        </p>
      )}
    </div>
  );
}
