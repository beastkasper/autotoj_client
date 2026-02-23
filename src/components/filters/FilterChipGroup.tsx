"use client";

import { Button } from "@/components/ui/button";

interface FilterChipGroupProps {
  options: readonly string[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export function FilterChipGroup({
  options,
  value,
  onChange,
}: FilterChipGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(value === option ? undefined : option)}
          className={`rounded-lg text-[13px] font-medium font-[family-name:var(--font-manrope)] transition-all ${
            value === option
              ? "bg-[#111111] text-white border-[#111111] hover:bg-[#333] hover:text-white"
              : "bg-white text-[#111111] border-[#E5E5E7] hover:bg-[#F5F5F7]"
          }`}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
