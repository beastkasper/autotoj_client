"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  cancelText = "Отменить",
  confirmText = "Выйти",
}: ConfirmationModalProps) {
  // onRequestClose → Esc
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex animate-[fade-in_0.2s_ease-out] items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[320px] overflow-hidden rounded-[20px] bg-card">
        {/* Content */}
        <div className="flex flex-col items-center px-6 pt-6 pb-4">
          <span className="mb-2 text-center text-[17px] font-semibold text-foreground">{title}</span>
          <span className="text-center text-[15px] font-normal text-muted-foreground">{message}</span>
        </div>

        {/* Cancel Button */}
        <div className="h-px bg-border" />
        <button type="button" onClick={onClose} className="flex h-12 w-full items-center justify-center">
          <span className="text-[15px] font-medium text-[#007AFF]">{cancelText}</span>
        </button>

        {/* Confirm Button */}
        <div className="h-px bg-border" />
        <button type="button" onClick={onConfirm} className="flex h-12 w-full items-center justify-center">
          <span className="text-[15px] font-semibold text-[#FF3B30]">{confirmText}</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}
