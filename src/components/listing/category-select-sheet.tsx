"use client";

import { Car, Bike, Truck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { ListingCategory } from "@/lib/types/listing";

interface CategorySelectSheetProps {
  open: boolean;
  onSelect: (category: ListingCategory) => void;
  onClose: () => void;
}

const CATEGORIES = [
  {
    id: "cars" as const,
    label: "Легковые",
    description: "Седаны, кроссоверы, внедорожники",
    Icon: Car,
    color: "#111111",
  },
  {
    id: "moto" as const,
    label: "Мото",
    description: "Мотоциклы, ATV, скутеры",
    Icon: Bike,
    color: "#E53935",
  },
  {
    id: "commercial" as const,
    label: "Комтранс",
    description: "Грузовики, автобусы, спецтехника",
    Icon: Truck,
    color: "#1565C0",
  },
];

export function CategorySelectSheet({ open, onSelect, onClose }: CategorySelectSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-[20px] p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="text-[20px] font-bold text-center font-[family-name:var(--font-manrope)]">
            Выберите категорию
          </SheetTitle>
          <p className="text-[14px] text-[#8E8E93] text-center font-[family-name:var(--font-manrope)] -mt-1">
            Что вы хотите разместить?
          </p>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-2.5">
          {CATEGORIES.map(({ id, label, description, Icon, color }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className="flex items-center gap-4 w-full p-4 rounded-2xl bg-[#F7F7F7] border border-transparent hover:border-[#D1D1D6] hover:shadow-sm transition-all active:scale-[0.99] group"
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl transition-transform group-hover:scale-105"
                style={{ backgroundColor: color }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="text-[16px] font-semibold text-[#1C1C1E] font-[family-name:var(--font-manrope)]">
                  {label}
                </p>
                <p className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                  {description}
                </p>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#C7C7CC] group-hover:text-[#8E8E93] transition-colors shrink-0">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
