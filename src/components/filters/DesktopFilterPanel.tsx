"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FilterState } from "./FilterSheet";

interface DesktopFilterPanelProps {
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export function DesktopFilterPanel({ onClose, onApply }: DesktopFilterPanelProps) {
  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[560px] max-h-[70vh] overflow-y-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-bold text-[#111111]"
            style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
          >
            Фильтры
          </h2>
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#8E8E93] hover:bg-[#E5E5E7] transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Placeholder content */}
        <p className="text-sm text-[#8E8E93] text-center py-16">
          Фильтры будут добавлены позже
        </p>

        {/* Actions */}
        <div className="flex gap-3">
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
        </div>
      </div>
    </div>
  );
}
