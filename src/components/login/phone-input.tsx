"use client";

import { formatPhone } from "@/lib/utils/phone";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(formatPhone(e.target.value));
  }

  return (
    <div>
      <label className="block text-[14px] font-semibold text-[var(--ios-label)] mb-2.5">
        Номер телефона
      </label>
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center h-[56px] px-5 text-[16px] font-semibold text-[var(--ios-label)] bg-[var(--ios-secondary-fill)] rounded-2xl select-none shrink-0">
          +992
        </span>
        <input
          type="tel"
          required
          className={`flex-1 h-[56px] border-none outline-none px-4 text-[16px] text-[var(--ios-label)] bg-[var(--ios-bg)] rounded-2xl placeholder:text-[#A0A0A5] ${
            error ? "ring-2 ring-[var(--ios-destructive)]" : ""
          }`}
          placeholder="(XX) XXX XX XX"
          value={value}
          onChange={handleChange}
          autoComplete="tel"
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-[var(--ios-destructive)]">{error}</p>
      )}
    </div>
  );
}
