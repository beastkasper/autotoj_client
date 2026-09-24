"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function CustomCheckbox({ checked, onChange, label, disabled = false }: CustomCheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={cn("flex w-full flex-row items-center gap-3 text-left", disabled && "opacity-50")}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-[6px] border-2",
          checked ? "border-foreground bg-foreground" : "border-border bg-card",
        )}
      >
        {checked && <Check size={12} strokeWidth={2.5} className="text-background" />}
      </span>
      <span className="flex-1 text-[16px] font-normal text-foreground">{label}</span>
    </button>
  );
}
