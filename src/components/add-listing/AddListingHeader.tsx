"use client";

import { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { ExitConfirmationDialog } from "@/components/add-listing/ExitConfirmationDialog";

interface AddListingHeaderProps {
  onBack: () => void;
  onClose: () => void;
  title?: string;
  currentStep?: number;
  totalSteps?: number;
}

export function AddListingHeader({
  onBack,
  onClose,
  title = "Объявление",
  currentStep,
  totalSteps = 21,
}: AddListingHeaderProps) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleCloseClick = () => {
    setShowExitConfirm(true);
  };

  const handleContinue = () => {
    setShowExitConfirm(false);
  };

  const handleExit = () => {
    setShowExitConfirm(false);
    onClose();
  };

  return (
    <>
      <div
        className="sticky top-0 z-30 border-b border-border bg-card"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="mx-auto flex h-14 w-full max-w-[720px] flex-row items-center justify-between px-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="flex size-10 shrink-0 items-center justify-center"
          >
            <ChevronLeft size={24} strokeWidth={1.5} className="text-foreground" />
          </button>

          {/* Title with Step Counter */}
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
            <span className="text-[17px] leading-[20px] font-semibold text-foreground">{title}</span>
            {!!currentStep && (
              <span className="text-[13px] leading-[16px] font-normal text-muted-foreground">
                Шаг {currentStep} из {totalSteps}
              </span>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleCloseClick}
            className="flex size-10 shrink-0 items-center justify-center"
          >
            <X size={24} strokeWidth={1.5} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <ExitConfirmationDialog isOpen={showExitConfirm} onContinue={handleContinue} onExit={handleExit} />
    </>
  );
}
