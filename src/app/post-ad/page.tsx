"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useListingForm } from "@/hooks/useListingForm";
import { isCarStepOptional } from "@/lib/validations/listing";
import type { ListingCategory } from "@/lib/types/listing";

// Shared components
import { StepHeader } from "@/components/listing/step-header";
import { ContinueButton } from "@/components/listing/continue-button";
import { ConfirmDialog } from "@/components/listing/confirm-dialog";
import { AccordionFormLayout } from "@/components/listing/accordion-form-layout";
import { SuccessScreen } from "@/components/listing/success-screen";
import { CategorySelectSheet } from "@/components/listing/category-select-sheet";
import { MotoSubcategorySheet } from "@/components/listing/moto-subcategory-sheet";
import { CommercialSubcategorySheet } from "@/components/listing/commercial-subcategory-sheet";

// Car steps (21-step flow matching mobile wizard)
import { StepBrand } from "@/components/listing/car-steps/step-brand";
import { StepModel } from "@/components/listing/car-steps/step-model";
import { StepYear } from "@/components/listing/car-steps/step-year";
import { StepGeneration } from "@/components/listing/car-steps/step-generation";
import { StepBodyType } from "@/components/listing/car-steps/step-body-type";
import { StepEngine } from "@/components/listing/car-steps/step-engine";
import { StepDrive } from "@/components/listing/car-steps/step-drive";
import { StepTransmission } from "@/components/listing/car-steps/step-transmission";
import { StepEngineVolume } from "@/components/listing/car-steps/step-engine-volume";
import { StepPower } from "@/components/listing/car-steps/step-power";
import { StepColor } from "@/components/listing/car-steps/step-color";
import { StepCondition } from "@/components/listing/car-steps/step-condition";
import { StepSteering } from "@/components/listing/car-steps/step-steering";
import { StepMedia } from "@/components/listing/car-steps/step-media";
import { StepEquipment } from "@/components/listing/car-steps/step-equipment";
import { StepHistory } from "@/components/listing/car-steps/step-history";
import { StepVin } from "@/components/listing/car-steps/step-vin";
import { StepDescription } from "@/components/listing/car-steps/step-description";
import { StepPrice } from "@/components/listing/car-steps/step-price";
import { StepContacts } from "@/components/listing/car-steps/step-contacts";
import { StepPreview } from "@/components/listing/car-steps/step-preview";

// Accordion forms
import { MotoForm } from "@/components/listing/moto-form";
import { CommercialForm } from "@/components/listing/commercial-form";

// Parts
import { PartsListingPlaceholder } from "@/components/add-listing/PartsListingPlaceholder";
import { TiresListingForm } from "@/components/add-listing/tires/TiresListingForm";
import { WheelsListingForm } from "@/components/add-listing/wheels/WheelsListingForm";
import { SteeringWheelListingForm } from "@/components/add-listing/steering-wheel/SteeringWheelListingForm";
import { OpticsListingForm } from "@/components/add-listing/optics/OpticsListingForm";
import { SuspensionListingForm } from "@/components/add-listing/suspension/SuspensionListingForm";
import { BodyPartsListingForm } from "@/components/add-listing/body-parts/BodyPartsListingForm";
import { EngineListingForm } from "@/components/add-listing/engine/EngineListingForm";
import { TransmissionListingForm } from "@/components/add-listing/transmission/TransmissionListingForm";
import { ConsumablesListingForm } from "@/components/add-listing/consumables/ConsumablesListingForm";
import type { PartsCategory } from "@/lib/types/parts-listing";
import type { PartsFormData } from "@/lib/types/parts-listing";
import {
  useCreatePartMutation,
  useUploadPartPhotosMutation,
} from "@/lib/features/parts/partsApi";



export default function PostAdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useListingForm();

  const preselectedCategory = searchParams.get("category") as ListingCategory | null;
  const [showCategorySheet, setShowCategorySheet] = useState(!preselectedCategory);
  const [showMotoSub, setShowMotoSub] = useState(false);
  const [showCommercialSub, setShowCommercialSub] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Parts state
  const [showPartsCategoryPicker, setShowPartsCategoryPicker] = useState(preselectedCategory === "parts");
  const [selectedPartsCategory, setSelectedPartsCategory] = useState<PartsCategory | null>(null);
  const [partsPublishing, setPartsPublishing] = useState(false);
  const [partsError, setPartsError] = useState<string | null>(null);
  const [createPart] = useCreatePartMutation();
  const [uploadPartPhotos] = useUploadPartPhotosMutation();

  // Handle preselected category from URL params
  useEffect(() => {
    if (preselectedCategory && !form.category) {
      form.setCategory(preselectedCategory);
      setShowCategorySheet(false);
      if (preselectedCategory === "parts") setShowPartsCategoryPicker(true);
      else if (preselectedCategory === "moto") setShowMotoSub(true);
      else if (preselectedCategory === "commercial") setShowCommercialSub(true);
    }
  }, [preselectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Category selection ──
  const handleCategorySelect = useCallback(
    (cat: ListingCategory) => {
      form.setCategory(cat);
      setShowCategorySheet(false);
      if (cat === "moto") setShowMotoSub(true);
      else if (cat === "commercial") setShowCommercialSub(true);
      else if (cat === "parts") setShowPartsCategoryPicker(true);
    },
    [form]
  );

  // ── Parts category selection ──
  const handlePartsCategorySelect = useCallback((cat: PartsCategory) => {
    setSelectedPartsCategory(cat);
    setShowPartsCategoryPicker(false);
  }, []);

  const handlePartsBack = useCallback(() => {
    if (selectedPartsCategory) {
      setSelectedPartsCategory(null);
      setShowPartsCategoryPicker(true);
    } else {
      setShowPartsCategoryPicker(false);
      setShowCategorySheet(true);
      form.setCategory(null);
    }
  }, [selectedPartsCategory, form]);

  const handlePartsPublish = useCallback(async (data: PartsFormData) => {
    setPartsPublishing(true);
    setPartsError(null);
    try {
      const body: Record<string, unknown> = {
        part_type: selectedPartsCategory,
        condition: data.fields.condition || "Новая",
        price: Number(data.price),
        description: data.description || undefined,
        contact_name: data.name || undefined,
        contact_phone: data.phone ? `+992${data.phone}` : undefined,
        city: data.city || undefined,
        fields: data.fields,
        toggles: data.toggles,
      };
      const result = await createPart(body).unwrap();
      if (data.photos.length > 0) {
        await uploadPartPhotos({ id: result.id, photos: data.photos }).unwrap();
      }
      form.resetAll();
      setSelectedPartsCategory(null);
      router.push("/");
    } catch {
      setPartsError("Не удалось опубликовать. Попробуйте ещё раз.");
    } finally {
      setPartsPublishing(false);
    }
  }, [selectedPartsCategory, createPart, uploadPartPhotos, form, router]);

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
  const handlePublish = useCallback(async () => {
    if (form.isPublishing) return;
    if (form.category === "moto") {
      if (!form.validateMoto()) return;
    } else if (form.category === "commercial") {
      if (!form.validateCommercial()) return;
    }
    await form.publish();
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

  // ── Parts category picker ──
  if (form.category === "parts" && showPartsCategoryPicker) {
    return (
      <PartsListingPlaceholder
        onSelect={handlePartsCategorySelect}
        onBack={() => {
          setShowPartsCategoryPicker(false);
          setShowCategorySheet(true);
          form.setCategory(null);
        }}
        onClose={() => router.push("/")}
      />
    );
  }

  // ── Parts forms ──
  if (form.category === "parts" && selectedPartsCategory) {
    const partsProps = {
      onBack: handlePartsBack,
      onClose: () => router.push("/"),
      onPublish: handlePartsPublish,
    };

    const partsForm = (() => {
      switch (selectedPartsCategory) {
        case "tires":
          return <TiresListingForm {...partsProps} />;
        case "wheels":
          return <WheelsListingForm {...partsProps} />;
        case "steering-wheel":
          return <SteeringWheelListingForm {...partsProps} />;
        case "optics":
          return <OpticsListingForm {...partsProps} />;
        case "suspension":
          return <SuspensionListingForm {...partsProps} />;
        case "body-parts":
          return <BodyPartsListingForm {...partsProps} />;
        case "engine":
          return <EngineListingForm {...partsProps} />;
        case "transmission":
          return <TransmissionListingForm {...partsProps} />;
        case "consumables":
          return <ConsumablesListingForm {...partsProps} />;
        default:
          return null;
      }
    })();

    return (
      <>
        {partsError && (
          <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-2">
            <p className="text-[13px] text-[#D32F2F] text-center bg-red-50 rounded-xl py-2 font-[family-name:var(--font-manrope)]">
              {partsError}
            </p>
          </div>
        )}
        {partsForm}
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

  // ── Car wizard (21 steps, ordering matches mobile) ──
  if (form.category === "cars") {
    const isOptional = isCarStepOptional(form.currentStep);
    const isPreview = form.currentStep === 21;

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
            {form.currentStep === 1 && <StepBrand form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 2 && <StepModel form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 3 && <StepYear form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 4 && <StepGeneration form={form.carForm} onUpdate={form.updateCarField} />}
            {form.currentStep === 5 && <StepBodyType form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 6 && <StepEngine form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 7 && <StepDrive form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 8 && <StepTransmission form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 9 && <StepEngineVolume form={form.carForm} onUpdate={form.updateCarField} />}
            {form.currentStep === 10 && <StepPower form={form.carForm} onUpdate={form.updateCarField} />}
            {form.currentStep === 11 && <StepColor form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 12 && <StepCondition form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 13 && <StepSteering form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 14 && <StepMedia form={form.carForm} onUpdate={form.updateCarField} />}
            {form.currentStep === 15 && <StepEquipment form={form.carForm} onUpdate={form.updateCarField} />}
            {form.currentStep === 16 && <StepHistory form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 17 && <StepVin form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 18 && <StepDescription form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 19 && <StepPrice form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 20 && <StepContacts form={form.carForm} errors={form.errors} onUpdate={form.updateCarField} />}
            {form.currentStep === 21 && <StepPreview form={form.carForm} />}
          </div>
        </div>

        {form.publishError && isPreview && (
          <div className="px-4 pb-2">
            <p className="text-[13px] text-[#D32F2F] text-center font-[family-name:var(--font-manrope)]">
              {form.publishError}
            </p>
          </div>
        )}

        <ContinueButton
          label={form.isPublishing ? "Публикация..." : isPreview ? "Опубликовать объявление" : "Продолжить"}
          onClick={isPreview ? () => form.publish() : handleCarContinue}
          variant={isPreview ? "publish" : "primary"}
          disabled={form.isPublishing}
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
      <AccordionFormLayout
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
        onReset={handleReset}
        onPublish={handlePublish}
        isPublishing={form.isPublishing}
        hasUnsavedChanges={form.hasUnsavedChanges}
        showExitDialog={showExitDialog}
        onExitDialogChange={setShowExitDialog}
        onConfirmExit={handleConfirmExit}
        showResetDialog={showResetDialog}
        onResetDialogChange={setShowResetDialog}
        onConfirmReset={handleConfirmReset}
      >
        <MotoForm
          form={form.motoForm}
          errors={form.errors}
          onUpdate={form.updateMotoField}
        />
      </AccordionFormLayout>
    );
  }

  // ── Commercial accordion ──
  if (form.category === "commercial") {
    return (
      <AccordionFormLayout
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
        onReset={handleReset}
        onPublish={handlePublish}
        isPublishing={form.isPublishing}
        hasUnsavedChanges={form.hasUnsavedChanges}
        showExitDialog={showExitDialog}
        onExitDialogChange={setShowExitDialog}
        onConfirmExit={handleConfirmExit}
        showResetDialog={showResetDialog}
        onResetDialogChange={setShowResetDialog}
        onConfirmReset={handleConfirmReset}
      >
        <CommercialForm
          form={form.commercialForm}
          errors={form.errors}
          onUpdate={form.updateCommercialField}
        />
      </AccordionFormLayout>
    );
  }

  return null;
}
