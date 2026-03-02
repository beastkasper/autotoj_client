"use client";

import { CheckCircle } from "lucide-react";

interface SuccessScreenProps {
  onGoToListing: () => void;
  onGoHome: () => void;
}

export function SuccessScreen({ onGoToListing, onGoHome }: SuccessScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center text-center max-w-sm">
        {/* Icon */}
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-[#34C759]" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1 className="text-[24px] font-bold text-[#1C1C1E] mb-2 font-[family-name:var(--font-manrope)]">
          Объявление опубликовано!
        </h1>

        {/* Description */}
        <p className="text-[15px] text-[#8E8E93] mb-10 font-[family-name:var(--font-manrope)]">
          Ваше объявление уже доступно для просмотра
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            type="button"
            onClick={onGoToListing}
            className="w-full h-[52px] rounded-3xl bg-black text-white text-[16px] font-semibold font-[family-name:var(--font-manrope)] transition-all active:scale-[0.98]"
          >
            Перейти к объявлению
          </button>
          <button
            type="button"
            onClick={onGoHome}
            className="w-full h-[52px] rounded-3xl bg-[#F2F2F7] text-black text-[16px] font-semibold font-[family-name:var(--font-manrope)] transition-all active:scale-[0.98]"
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  );
}
