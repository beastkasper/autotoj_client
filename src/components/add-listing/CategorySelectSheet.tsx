"use client";

import { useState } from "react";
import { Car, Bike, Truck, ChevronLeft, X } from "lucide-react";
import { AutoTojLogo } from "@/components/brand/AutoTojLogo";
import { ExitConfirmationModal } from "@/components/add-listing/modals/ExitConfirmationModal";
import { BottomSheet } from "@/components/layout/bottom-sheet";

interface CategorySelectSheetProps {
  onSelect: (category: "cars" | "moto" | "commercial") => void;
  onClose: () => void;
  hasUnsavedData?: boolean;
}

const categoryButtonClass =
  "flex h-16 w-full flex-row items-center gap-3 rounded-[16px] bg-secondary px-4 text-left transition-transform active:scale-[0.98] active:opacity-80";

export function CategorySelectSheet({ onSelect, onClose, hasUnsavedData = false }: CategorySelectSheetProps) {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  // Шторка показана, пока компонент смонтирован; скрывается только на время диалога подтверждения,
  // если пользователь закрыл её жестом/тапом по фону.
  const [sheetVisible, setSheetVisible] = useState(true);

  // Кнопки «назад»/«закрыть» в шапке: шторка остаётся на месте под диалогом.
  const handleCloseClick = () => {
    if (hasUnsavedData) {
      setShowExitConfirmation(true);
    } else {
      onClose();
    }
  };

  // Свайп вниз / тап по фону / аппаратная «назад»: библиотека уже скрыла шторку,
  // поэтому при отмене выхода её нужно показать заново.
  const handleSheetDismiss = () => {
    if (hasUnsavedData) {
      setSheetVisible(false);
      setShowExitConfirmation(true);
    } else {
      onClose();
    }
  };

  const handleStay = () => {
    setShowExitConfirmation(false);
    setSheetVisible(true);
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    onClose();
  };

  return (
    <>
      <BottomSheet open={sheetVisible} onClose={handleSheetDismiss} maxHeight="85%">
        <div
          className="min-h-0 flex-1 overflow-y-auto"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 32px)" }}
        >
          {/* Header (sticky) */}
          <div className="sticky top-0 z-10 flex h-14 flex-row items-center justify-between border-b border-border bg-card px-4">
            <button type="button" onClick={handleCloseClick} className="relative z-10 -ml-2 p-2">
              <ChevronLeft size={24} strokeWidth={2} className="text-foreground" />
            </button>

            <div className="pointer-events-none absolute inset-x-0 flex items-center justify-center">
              <span className="text-[17px] font-semibold text-foreground">Разместить объявление</span>
            </div>

            <button type="button" onClick={handleCloseClick} className="relative z-10 -mr-2 p-2">
              <X size={24} strokeWidth={2} className="text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center justify-center px-4 pt-8 pb-6">
            <AutoTojLogo size="xl" />
            <span className="mt-3 text-[15px] font-normal text-muted-foreground">Выберите категорию</span>
          </div>

          <div className="flex flex-col gap-3 px-5 pb-6">
            <button type="button" onClick={() => onSelect("cars")} className={categoryButtonClass}>
              <span className="flex size-10 items-center justify-center rounded-[12px] bg-card">
                <Car size={24} strokeWidth={1.5} className="text-foreground" />
              </span>
              <span className="text-[16px] font-medium text-foreground">Легковые</span>
            </button>

            <button type="button" onClick={() => onSelect("moto")} className={categoryButtonClass}>
              <span className="flex size-10 items-center justify-center rounded-[12px] bg-card">
                <Bike size={24} strokeWidth={1.5} className="text-foreground" />
              </span>
              <span className="text-[16px] font-medium text-foreground">Мото</span>
            </button>

            <button type="button" onClick={() => onSelect("commercial")} className={categoryButtonClass}>
              <span className="flex size-10 items-center justify-center rounded-[12px] bg-card">
                <Truck size={24} strokeWidth={1.5} className="text-foreground" />
              </span>
              <span className="text-[16px] font-medium text-foreground">Комтранс</span>
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Exit Confirmation Modal */}
      <ExitConfirmationModal isOpen={showExitConfirmation} onStay={handleStay} onExit={handleConfirmExit} />
    </>
  );
}
