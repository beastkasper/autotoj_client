"use client";

import { Button } from "@/components/ui/button";

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: "desktop" | "mobile";
}

export function FilterChip({ label, isActive, onClick, variant = "desktop" }: FilterChipProps) {
  const isDesktop = variant === "desktop";
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`${isDesktop ? "h-10 rounded-xl" : "shrink-0 h-9 rounded-full"} text-${isDesktop ? "[15px]" : "[14px]"} font-medium font-[family-name:var(--font-manrope)] ${
        isActive
          ? isDesktop
            ? "bg-white text-[#111111] border-[#111111] border-2 hover:bg-[#F5F5F7]"
            : "bg-white text-[#111111] border-[#111111] border-2"
          : isDesktop
            ? "bg-[#F5F5F7] text-[#111111] hover:bg-[#EAEAEA] border-transparent"
            : "bg-white border-[#E5E5E7] text-[#111111]"
      }`}
    >
      {label}
    </Button>
  );
}
