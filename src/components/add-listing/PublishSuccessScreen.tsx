"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";

interface PublishSuccessScreenProps {
  onComplete: () => void;
}

export function PublishSuccessScreen({ onComplete }: PublishSuccessScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const font = { fontFamily: "Manrope, system-ui, sans-serif" } as const;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-5">
      <div className="w-20 h-20 bg-[#34C759] rounded-full flex items-center justify-center mb-6">
        <Check className="w-10 h-10 text-white" strokeWidth={3} />
      </div>
      <h1 className="text-[28px] font-bold text-[#000000] text-center mb-2" style={font}>
        Объявление опубликовано
      </h1>
      <p className="text-[16px] text-[#8E8E93] text-center mb-8" style={font}>
        Ваше объявление успешно размещено и скоро появится в поиске
      </p>
      <button
        onClick={onComplete}
        className="w-full max-w-[300px] h-[52px] rounded-[14px] font-semibold bg-[#000000] text-white active:opacity-70 transition-opacity"
        style={font}
      >
        Готово
      </button>
      <p className="text-[13px] text-[#8E8E93] text-center mt-4" style={font}>
        Автоматический переход через 3 секунды
      </p>
    </div>
  );
}
