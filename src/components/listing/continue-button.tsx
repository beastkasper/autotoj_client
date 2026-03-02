"use client";

import { cn } from "@/lib/utils";

interface ContinueButtonProps {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "publish";
}

export function ContinueButton({
  label = "Продолжить",
  onClick,
  disabled = false,
  variant = "primary",
}: ContinueButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t border-[#F2F2F7]">
      <div className="max-w-[720px] mx-auto px-4 pb-[env(safe-area-inset-bottom,16px)] pt-3">
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "w-full h-[48px] rounded-xl text-[15px] font-semibold font-[family-name:var(--font-manrope)] transition-all",
            "hover:shadow-md active:scale-[0.99]",
            variant === "publish"
              ? disabled
                ? "bg-[#E5E5E5] text-[#9E9E9E] cursor-not-allowed"
                : "bg-[#D32F2F] text-white hover:bg-[#C62828]"
              : disabled
              ? "bg-[#E5E5E5] text-[#9E9E9E] cursor-not-allowed"
              : "bg-[#111111] text-white hover:bg-[#2C2C2E]"
          )}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
