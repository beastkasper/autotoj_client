"use client";

import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  options: readonly string[] | string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  error,
}: SegmentedControlProps) {
  return (
    <div>
      <div className="flex gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "flex-1 h-10 rounded-[20px] text-[15px] font-medium font-[family-name:var(--font-manrope)] transition-all border",
              value === opt
                ? "bg-black text-white border-black font-semibold"
                : "bg-transparent text-black border-[#D1D1D6] active:bg-[#F2F2F7]"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-1.5 text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
          {error}
        </p>
      )}
    </div>
  );
}
