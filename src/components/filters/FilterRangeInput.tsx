"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterRangeInputProps {
  fromValue: number | undefined;
  toValue: number | undefined;
  onFromChange: (value: number | undefined) => void;
  onToChange: (value: number | undefined) => void;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  fromLabel?: string;
  toLabel?: string;
}

export function FilterRangeInput({
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  fromPlaceholder = "0",
  toPlaceholder = "∞",
  fromLabel = "От",
  toLabel = "До",
}: FilterRangeInputProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label className="text-[13px] text-[#8E8E93] mb-1.5 block font-[family-name:var(--font-manrope)]">
          {fromLabel}
        </Label>
        <Input
          type="number"
          placeholder={fromPlaceholder}
          value={fromValue ?? ""}
          onChange={(e) =>
            onFromChange(e.target.value ? Number(e.target.value) : undefined)
          }
          className="h-10 rounded-lg border-[#E5E5E7] bg-white text-[14px] text-[#111111] font-[family-name:var(--font-manrope)] focus-visible:ring-[#111111] focus-visible:border-[#111111]"
        />
      </div>
      <div>
        <Label className="text-[13px] text-[#8E8E93] mb-1.5 block font-[family-name:var(--font-manrope)]">
          {toLabel}
        </Label>
        <Input
          type="number"
          placeholder={toPlaceholder}
          value={toValue ?? ""}
          onChange={(e) =>
            onToChange(e.target.value ? Number(e.target.value) : undefined)
          }
          className="h-10 rounded-lg border-[#E5E5E7] bg-white text-[14px] text-[#111111] font-[family-name:var(--font-manrope)] focus-visible:ring-[#111111] focus-visible:border-[#111111]"
        />
      </div>
    </div>
  );
}
