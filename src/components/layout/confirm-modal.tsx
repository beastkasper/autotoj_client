"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  open?: boolean;
}

export function ConfirmModal({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  open = true,
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <DialogContent className="rounded-[20px] max-w-sm p-0 border-none shadow-lg [&>button]:hidden">
        <div className="p-6 text-center">
          <DialogHeader className="items-center">
            <DialogTitle className="text-[17px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
              {title}
            </DialogTitle>
            <DialogDescription className="text-[15px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="border-t border-[#E5E5E7] flex">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 text-[15px] font-medium text-[#8E8E93] border-r border-[#E5E5E7] font-[family-name:var(--font-manrope)]"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 text-[15px] font-semibold text-[#E53935] font-[family-name:var(--font-manrope)]"
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
