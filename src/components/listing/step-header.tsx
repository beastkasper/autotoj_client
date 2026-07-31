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
        "sticky top-0 z-30 flex flex-col border-b border-[#EDEDED] bg-card pt-[env(safe-area-inset-top)] dark:border-border",
        className
      )}
    >
      {/* Progress bar */}
      {currentStep && totalSteps && (
        <div className="h-[3px] bg-secondary">
          <div
            className="h-full rounded-r-full bg-primary transition-all duration-500 ease-out"
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
            "icon-btn",
            !onBack && "invisible"
          )}
          aria-label="Назад"
        >
          <ChevronLeft className="size-5" strokeWidth={1.5} />
        </button>

        {/* Center: Title */}
        <div className="flex flex-col items-center">
          <span className="screen-title text-foreground">{title}</span>
          {currentStep && totalSteps && (
            <span className="text-[13px] text-muted-foreground">
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
            className="icon-btn text-muted-foreground"
            aria-label="Закрыть"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
