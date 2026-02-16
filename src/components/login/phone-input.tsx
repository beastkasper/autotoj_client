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
      <label className="block text-[13px] font-medium text-[var(--ios-secondary-label)] mb-2">
        Номер телефона
      </label>
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center h-[48px] px-4 text-sm font-medium text-[var(--ios-label)] bg-[var(--ios-secondary-fill)] rounded-xl select-none shrink-0">
          +992
        </span>
        <input
          type="tel"
          required
          className={`flex-1 h-[48px] border-none outline-none px-4 text-sm text-[var(--ios-label)] bg-[var(--ios-bg)] rounded-xl placeholder:text-gray-300 ${
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
