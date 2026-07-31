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
  /** Деструктивное действие — подтверждение красным (§8.3) */
  destructive?: boolean;
}

/**
 * Центрированная модалка (DESIGN.md §8.3): r20, тело p24 24 16,
 * заголовок 17/600, текст 15/400 muted; кнопки h48, «Отмена» — синяя ссылка.
 */
export function ConfirmModal({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  open = true,
  destructive = false,
}: ConfirmModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onCancel();
      }}
    >
      <DialogContent className="max-w-[320px] rounded-[20px] border-none bg-card p-0 shadow-[var(--shadow-modal)] [&>button]:hidden">
        <div className="px-6 pb-4 pt-6 text-center">
          <DialogHeader className="items-center">
            <DialogTitle className="mb-2 text-[17px] font-semibold text-foreground">
              {title}
            </DialogTitle>
            <DialogDescription className="text-[15px] text-muted-foreground">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex border-t border-border">
          <button
            onClick={onCancel}
            className="h-12 flex-1 border-r border-border text-[15px] font-medium text-link"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className={`h-12 flex-1 text-[15px] font-semibold ${
              destructive ? "text-destructive" : "text-foreground"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
