"use client";

import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg" | "xl" | "splash";

/** §3 — логотип рисуется весом 900; «auto» брендовым красным, «TOJ» цветом текста. */
const SIZE_MAP: Record<LogoSize, string> = {
  sm: "text-[18px] tracking-[-0.5px]",
  md: "text-[22px] tracking-[-0.5px]",
  lg: "text-[30px] tracking-[-1px]",
  xl: "text-[32px] tracking-[-1px]",
  splash: "text-[52px] tracking-[-1px]",
};

interface AutoTojLogoProps {
  size?: LogoSize;
  className?: string;
}

export function AutoTojLogo({ size = "md", className }: AutoTojLogoProps) {
  return (
    <span className={cn("logo", SIZE_MAP[size], className)}>
      <span className="logo__auto">auto</span>
      <span className="logo__toj">TOJ</span>
    </span>
  );
}
