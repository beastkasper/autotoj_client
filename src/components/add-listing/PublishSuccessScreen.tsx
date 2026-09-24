"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";

interface PublishSuccessScreenProps {
  onComplete: () => void;
}

export function PublishSuccessScreen({ onComplete }: PublishSuccessScreenProps) {
  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-[#FFFFFF] px-5">
      {/* Success Icon */}
      <div className="mb-6 flex size-20 items-center justify-center rounded-[40px] bg-[#34C759]">
        <Check color="#FFFFFF" size={40} strokeWidth={3} />
      </div>

      {/* Title */}
      <span className="mb-2 text-center text-[28px] font-bold text-[#000000]">Объявление опубликовано</span>

      {/* Description */}
      <span className="mb-8 text-center text-[16px] font-normal text-[#8E8E93]">
        Ваше объявление успешно размещено и скоро появится в поиске
      </span>

      {/* Manual Continue Button */}
      <button
        type="button"
        onClick={onComplete}
        className="flex h-[52px] w-[300px] max-w-full items-center justify-center rounded-[14px] bg-[#000000]"
      >
        <span className="text-[16px] font-semibold text-[#FFFFFF]">Готово</span>
      </button>

      {/* Auto-redirect hint */}
      <span className="mt-4 text-center text-[13px] font-normal text-[#8E8E93]">
        Автоматический переход через 3 секунды
      </span>
    </div>
  );
}
