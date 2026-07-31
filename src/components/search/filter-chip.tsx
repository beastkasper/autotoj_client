"use client";

import { Button } from "@/components/ui/button";

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: "desktop" | "mobile";
}

/** Круглый чип (§6.2): h36 r18 bg secondary; активный — чёрный с белым текстом. */
export function FilterChip({
  label,
  isActive,
  onClick,
  variant = "desktop",
}: FilterChipProps) {
  if (variant === "mobile") {
    return (
      <button
        type="button"
        aria-pressed={isActive}
        onClick={onClick}
        className="chip shrink-0"
      >
        {label}
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`h-10 rounded-xl text-[15px] font-medium ${
        isActive
          ? "border-2 border-[#111111] bg-white text-[#111111] hover:bg-[#F5F5F7]"
          : "border-transparent bg-[#F5F5F7] text-[#111111] hover:bg-[#EAEAEA]"
      }`}
    >
      {label}
    </Button>
  );
}
