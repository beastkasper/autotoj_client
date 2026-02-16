"use client";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function EmailInput({ value, onChange, error }: EmailInputProps) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[var(--ios-secondary-label)] mb-2">
        Email адрес
      </label>
      <input
        type="email"
        required
        className={`w-full h-[48px] border-none outline-none px-4 text-sm text-[var(--ios-label)] bg-[var(--ios-bg)] rounded-xl placeholder:text-gray-300 ${
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
