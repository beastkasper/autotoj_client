"use client";

import { ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepHeaderProps {
  title: string;
  currentStep?: number;
  totalSteps?: number;
  onBack?: () => void;
  onClose: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function StepHeader({
  title,
  currentStep,
  totalSteps,
  onBack,
  onClose,
  rightAction,
  className,
}: StepHeaderProps) {
  const progress = currentStep && totalSteps ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div
      className={cn(
        "sticky top-0 z-30 flex flex-col bg-white/95 backdrop-blur-md border-b border-[#E5E5EA]",
        className
      )}
    >
      {/* Progress bar */}
      {currentStep && totalSteps && (
        <div className="h-[3px] bg-[#F2F2F7]">
          <div
            className="h-full bg-[#111111] transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-center justify-between h-14 px-4 max-w-[720px] mx-auto w-full">
        {/* Left: Back */}
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[#F2F2F7] transition-colors active:opacity-60",
            !onBack && "invisible"
          )}
          aria-label="Назад"
        >
          <ChevronLeft className="w-5 h-5 text-[#1C1C1E]" />
        </button>

        {/* Center: Title */}
        <div className="flex flex-col items-center">
          <span className="text-[15px] font-semibold text-[#1C1C1E] font-[family-name:var(--font-manrope)]">
            {title}
          </span>
          {currentStep && totalSteps && (
            <span className="text-[12px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              Шаг {currentStep} из {totalSteps}
            </span>
          )}
        </div>

        {/* Right: Close or custom action */}
        <div className="flex items-center gap-2">
          {rightAction}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[#F2F2F7] transition-colors active:opacity-60"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5 text-[#8E8E93]" />
          </button>
        </div>
      </div>
    </div>
  );
}
