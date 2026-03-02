"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MOTO_SUBCATEGORIES } from "@/lib/data/listing-constants";
import { ChevronRight } from "lucide-react";

interface MotoSubcategorySheetProps {
  open: boolean;
  onSelect: (subcategory: string) => void;
  onClose: () => void;
}

export function MotoSubcategorySheet({ open, onSelect, onClose }: MotoSubcategorySheetProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-[20px] p-0">
        <SheetHeader className="px-6 pt-5 pb-4 border-b border-[#E5E5EA]">
          <SheetTitle className="text-[20px] font-bold text-center font-[family-name:var(--font-manrope)]">
            Мото
          </SheetTitle>
        </SheetHeader>
        <div className="pb-[env(safe-area-inset-bottom,16px)]">
          {MOTO_SUBCATEGORIES.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => onSelect(sub)}
              className="flex items-center justify-between w-full h-[52px] px-6 border-b border-[#E5E5EA] transition-colors active:bg-[#F2F2F7]"
            >
              <span className="text-[15px] font-[family-name:var(--font-manrope)]">{sub}</span>
              <ChevronRight className="w-4 h-4 text-[#C7C7CC]" />
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
