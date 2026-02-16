"use client";

import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

const sizeMap: Record<LogoSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
};

interface AutoTojLogoProps {
  size?: LogoSize;
  className?: string;
}

export function AutoTojLogo({ size = "md", className }: AutoTojLogoProps) {
  return (
    <span
      className={cn(
        "font-extrabold tracking-tight text-[#111111] select-none",
        sizeMap[size],
        className
      )}
    >
      auto<span className="text-[#E53935]">TOJ</span>
    </span>
  );
}
