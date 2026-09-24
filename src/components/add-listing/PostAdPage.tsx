"use client";

import { useCallback, useEffect, useState } from "react";
import { Toast } from "@/lib/add-listing/alert";
import { retryWhile, isStaleNotFound, isStaleValidation, extractFieldMessages } from "@/lib/add-listing/retryStale";
import { filesFromUris, fileFromUri } from "@/lib/add-listing/photoPicker";
import { useDicts } from "@/lib/add-listing/dicts";
import type { VehiclePublishData } from "@/lib/add-listing/vehiclePayload";
import type { AdUpdateBody } from "@/lib/types/api";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import {
  useCreateAdDraftMutation,
  useUpdateMyAdMutation,
  useUploadAdPhotosMutation,
  useUploadAdVideoMutation,
  useSubmitAdMutation,
} from "@/lib/features/ads/adsApi";
import { useCreatePartMutation, useUploadPartPhotosMutation } from "@/lib/features/parts/partsApi";
import { MotoSubcategorySheet } from "@/components/add-listing/MotoSubcategorySheet";
import { CommercialSubcategorySheet } from "@/components/add-listing/CommercialSubcategorySheet";
import { CarListingForm } from "@/components/add-listing/CarListingForm";
import { MotoForm } from "@/components/add-listing/MotoForm";
import { CommercialForm } from "@/components/add-listing/CommercialForm";
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
import { PublishSuccessScreen } from "@/components/add-listing/PublishSuccessScreen";

/**
 * Веб-порт autoToj-app/src/components/pages/PostAdPage.tsx.
 * Категория выбирается заранее (AddListingCategoryPage или ?category=...).
 */

export type PostAdCategory = "cars" | "moto" | "commercial" | "parts";

interface PostAdPageProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialCategory?: PostAdCategory;
}

type Step = "category" | "motoSubcategory" | "commercialSubcategory" | "carForm" | "motoForm" | "commercialForm" | "success";

function getInitialStep(category?: PostAdCategory): Step {
  if (!category) return "category";
  switch (category) {
    case "cars": return "carForm";
    case "moto": return "motoSubcategory";
    case "commercial": return "commercialSubcategory";
    default: return "category";
  }
}

export function PostAdPage({ onClose, onSuccess, initialCategory }: PostAdPageProps) {
  const { dicts } = useDicts();
  const [currentStep, setCurrentStep] = useState<Step>(getInitialStep(initialCategory));
  const [selectedCategory] = useState<PostAdCategory | null>(initialCategory || null);
  const [selectedMotoSubcategory, setSelectedMotoSubcategory] = useState<string | null>(null);
  const [selectedCommercialSubcategory, setSelectedCommercialSubcategory] = useState<string | null>(null);
  const [showTiresForm, setShowTiresForm] = useState(false);
  const [showWheelsForm, setShowWheelsForm] = useState(false);
  const [showSteeringWheelForm, setShowSteeringWheelForm] = useState(false);
  const [showOpticsForm, setShowOpticsForm] = useState(false);
  const [showSuspensionForm, setShowSuspensionForm] = useState(false);
  const [showBodyPartsForm, setShowBodyPartsForm] = useState(false);
  const [showEngineForm, setShowEngineForm] = useState(false);
  const [showTransmissionForm, setShowTransmissionForm] = useState(false);
  const [showConsumablesForm, setShowConsumablesForm] = useState(false);

  const [createDraft] = useCreateAdDraftMutation();
  const [updateAd] = useUpdateMyAdMutation();
  const [uploadPhotos] = useUploadAdPhotosMutation();
  const [uploadVideo] = useUploadAdVideoMutation();
  const [submitAd] = useSubmitAdMutation();
  const [createPart] = useCreatePartMutation();
  const [uploadPartPhotos] = useUploadPartPhotosMutation();

  const handleMotoSubcategorySelect = (subcategory: string) => {
    setSelectedMotoSubcategory(subcategory);
    setCurrentStep("motoForm");
  };

  const handleCommercialSubcategorySelect = (subcategory: string) => {
    setSelectedCommercialSubcategory(subcategory);
    setCurrentStep("commercialForm");
  };

  const [publishing, setPublishing] = useState(false);

  const handleSuccessComplete = () => {
    if (onSuccess) onSuccess();
    else onClose();
  };

  const reportFailure = (error: unknown) => {
    const message = getApiErrorMessage(error, "Попробуйте ещё раз");
    const fieldMessages = extractFieldMessages(error);
    Toast.show({
      type: "error",
      text1: "Не удалось опубликовать",
      text2: fieldMessages.length > 0 ? `${message}: ${fieldMessages.join(", ")}` : message,
    });
  };

  // Формы, как и в мобилке, хранят город текстом. Если он совпадает с городом
  // из справочника — отправляем его id.
  const resolveCityId = useCallback(
    (city: unknown): string | undefined => {
      if (typeof city !== "string" || !city.trim()) return undefined;
      const q = city.trim().toLowerCase();
      const match = dicts?.cities?.find((c) => c.id === city || c.name.toLowerCase() === q);
      return match?.id ?? city.trim();
    },
    [dicts],
  );

  // Vehicles (cars / moto / commercial) follow the draft flow the API expects:
  // create an empty draft, PATCH the collected fields onto it, attach photos
  // (and video, if the form collected one), then hand it to moderation.
  // `data` is already API-shaped — see src/lib/add-listing/vehiclePayload.ts.
  const publishVehicle = useCallback(async (data: VehiclePublishData) => {
    if (publishing) return;
    setPublishing(true);
    try {
      const { photos, video, ...fields } = data;
      const body = { ...fields, city_id: resolveCityId(fields.city_id) } as AdUpdateBody;
      if (!body.city_id) delete body.city_id;
      const { ad_id } = await createDraft().unwrap();
      // retryWhile: бэкенд коммитит после ответа, свежий драфт/PATCH могут быть ещё не видны
      await retryWhile(() => updateAd({ id: ad_id, body }).unwrap(), isStaleNotFound);

      const files = filesFromUris((photos ?? []).filter((p): p is string => typeof p === "string" && p.length > 0));
      if (files.length > 0) {
        await retryWhile(() => uploadPhotos({ id: ad_id, photos: files }).unwrap(), isStaleNotFound);
      }

      const videoFile = video ? fileFromUri(video) : null;
      if (videoFile) {
        await retryWhile(() => uploadVideo({ id: ad_id, video: videoFile }).unwrap(), isStaleNotFound);
      }

      await retryWhile(() => submitAd(ad_id).unwrap(), isStaleValidation);
      setCurrentStep("success");
    } catch (error) {
      reportFailure(error);
    } finally {
      setPublishing(false);
    }
  }, [publishing, resolveCityId, createDraft, updateAd, uploadPhotos, uploadVideo, submitAd]); // eslint-disable-line react-hooks/exhaustive-deps

  // Parts live under /my/parts and are created in one call, so they only need
  // the photo upload afterwards.
  const publishPart = useCallback(async (data: object, closeForm: () => void) => {
    if (publishing) return;
    setPublishing(true);
    try {
      const { photos, ...fields } = data as { photos?: unknown } & Record<string, unknown>;
      const { id: partId } = await createPart(fields).unwrap();

      const uris = Array.isArray(photos) ? photos.filter((p): p is string => typeof p === "string") : [];
      const files = filesFromUris(uris);
      if (files.length > 0) {
        await retryWhile(() => uploadPartPhotos({ id: partId, photos: files }).unwrap(), isStaleNotFound);
      }

      closeForm();
      setCurrentStep("success");
    } catch (error) {
      reportFailure(error);
    } finally {
      setPublishing(false);
    }
  }, [publishing, createPart, uploadPartPhotos]); // eslint-disable-line react-hooks/exhaustive-deps

  // Без категории здесь делать нечего — её выбирают на AddListingCategoryPage.
  const noCategory = currentStep === "category" && !selectedCategory;
  useEffect(() => {
    if (noCategory) onClose();
  }, [noCategory, onClose]);
  if (noCategory) return null;

  // Moto Subcategory selection (Bottom Sheet)
  if (currentStep === "motoSubcategory") {
    return (
      <MotoSubcategorySheet
        onSelect={handleMotoSubcategorySelect}
        onBack={onClose}
        onClose={onClose}
      />
    );
  }

  // Commercial Subcategory selection (Bottom Sheet)
  if (currentStep === "commercialSubcategory") {
    return (
      <CommercialSubcategorySheet
        onSelect={handleCommercialSubcategorySelect}
        onBack={onClose}
        onClose={onClose}
      />
    );
  }

  // Tires Form (only for Parts > Шины)
  if (showTiresForm) {
    return (
      <TiresListingForm
        onBack={() => setShowTiresForm(false)}
        onClose={onClose}
        onPublish={(data) => publishPart(data, () => setShowTiresForm(false))}
      />
    );
  }

  // Wheels Form (only for Parts > Колеса)
  if (showWheelsForm) {
    return (
      <WheelsListingForm
        onBack={() => setShowWheelsForm(false)}
        onClose={onClose}
        onPublish={(data) => publishPart(data, () => setShowWheelsForm(false))}
      />
    );
  }

  // Steering Wheel Form (only for Parts > Рулевое колесо)
  if (showSteeringWheelForm) {
    return (
      <SteeringWheelListingForm
        onBack={() => setShowSteeringWheelForm(false)}
        onClose={onClose}
        onPublish={(data) => publishPart(data, () => setShowSteeringWheelForm(false))}
      />
    );
  }

  // Optics Form (only for Parts > Оптика)
  if (showOpticsForm) {
    return (
      <OpticsListingForm
        onBack={() => setShowOpticsForm(false)}
        onClose={onClose}
        onPublish={(data) => publishPart(data, () => setShowOpticsForm(false))}
      />
    );
  }

  // Suspension Form (only for Parts > Подвеска)
  if (showSuspensionForm) {
    return (
      <SuspensionListingForm
        onBack={() => setShowSuspensionForm(false)}
        onClose={onClose}
        onPublish={(data) => publishPart(data, () => setShowSuspensionForm(false))}
      />
    );
  }

  // Body Parts Form (only for Parts > Детали кузова)
  if (showBodyPartsForm) {
    return (
      <BodyPartsListingForm
        onBack={() => setShowBodyPartsForm(false)}
        onClose={onClose}
        onPublish={(data) => publishPart(data, () => setShowBodyPartsForm(false))}
      />
    );
  }

  // Engine Form (only for Parts > Двигатель)
  if (showEngineForm) {
    return (
      <EngineListingForm
        onBack={() => setShowEngineForm(false)}
        onClose={onClose}
        onPublish={(data) => publishPart(data, () => setShowEngineForm(false))}
      />
    );
  }

  // Transmission Form (only for Parts > КПП)
  if (showTransmissionForm) {
    return (
      <TransmissionListingForm
        onBack={() => setShowTransmissionForm(false)}
        onClose={onClose}
        onPublish={(data) => publishPart(data, () => setShowTransmissionForm(false))}
      />
    );
  }

  // Consumables Form (only for Parts > Расходники)
  if (showConsumablesForm) {
    return (
      <ConsumablesListingForm
        onBack={() => setShowConsumablesForm(false)}
        onClose={onClose}
        onPublish={(data) => publishPart(data, () => setShowConsumablesForm(false))}
      />
    );
  }

  // Success screen (works for all categories)
  if (currentStep === "success") {
    return <PublishSuccessScreen onComplete={handleSuccessComplete} />;
  }

  // Parts category - show subcategory selection
  if (selectedCategory === "parts") {
    return (
      <PartsListingPlaceholder
        onBack={onClose}
        onSelectCategory={(category) => {
          if (category === "Шины") setShowTiresForm(true);
          else if (category === "Диски") setShowWheelsForm(true);
          else if (category === "Руль") setShowSteeringWheelForm(true);
          else if (category === "Оптика") setShowOpticsForm(true);
          else if (category === "Ходовая часть") setShowSuspensionForm(true);
          else if (category === "Детали кузова") setShowBodyPartsForm(true);
          else if (category === "Двигатель") setShowEngineForm(true);
          else if (category === "КПП") setShowTransmissionForm(true);
          else if (category === "Расходники") setShowConsumablesForm(true);
        }}
      />
    );
  }

  // Car Listing Form (21-step wizard)
  if (currentStep === "carForm") {
    return <CarListingForm onBack={onClose} onClose={onClose} onPublish={publishVehicle} />;
  }

  // Moto: shared accordion form for all 4 subcategories
  if (currentStep === "motoForm" && selectedMotoSubcategory) {
    return (
      <MotoForm
        subcategory={selectedMotoSubcategory}
        onBack={() => setCurrentStep("motoSubcategory")}
        onClose={onClose}
        onPublish={publishVehicle}
      />
    );
  }

  // Commercial: shared accordion form for all 13 subcategories
  if (currentStep === "commercialForm" && selectedCommercialSubcategory) {
    return (
      <CommercialForm
        subcategory={selectedCommercialSubcategory}
        onBack={() => setCurrentStep("commercialSubcategory")}
        onClose={onClose}
        onPublish={publishVehicle}
      />
    );
  }

  // Fallback
  return <div className="min-h-dvh bg-background" />;
}
