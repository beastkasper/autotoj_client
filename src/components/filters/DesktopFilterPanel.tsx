"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { FilterState } from "./FilterSheet";

interface DesktopFilterPanelProps {
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export function DesktopFilterPanel({ onClose, onApply }: DesktopFilterPanelProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[560px] max-h-[70vh] overflow-y-auto rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle
            className="text-xl font-bold text-[#111111]"
            style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
          >
            Фильтры
          </DialogTitle>
        </DialogHeader>

        {/* Placeholder content */}
        <p className="text-sm text-[#8E8E93] text-center py-16">
          Фильтры будут добавлены позже
        </p>

        {/* Actions */}
        <DialogFooter className="flex gap-3 sm:flex-row">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 h-11 rounded-xl text-[14px] font-medium"
          >
            Отмена
          </Button>
          <Button
            onClick={() => onApply({})}
            className="flex-1 h-11 rounded-xl bg-[#111111] text-white hover:bg-[#111111]/90 text-[14px] font-medium"
          >
            Применить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
