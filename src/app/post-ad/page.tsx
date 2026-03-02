"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useListingForm } from "@/hooks/useListingForm";
import { isCarStepOptional } from "@/lib/validations/listing";
import type { ListingCategory } from "@/lib/types/listing";

// Shared components
import { StepHeader } from "@/components/listing/step-header";
import { ContinueButton } from "@/components/listing/continue-button";
import { ConfirmDialog } from "@/components/listing/confirm-dialog";
import { SuccessScreen } from "@/components/listing/success-screen";
import { CategorySelectSheet } from "@/components/listing/category-select-sheet";
import { MotoSubcategorySheet } from "@/components/listing/moto-subcategory-sheet";
import { CommercialSubcategorySheet } from "@/components/listing/commercial-subcategory-sheet";

// Car steps
import { StepStatus } from "@/components/listing/car-steps/step-status";
import { StepVin } from "@/components/listing/car-steps/step-vin";
import { StepBrand } from "@/components/listing/car-steps/step-brand";
import { StepModel } from "@/components/listing/car-steps/step-model";
import { StepYear } from "@/components/listing/car-steps/step-year";
import { StepGeneration } from "@/components/listing/car-steps/step-generation";
import { StepBodyType } from "@/components/listing/car-steps/step-body-type";
import { StepEngine } from "@/components/listing/car-steps/step-engine";
import { StepDrive } from "@/components/listing/car-steps/step-drive";
import { StepModification } from "@/components/listing/car-steps/step-modification";
import { StepColor } from "@/components/listing/car-steps/step-color";
import { StepMedia } from "@/components/listing/car-steps/step-media";
import { StepEquipment } from "@/components/listing/car-steps/step-equipment";
import { StepHistory } from "@/components/listing/car-steps/step-history";
import { StepDescription } from "@/components/listing/car-steps/step-description";
import { StepPrice } from "@/components/listing/car-steps/step-price";
import { StepContacts } from "@/components/listing/car-steps/step-contacts";
import { StepPreview } from "@/components/listing/car-steps/step-preview";

// Accordion forms
import { MotoForm } from "@/components/listing/moto-form";
import { CommercialForm } from "@/components/listing/commercial-form";



export default function PostAdPage() {
  const router = useRouter();
  const form = useListingForm();

  const [showCategorySheet, setShowCategorySheet] = useState(true);
  const [showMotoSub, setShowMotoSub] = useState(false);
  const [showCommercialSub, setShowCommercialSub] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // ── Category selection ──
  const handleCategorySelect = useCallback(
    (cat: ListingCategory) => {
      form.setCategory(cat);
      setShowCategorySheet(false);
      if (cat === "moto") setShowMotoSub(true);
      else if (cat === "commercial") setShowCommercialSub(true);
    },
    [form]
  );

  const handleMotoSubSelect = useCallback(
    (sub: string) => {
      form.setSubcategory(sub);
      setShowMotoSub(false);
    },
    [form]
  );

  const handleCommercialSubSelect = useCallback(
    (sub: string) => {
      form.setSubcategory(sub);
      setShowCommercialSub(false);
    },
    [form]
  );

  // ── Close / Exit ──
  const handleClose = useCallback(() => {
    if (form.hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      router.push("/");
    }
  }, [form.hasUnsavedChanges, router]);

  const handleConfirmExit = useCallback(() => {
    setShowExitDialog(false);
    form.resetAll();
    router.push("/");
  }, [form, router]);

  // ── Reset ──
  const handleReset = useCallback(() => {
    setShowResetDialog(true);
  }, []);

  const handleConfirmReset = useCallback(() => {
    setShowResetDialog(false);
    form.resetForm();
  }, [form]);

  // ── Car step continue ──
  const handleCarContinue = useCallback(() => {
    form.validateAndGoNext();
  }, [form]);

  const handleCarSkip = useCallback(() => {
    form.skipStep();
  }, [form]);

  // ── Publish ──
  const handlePublish = useCallback(() => {
    if (form.category === "moto") {
      if (!form.validateMoto()) return;
    } else if (form.category === "commercial") {
      if (!form.validateCommercial()) return;
    }
    form.publish();
  }, [form]);

  // ── Success ──
  if (form.isPublished) {
    return (
      <SuccessScreen
        onGoToListing={() => router.push("/")}
        onGoHome={() => {
          form.resetAll();
          router.push("/");
        }}
      />
    );
  }

  // ── No category yet ──
  if (!form.category || showCategorySheet) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-[#F5F5F7]">
          <div className="text-center px-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#111111] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <h1 className="text-[24px] font-bold font-[family-name:var(--font-manrope)] mb-2 text-[#1C1C1E]">
              Добавить объявление
            </h1>
            <p className="text-[15px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              Выберите категорию транспорта
            </p>
          </div>
        </div>
        <CategorySelectSheet
          open={showCategorySheet}
          onSelect={handleCategorySelect}
          onClose={() => router.push("/")}
        />
      </>
    );
  }

  // ── Subcategory sheets ──
  if (showMotoSub) {
    return (
      <MotoSubcategorySheet
        open={showMotoSub}
        onSelect={handleMotoSubSelect}
        onClose={() => {
          setShowMotoSub(false);
          setShowCategorySheet(true);
          form.setCategory(null);
        }}
      />
    );
  }

  if (showCommercialSub) {
    return (
      <CommercialSubcategorySheet
        open={showCommercialSub}
        onSelect={handleCommercialSubSelect}
        onClose={() => {
          setShowCommercialSub(false);
          setShowCategorySheet(true);
          form.setCategory(null);
        }}
      />
    );
  }

  // ── Car wizard ──
  if (form.category === "cars") {
    const isOptional = isCarStepOptional(form.currentStep);
    const isPreview = form.currentStep === 18;

    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
        <StepHeader
          title={isPreview ? "Предпросмотр" : "Добавить объявление"}
          currentStep={form.currentStep}
          totalSteps={form.totalSteps}
          onBack={form.currentStep > 1 ? form.goBack : undefined}
          onClose={handleClose}
          rightAction={
            isOptional && !isPreview ? (
              <button
                type="button"
                onClick={handleCarSkip}
                className="text-[14px] font-medium text-[#8E8E93] hover:text-[#6E6E73] font-[family-name:var(--font-manrope)] transition-colors"
              >
                Пропустить
              </button>
            ) : undefined
          }
        />

        <div className="flex-1 overflow-y-auto pb-24">
          <div className="max-w-[720px] mx-auto">
            {form.currentStep === 1 && <StepStatus form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 2 && <StepVin form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 3 && <StepBrand form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 4 && <StepModel form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 5 && <StepYear form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 6 && <StepGeneration form={form.carForm} onUpdate={form.updateCarField} />}
            {form.currentStep === 7 && <StepBodyType form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 8 && <StepEngine form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 9 && <StepDrive form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 10 && <StepModification form={form.carForm} onUpdate={form.updateCarField} />}
            {form.currentStep === 11 && <StepColor form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 12 && <StepMedia form={form.carForm} onUpdate={form.updateCarField} />}
            {form.currentStep === 13 && <StepEquipment form={form.carForm} onUpdate={form.updateCarField} />}
            {form.currentStep === 14 && <StepHistory form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 15 && <StepDescription form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 16 && <StepPrice form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 17 && <StepContacts form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 18 && <StepPreview form={form.carForm} />}
          </div>
        </div>

        <ContinueButton
          label={isPreview ? "Опубликовать объявление" : "Продолжить"}
          onClick={isPreview ? () => form.publish() : handleCarContinue}
          variant={isPreview ? "publish" : "primary"}
        />

        <ConfirmDialog
          open={showExitDialog}
          onOpenChange={setShowExitDialog}
          title="Выйти без сохранения?"
          description="Все введённые данные будут потеряны"
          confirmLabel="Выйти"
          onConfirm={handleConfirmExit}
        />
      </div>
    );
  }

  // ── Moto accordion ──
  if (form.category === "moto") {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
        <StepHeader
          title={form.subcategory || "Мото"}
          onBack={() => {
            if (form.hasUnsavedChanges) {
              setShowExitDialog(true);
            } else {
              setShowMotoSub(true);
              form.resetForm();
            }
          }}
          onClose={handleClose}
          rightAction={
            <button
              type="button"
              onClick={handleReset}
              className="text-[15px] font-medium text-[#D32F2F] font-[family-name:var(--font-manrope)]"
            >
              Сброс
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto pb-24">
          <MotoForm
            form={form.motoForm}
            errors={form.errors}
            onUpdate={form.updateMotoField}
          />
        </div>

        <ContinueButton
          label="Далее"
          onClick={handlePublish}
        />

        <ConfirmDialog
          open={showExitDialog}
          onOpenChange={setShowExitDialog}
          title="Выйти без сохранения?"
          description="Все введённые данные будут потеряны"
          confirmLabel="Выйти"
          onConfirm={handleConfirmExit}
        />
        <ConfirmDialog
          open={showResetDialog}
          onOpenChange={setShowResetDialog}
          title="Сбросить все данные?"
          description="Это действие нельзя отменить"
          confirmLabel="Сбросить"
          onConfirm={handleConfirmReset}
        />
      </div>
    );
  }

  // ── Commercial accordion ──
  if (form.category === "commercial") {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
        <StepHeader
          title={form.subcategory || "Комтранс"}
          onBack={() => {
            if (form.hasUnsavedChanges) {
              setShowExitDialog(true);
            } else {
              setShowCommercialSub(true);
              form.resetForm();
            }
          }}
          onClose={handleClose}
          rightAction={
            <button
              type="button"
              onClick={handleReset}
              className="text-[15px] font-medium text-[#D32F2F] font-[family-name:var(--font-manrope)]"
            >
              Сброс
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto pb-24">
          <CommercialForm
            form={form.commercialForm}
            errors={form.errors}
            onUpdate={form.updateCommercialField}
          />
        </div>

        <ContinueButton
          label="Далее"
          onClick={handlePublish}
        />

        <ConfirmDialog
          open={showExitDialog}
          onOpenChange={setShowExitDialog}
          title="Выйти без сохранения?"
          description="Все введённые данные будут потеряны"
          confirmLabel="Выйти"
          onConfirm={handleConfirmExit}
        />
        <ConfirmDialog
          open={showResetDialog}
          onOpenChange={setShowResetDialog}
          title="Сбросить все данные?"
          description="Это действие нельзя отменить"
          confirmLabel="Сбросить"
          onConfirm={handleConfirmReset}
        />
      </div>
    );
  }

  return null;
}
