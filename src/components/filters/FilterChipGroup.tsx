"use client";

import { Button } from "@/components/ui/button";

export type ChipOption = string | { id: string; label: string };

interface FilterChipGroupProps {
  options: readonly ChipOption[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

function optId(opt: ChipOption): string {
  return typeof opt === "string" ? opt : opt.id;
}

function optLabel(opt: ChipOption): string {
  return typeof opt === "string" ? opt : opt.label;
}

export function FilterChipGroup({
  options,
  value,
  onChange,
}: FilterChipGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const id = optId(opt);
        const isSelected = value === id;
        return (
          <Button
            key={id}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(isSelected ? undefined : id)}
            className={`rounded-lg text-[13px] font-medium font-[family-name:var(--font-manrope)] transition-all ${
              isSelected
                ? "bg-[#111111] text-white border-[#111111] hover:bg-[#333] hover:text-white"
                : "bg-white text-[#111111] border-[#E5E5E7] hover:bg-[#F5F5F7]"
            }`}
          >
            {optLabel(opt)}
          </Button>
        );
      })}
    </div>
  );
}
