"use client";

import { cn } from "@/lib/utils";

export type SegmentedOption = string | { id: string; label: string };

interface SegmentedControlProps {
  options: readonly SegmentedOption[] | SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function optId(opt: SegmentedOption): string {
  return typeof opt === "string" ? opt : opt.id;
}

function optLabel(opt: SegmentedOption): string {
  return typeof opt === "string" ? opt : opt.label;
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
        {options.map((opt) => {
          const id = optId(opt);
          const isSelected = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                "flex-1 h-10 rounded-[20px] text-[15px] font-medium font-[family-name:var(--font-manrope)] transition-all border",
                isSelected
                  ? "bg-black text-white border-black font-semibold"
                  : "bg-transparent text-black border-[#D1D1D6] active:bg-[#F2F2F7]"
              )}
            >
              {optLabel(opt)}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-1.5 text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
          {error}
        </p>
      )}
    </div>
  );
}
