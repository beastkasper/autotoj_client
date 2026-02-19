"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[80vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-lg font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
            Фильтры
          </SheetTitle>
        </SheetHeader>

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
      </SheetContent>
    </Sheet>
  );
}
