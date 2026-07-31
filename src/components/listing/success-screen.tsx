"use client";

import { Check } from "lucide-react";

interface SuccessScreenProps {
  onGoToListing: () => void;
  onGoHome: () => void;
}

export function SuccessScreen({ onGoToListing, onGoHome }: SuccessScreenProps) {
  return (
    // Экран успеха (DESIGN.md §11.3): круг 80×80 #34C759, заголовок 28/700
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-6 grid size-20 place-items-center rounded-full bg-success">
          <Check className="size-10 text-white" strokeWidth={2.5} />
        </div>

        <h1 className="mb-2 text-[28px] font-bold leading-8 text-foreground">
          Объявление опубликовано!
        </h1>

        <p className="mb-8 text-[16px] text-muted-foreground">
          Ваше объявление уже доступно для просмотра
        </p>

        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={onGoToListing}
            className="btn h-[52px] w-full rounded-[14px] bg-primary text-[16px] font-semibold text-primary-foreground"
          >
            Перейти к объявлению
          </button>
          <button
            type="button"
            onClick={onGoHome}
            className="btn h-[52px] w-full rounded-[14px] bg-secondary text-[16px] font-semibold text-foreground"
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  );
}
