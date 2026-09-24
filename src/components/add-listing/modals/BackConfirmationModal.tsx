"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

interface BackConfirmationModalProps {
  isOpen: boolean;
  onStay: () => void;
  onBack: () => void;
}

export function BackConfirmationModal({ isOpen, onStay, onBack }: BackConfirmationModalProps) {
  // onRequestClose → Esc
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onStay();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onStay]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex animate-[fade-in_0.2s_ease-out] items-center justify-center bg-black/40 px-5"
      onClick={onStay}
    >
      <div
        className="w-full max-w-[320px] overflow-hidden rounded-[16px] bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="flex flex-col items-center px-5 pt-6 pb-5">
          <span className="mb-2 text-center text-[17px] font-semibold text-foreground">
            Вы уверены, что хотите вернуться?
          </span>
          <span className="text-center text-[15px] font-normal text-muted-foreground">
            Введённые данные могут быть потеряны.
          </span>
        </div>

        {/* Divider */}
        <div className="h-[0.5px] bg-border" />

        {/* Buttons */}
        <div className="flex flex-row">
          <button type="button" onClick={onStay} className="flex flex-1 items-center justify-center py-3.5">
            <span className="text-[17px] font-semibold text-[#007AFF]">Остаться</span>
          </button>
          <div className="w-[0.5px] bg-border" />
          <button type="button" onClick={onBack} className="flex flex-1 items-center justify-center py-3.5">
            <span className="text-[17px] font-semibold text-[#D32F2F]">Вернуться</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
