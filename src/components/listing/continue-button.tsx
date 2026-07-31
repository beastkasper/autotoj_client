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
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-[#EDEDED] bg-card dark:border-border">
      <div className="max-w-[720px] mx-auto px-4 pb-[env(safe-area-inset-bottom,16px)] pt-3">
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            // §11.3 — кнопка шага h52 r12; кнопка публикации r14
            "btn w-full h-[52px] text-[16px] font-semibold",
            variant === "publish" ? "rounded-[14px]" : "rounded-xl",
            disabled
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground"
          )}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
