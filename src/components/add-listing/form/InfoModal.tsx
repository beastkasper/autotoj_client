"use client";

import { X } from "lucide-react";
import { BottomSheet } from "@/components/layout/bottom-sheet";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function InfoModal({ isOpen, onClose, title, message }: InfoModalProps) {
  return (
    <BottomSheet open={isOpen} onClose={onClose} maxHeight="85%">
      <div
        className="min-h-0 overflow-y-auto"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)" }}
      >
        {/* Header */}
        <div className="flex flex-row items-center justify-between px-5 pt-1 pb-3">
          <span className="text-[20px] font-semibold text-foreground">{title}</span>
          <button type="button" onClick={onClose} className="flex size-8 items-center justify-center">
            <X size={24} strokeWidth={1.5} className="text-foreground" />
          </button>
        </div>

        {/* Content */}
        <p className="whitespace-pre-line px-5 pb-2 text-[15px] leading-[22px] font-normal text-foreground">
          {message}
        </p>
      </div>
    </BottomSheet>
  );
}
