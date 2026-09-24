"use client";

import { ChevronLeft, Car, Bike, Truck } from "lucide-react";
import { AutoTojLogo } from "@/components/brand/AutoTojLogo";

interface AddListingCategoryPageProps {
  onBack: () => void;
  onSelectCategory: (category: "cars" | "moto" | "commercial") => void;
}

const categoryCardClass =
  "flex h-16 w-full flex-row items-center gap-3 rounded-[16px] bg-secondary px-5 text-left transition-transform active:scale-[0.98] active:opacity-80";

export function AddListingCategoryPage({ onBack, onSelectCategory }: AddListingCategoryPageProps) {
  return (
    <div
      className="flex min-h-dvh flex-1 flex-col bg-background"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-30 border-b-[0.5px] border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-[720px] flex-row items-center justify-between px-4">
          <button
            type="button"
            onClick={onBack}
            className="flex size-10 shrink-0 items-center justify-center active:opacity-60"
          >
            <ChevronLeft size={24} strokeWidth={2} className="text-foreground" />
          </button>

          <div className="flex min-w-0 flex-1 flex-col items-center">
            <span className="text-[17px] font-semibold text-foreground">Добавить объявление</span>
          </div>

          {/* Spacer to balance the back button */}
          <div className="size-10 shrink-0" />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col overflow-y-auto">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center px-4 pt-8 pb-6">
          <AutoTojLogo size="xl" />
          <span className="mt-3 text-[15px] font-normal text-muted-foreground">Выберите категорию</span>
        </div>

        {/* Category Cards */}
        <div className="flex flex-col gap-3 px-5 pb-6">
          {/* Легковые */}
          <button type="button" onClick={() => onSelectCategory("cars")} className={categoryCardClass}>
            <span className="flex size-10 items-center justify-center rounded-[12px] bg-card">
              <Car size={24} strokeWidth={1.5} className="text-foreground" />
            </span>
            <span className="text-[16px] font-medium text-foreground">Легковые</span>
          </button>

          {/* Мото */}
          <button type="button" onClick={() => onSelectCategory("moto")} className={categoryCardClass}>
            <span className="flex size-10 items-center justify-center rounded-[12px] bg-card">
              <Bike size={24} strokeWidth={1.5} className="text-foreground" />
            </span>
            <span className="text-[16px] font-medium text-foreground">Мото</span>
          </button>

          {/* Комтранс */}
          <button type="button" onClick={() => onSelectCategory("commercial")} className={categoryCardClass}>
            <span className="flex size-10 items-center justify-center rounded-[12px] bg-card">
              <Truck size={24} strokeWidth={1.5} className="text-foreground" />
            </span>
            <span className="text-[16px] font-medium text-foreground">Комтранс</span>
          </button>
        </div>
      </div>
    </div>
  );
}
