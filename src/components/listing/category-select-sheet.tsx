"use client";

import { Car, Bike, Truck, Wrench } from "lucide-react";
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
  {
    id: "parts" as const,
    label: "Запчасти",
    description: "Шины, диски, кузов, двигатель",
    Icon: Wrench,
    color: "#F57C00",
  },
];

export function CategorySelectSheet({ open, onSelect, onClose }: CategorySelectSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-[24px] p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="text-[20px] font-bold text-center font-[family-name:var(--font-manrope)]">
            Выберите категорию
          </SheetTitle>
          <p className="-mt-1 text-center text-[15px] text-muted-foreground">
            Что вы хотите разместить?
          </p>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-2.5">
          {CATEGORIES.map(({ id, label, description, Icon, color }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className="group flex w-full items-center gap-3 rounded-2xl border border-transparent bg-secondary px-5 py-3 transition-all hover:border-border active:scale-[0.98] active:opacity-80"
            >
              <div
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-card"
              >
                <Icon className="size-6 text-foreground" strokeWidth={1.5} style={{ color }} />
              </div>
              <div className="text-left flex-1">
                <p className="text-[16px] font-medium text-foreground">{label}</p>
                <p className="text-[13px] text-muted-foreground">{description}</p>
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
