"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  ListingCategory,
  CarListingForm,
  MotoListingForm,
  CommercialListingForm,
  ValidationErrors,
} from "@/lib/types/listing";
import {
  INITIAL_CAR_FORM,
  INITIAL_MOTO_FORM,
  INITIAL_COMMERCIAL_FORM,
} from "@/lib/types/listing";
import {
  validateCarStep,
  isCarStepOptional,
  validateMotoForm,
  validateCommercialForm,
} from "@/lib/validations/listing";

const CAR_TOTAL_STEPS = 18;

export function useListingForm() {
  const [category, setCategory] = useState<ListingCategory | null>(null);
  const [subcategory, setSubcategory] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [carForm, setCarForm] = useState<CarListingForm>({ ...INITIAL_CAR_FORM });
  const [motoForm, setMotoForm] = useState<MotoListingForm>({ ...INITIAL_MOTO_FORM });
  const [commercialForm, setCommercialForm] = useState<CommercialListingForm>({
    ...INITIAL_COMMERCIAL_FORM,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isPublished, setIsPublished] = useState(false);

  // ── Car form field updater ──
  const updateCarField = useCallback(
    <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => {
      setCarForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  // ── Moto form field updater ──
  const updateMotoField = useCallback(
    <K extends keyof MotoListingForm>(key: K, value: MotoListingForm[K]) => {
      setMotoForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  // ── Commercial form field updater ──
  const updateCommercialField = useCallback(
    <K extends keyof CommercialListingForm>(key: K, value: CommercialListingForm[K]) => {
      setCommercialForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  // ── Car step navigation ──
  const validateAndGoNext = useCallback((): boolean => {
    const stepErrors = validateCarStep(currentStep, carForm);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }
    setErrors({});
    if (currentStep < CAR_TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
    }
    return true;
  }, [currentStep, carForm]);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      setErrors({});
    }
  }, [currentStep]);

  const skipStep = useCallback(() => {
    if (isCarStepOptional(currentStep) && currentStep < CAR_TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
      setErrors({});
    }
  }, [currentStep]);

  // ── Accordion form validation ──
  const validateMoto = useCallback((): boolean => {
    const formErrors = validateMotoForm(motoForm);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }, [motoForm]);

  const validateCommercial = useCallback((): boolean => {
    const formErrors = validateCommercialForm(commercialForm);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }, [commercialForm]);

  // ── Reset ──
  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setCarForm({ ...INITIAL_CAR_FORM });
    setMotoForm({ ...INITIAL_MOTO_FORM });
    setCommercialForm({ ...INITIAL_COMMERCIAL_FORM });
    setErrors({});
    setIsPublished(false);
  }, []);

  const resetAll = useCallback(() => {
    setCategory(null);
    setSubcategory("");
    resetForm();
  }, [resetForm]);

  // ── Has unsaved changes ──
  const hasUnsavedChanges = useMemo(() => {
    if (category === "cars") {
      return (
        carForm.status !== "" ||
        carForm.brand !== "" ||
        carForm.model !== "" ||
        carForm.vin !== "" ||
        carForm.price !== ""
      );
    }
    if (category === "moto") {
      return motoForm.brand !== "" || motoForm.price !== "";
    }
    if (category === "commercial") {
      return commercialForm.brand !== "" || commercialForm.price !== "";
    }
    return false;
  }, [category, carForm, motoForm, commercialForm]);

  // ── Can continue (car step) ──
  const canContinue = useMemo(() => {
    if (category !== "cars") return true;
    const stepErrors = validateCarStep(currentStep, carForm);
    return Object.keys(stepErrors).length === 0;
  }, [category, currentStep, carForm]);

  // ── Publish ──
  const publish = useCallback(() => {
    setIsPublished(true);
  }, []);

  return {
    // State
    category,
    subcategory,
    currentStep,
    totalSteps: CAR_TOTAL_STEPS,
    carForm,
    motoForm,
    commercialForm,
    errors,
    isPublished,
    hasUnsavedChanges,
    canContinue,

    // Setters
    setCategory,
    setSubcategory,
    setCurrentStep,
    updateCarField,
    updateMotoField,
    updateCommercialField,
    setErrors,

    // Navigation
    validateAndGoNext,
    goBack,
    skipStep,

    // Validation
    validateMoto,
    validateCommercial,

    // Actions
    resetForm,
    resetAll,
    publish,
  };
}
