"use client";

import { BottomSheet } from "@/components/layout/bottom-sheet";

interface ExitConfirmationDialogProps {
  isOpen: boolean;
  onContinue: () => void;
  onExit: () => void;
}

export function ExitConfirmationDialog({ isOpen, onContinue, onExit }: ExitConfirmationDialogProps) {
  return (
    <BottomSheet open={isOpen} onClose={onContinue} maxHeight="85%">
      <div style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)" }}>
        {/* Content */}
        <div className="flex flex-col px-5 pt-2 pb-2">
          {/* Title */}
          <span className="mb-2 text-center text-[20px] font-bold text-foreground">Закрыть объявление?</span>

          {/* Description */}
          <span className="mb-6 text-center text-[15px] font-normal text-muted-foreground">
            Если вы выйдете сейчас, введённые данные не сохранятся.
          </span>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            {/* Continue Button - Primary (Black) */}
            <button
              type="button"
              onClick={onContinue}
              className="flex h-[52px] w-full items-center justify-center rounded-[24px] bg-foreground"
            >
              <span className="text-[16px] font-semibold text-background">Продолжить редактирование</span>
            </button>

            {/* Exit Button - Secondary (Gray) */}
            <button
              type="button"
              onClick={onExit}
              className="flex h-[52px] w-full items-center justify-center rounded-[24px] bg-secondary"
            >
              <span className="text-[16px] font-semibold text-foreground">Выйти</span>
            </button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
