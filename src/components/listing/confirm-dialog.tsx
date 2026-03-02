"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Отмена",
  onConfirm,
  destructive = true,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[320px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-[17px] font-semibold text-center font-[family-name:var(--font-manrope)]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[15px] text-[#8E8E93] text-center font-[family-name:var(--font-manrope)]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 mt-2 sm:flex-col">
          <Button
            onClick={onConfirm}
            className={`w-full h-12 rounded-2xl text-[15px] font-semibold font-[family-name:var(--font-manrope)] ${
              destructive
                ? "bg-[#D32F2F] hover:bg-[#B71C1C] text-white"
                : "bg-black hover:bg-[#333] text-white"
            }`}
          >
            {confirmLabel}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full h-12 rounded-2xl text-[15px] font-medium font-[family-name:var(--font-manrope)] border-[#E5E5EA]"
          >
            {cancelLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
