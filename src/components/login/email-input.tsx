"use client";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function EmailInput({ value, onChange, error }: EmailInputProps) {
  return (
    <div>
      <label className="block text-[14px] font-semibold text-[var(--ios-label)] mb-2.5">
        Email адрес
      </label>
      <input
        type="email"
        required
        className={`w-full h-[56px] border-none outline-none px-4 text-[16px] text-[var(--ios-label)] bg-[var(--ios-bg)] rounded-2xl placeholder:text-[#A0A0A5] ${
          error ? "ring-2 ring-[var(--ios-destructive)]" : ""
        }`}
        placeholder="example@mail.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="email"
      />
      {error && (
        <p className="mt-1.5 text-xs text-[var(--ios-destructive)]">{error}</p>
      )}
    </div>
  );
}
