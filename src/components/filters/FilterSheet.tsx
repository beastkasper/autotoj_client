"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FilterState {
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  brand?: string;
  fuelType?: string;
}

interface FilterSheetProps {
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export function FilterSheet({ onClose, onApply }: FilterSheetProps) {
  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-lg font-bold text-[#111111]"
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
        <p className="text-sm text-[#8E8E93] text-center py-12">
          Фильтры будут добавлены позже
        </p>

        {/* Apply button */}
        <Button
          onClick={() => onApply({})}
          className="w-full h-12 rounded-2xl bg-[#111111] text-white hover:bg-[#111111]/90 text-[15px] font-semibold"
        >
          Применить
        </Button>
      </div>
    </div>
  );
}
