"use client";

import type { ReactNode } from "react";
import { StepHeader } from "@/components/listing/step-header";
import { ContinueButton } from "@/components/listing/continue-button";
import { ConfirmDialog } from "@/components/listing/confirm-dialog";

interface AccordionFormLayoutProps {
  title: string;
  onBack: () => void;
  onClose: () => void;
  onReset: () => void;
  onPublish: () => void;
  isPublishing: boolean;
  hasUnsavedChanges: boolean;
  children: ReactNode;
  showExitDialog: boolean;
  onExitDialogChange: (open: boolean) => void;
  onConfirmExit: () => void;
  showResetDialog: boolean;
  onResetDialogChange: (open: boolean) => void;
  onConfirmReset: () => void;
}

export function AccordionFormLayout({
  title,
  onBack,
  onClose,
  onReset,
  onPublish,
  isPublishing,
  children,
  showExitDialog,
  onExitDialogChange,
  onConfirmExit,
  showResetDialog,
  onResetDialogChange,
  onConfirmReset,
}: AccordionFormLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
      <StepHeader
        title={title}
        onBack={onBack}
        onClose={onClose}
        rightAction={
          <button
            type="button"
            onClick={onReset}
            className="text-[15px] font-medium text-[#D32F2F] font-[family-name:var(--font-manrope)]"
          >
            Сброс
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-24">{children}</div>

      <ContinueButton
        label={isPublishing ? "Публикация..." : "Далее"}
        onClick={onPublish}
        disabled={isPublishing}
      />

      <ConfirmDialog
        open={showExitDialog}
        onOpenChange={onExitDialogChange}
        title="Выйти без сохранения?"
        description="Все введённые данные будут потеряны"
        confirmLabel="Выйти"
        onConfirm={onConfirmExit}
      />
      <ConfirmDialog
        open={showResetDialog}
        onOpenChange={onResetDialogChange}
        title="Сбросить все данные?"
        description="Это действие нельзя отменить"
        confirmLabel="Сбросить"
        onConfirm={onConfirmReset}
      />
    </div>
  );
}
