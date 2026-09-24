"use client";

import { ChevronLeft, X } from "lucide-react";

interface CommercialSubcategorySheetProps {
  onSelect: (subcategory: string) => void;
  onBack: () => void;
  onClose: () => void;
  hasUnsavedData?: boolean;
}

export function CommercialSubcategorySheet({
  onSelect,
  onBack,
  onClose,
}: CommercialSubcategorySheetProps) {
  const subcategories = [
    "Лёгкие коммерческие",
    "Грузовики",
    "Седельные тягачи",
    "Автобусы",
    "Прицепы",
    "Съёмные кузова",
    "Сельскохозяйственная",
    "Автопогрузчики",
    "Строительная",
    "Экскаваторы",
    "Бульдозеры",
    "Автокраны",
    "Коммунальная",
  ];

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b border-border bg-background"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="relative mx-auto flex h-14 w-full max-w-[720px] flex-row items-center justify-between px-4">
          <button
            type="button"
            onClick={onBack}
            className="relative z-10 -ml-2 flex size-10 items-center justify-center"
          >
            <ChevronLeft size={24} strokeWidth={1.5} className="text-foreground" />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-14 items-center justify-center">
            <span className="text-[17px] font-semibold text-foreground">Комтранс</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="relative z-10 -mr-2 flex size-10 items-center justify-center"
          >
            <X size={24} strokeWidth={1.5} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="mx-auto w-full max-w-[720px] flex-1 overflow-y-auto"
        style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="px-5 pt-6 pb-4">
          <span className="text-[15px] font-normal text-muted-foreground">Выберите тип транспорта</span>
        </div>

        <div className="flex flex-col gap-3 px-5 pb-6">
          {subcategories.map((subcategory) => (
            <button
              type="button"
              key={subcategory}
              onClick={() => onSelect(subcategory)}
              className="flex h-16 w-full flex-col justify-center rounded-[16px] bg-secondary px-5 text-left transition-transform active:scale-[0.98] active:opacity-80"
            >
              <span className="text-[16px] font-medium text-foreground">{subcategory}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
