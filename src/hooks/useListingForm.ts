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
import {
  useCreateAdDraftMutation,
  useUpdateMyAdMutation,
  useUploadAdPhotosMutation,
  useUploadAdVideoMutation,
  useSubmitAdMutation,
} from "@/lib/features/ads/adsApi";
import type { AdUpdateBody } from "@/lib/types/api";

const CAR_TOTAL_STEPS = 21;

function getApiErrorMessage(err: unknown): string {
  if (
    typeof err === "object" &&
    err !== null &&
    "data" in err &&
    typeof (err as Record<string, unknown>).data === "object"
  ) {
    const data = (err as Record<string, unknown>).data as Record<string, unknown> | null;
    if (data && "error" in data && typeof data.error === "object") {
      const error = data.error as Record<string, unknown> | null;
      if (error && "message" in error && typeof error.message === "string") {
        return error.message;
      }
    }
  }
  return "Произошла ошибка при публикации";
}

const CUSTOM_CITY_ID = "__custom__";

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
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // RTK Query mutations
  const [createDraft] = useCreateAdDraftMutation();
  const [updateAd] = useUpdateMyAdMutation();
  const [uploadPhotos] = useUploadAdPhotosMutation();
  const [uploadVideo] = useUploadAdVideoMutation();
  const [submitAd] = useSubmitAdMutation();

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

  // ── Build API body from car form ──
  // Form fields already hold API-shaped values (UUIDs for brand/model/generation,
  // slugs for body/fuel/drive/color/options/city/status), so this is a 1:1 copy.
  const buildCarAdBody = useCallback((): AdUpdateBody => {
    const body: AdUpdateBody = {
      vehicle_type: "car",
    };

    if (carForm.brand) body.brand_id = carForm.brand;
    else if (carForm.customBrand) body.brand_id = carForm.customBrand;
    if (carForm.model) body.model_id = carForm.model;
    else if (carForm.customModel) body.model_id = carForm.customModel;
    if (carForm.generation) body.generation_id = carForm.generation;
    if (carForm.year) body.year = carForm.year;
    if (carForm.bodyType) body.body = carForm.bodyType;
    if (carForm.mileage) body.mileage = Number(carForm.mileage);
    if (carForm.engineType) body.fuel = carForm.engineType;
    if (carForm.driveType) body.drive = carForm.driveType;
    if (carForm.transmission) body.transmission = carForm.transmission;
    if (carForm.engineVolume) body.engine_volume = parseFloat(carForm.engineVolume);
    if (carForm.enginePower) body.power = parseInt(carForm.enginePower, 10);
    if (carForm.color) body.color = carForm.color;
    if (carForm.condition) body.condition = carForm.condition;
    if (carForm.steeringWheel) body.steering_wheel = carForm.steeringWheel;
    if (carForm.vin) body.vin = carForm.vin;
    if (carForm.price) body.price = Number(carForm.price);
    if (carForm.description) body.description = carForm.description;
    if (carForm.equipment.length > 0) body.options = carForm.equipment;
    if (carForm.contacts.name) body.contact_name = carForm.contacts.name;
    if (carForm.contacts.phone) body.contact_phone = carForm.contacts.phone;
    if (carForm.contacts.city === CUSTOM_CITY_ID) {
      if (carForm.contacts.customCity) body.city_id = carForm.contacts.customCity;
    } else if (carForm.contacts.city) {
      body.city_id = carForm.contacts.city;
    }
    body.negotiable = carForm.negotiable;
    body.can_exchange = carForm.exchangePossible;
    // Mobile-aligned defaults: vehicle_status / customs aren't collected in the wizard.
    body.vehicle_status = "available";
    body.is_customs_cleared = true;
    if (carForm.pts) body.pts = carForm.pts;
    if (carForm.owners) body.owners = Number(carForm.owners);
    body.is_damaged = carForm.hasAccident;

    return body;
  }, [carForm]);

  // ── Publish: Create draft → Upload media → Update fields → Submit ──
  const publish = useCallback(async () => {
    setIsPublishing(true);
    setPublishError(null);

    try {
      // Step 1: Create draft
      const draft = await createDraft().unwrap();
      const adId = draft.ad_id;

      // Step 2: Upload photos if any
      const form = category === "cars" ? carForm : category === "moto" ? motoForm : commercialForm;
      if (form.media.photos.length > 0) {
        await uploadPhotos({ id: adId, photos: form.media.photos }).unwrap();
      }

      // Step 3: Upload video if any
      if (form.media.video) {
        await uploadVideo({ id: adId, video: form.media.video }).unwrap();
      }

      // Step 4: Update ad fields
      const body = buildCarAdBody();
      await updateAd({ id: adId, body }).unwrap();

      // Step 5: Submit for moderation
      await submitAd(adId).unwrap();

      setIsPublished(true);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setPublishError(message);
    } finally {
      setIsPublishing(false);
    }
  }, [category, carForm, motoForm, commercialForm, createDraft, uploadPhotos, uploadVideo, updateAd, submitAd, buildCarAdBody]);

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
    isPublishing,
    publishError,
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
