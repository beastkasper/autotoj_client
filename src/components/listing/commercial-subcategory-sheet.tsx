"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { COMMERCIAL_SUBCATEGORIES } from "@/lib/data/listing-constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";

interface CommercialSubcategorySheetProps {
  open: boolean;
  onSelect: (subcategory: string) => void;
  onClose: () => void;
}

export function CommercialSubcategorySheet({
  open,
  onSelect,
  onClose,
}: CommercialSubcategorySheetProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-[20px] max-h-[70vh] flex flex-col p-0">
        <SheetHeader className="px-6 pt-5 pb-4 border-b border-[#E5E5EA]">
          <SheetTitle className="text-[20px] font-bold text-center font-[family-name:var(--font-manrope)]">
            Коммерческий транспорт
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="pb-[env(safe-area-inset-bottom,16px)]">
            {COMMERCIAL_SUBCATEGORIES.map((sub) => (
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
