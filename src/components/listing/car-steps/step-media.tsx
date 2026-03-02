"use client";

import { useCallback } from "react";
import type { CarListingForm, MediaData } from "@/lib/types/listing";
import { PhotoUpload } from "@/components/listing/photo-upload";
import { VideoUpload } from "@/components/listing/video-upload";

interface StepMediaProps {
  form: CarListingForm;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepMedia({ form, onUpdate }: StepMediaProps) {
  const handleAddPhotos = useCallback(
    (files: File[]) => {
      const newPhotos = [...form.media.photos, ...files];
      const newUrls = [
        ...form.media.photoPreviewUrls,
        ...files.map((f) => URL.createObjectURL(f)),
      ];
      const updated: MediaData = {
        ...form.media,
        photos: newPhotos,
        photoPreviewUrls: newUrls,
      };
      onUpdate("media", updated);
    },
    [form.media, onUpdate]
  );

  const handleRemovePhoto = useCallback(
    (index: number) => {
      const newPhotos = form.media.photos.filter((_, i) => i !== index);
      URL.revokeObjectURL(form.media.photoPreviewUrls[index]);
      const newUrls = form.media.photoPreviewUrls.filter((_, i) => i !== index);
      const updated: MediaData = {
        ...form.media,
        photos: newPhotos,
        photoPreviewUrls: newUrls,
      };
      onUpdate("media", updated);
    },
    [form.media, onUpdate]
  );

  const handleAddVideo = useCallback(
    (file: File) => {
      const updated: MediaData = {
        ...form.media,
        video: file,
        videoPreviewUrl: URL.createObjectURL(file),
      };
      onUpdate("media", updated);
    },
    [form.media, onUpdate]
  );

  const handleRemoveVideo = useCallback(() => {
    if (form.media.videoPreviewUrl) {
      URL.revokeObjectURL(form.media.videoPreviewUrl);
    }
    const updated: MediaData = {
      ...form.media,
      video: null,
      videoPreviewUrl: null,
    };
    onUpdate("media", updated);
  }, [form.media, onUpdate]);

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="px-4">
        <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
          Фото и видео
        </h2>
        <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)] mt-1">
          Добавьте фото для привлечения внимания к объявлению
        </p>
      </div>

      <PhotoUpload
        photos={form.media.photos}
        previewUrls={form.media.photoPreviewUrls}
        maxPhotos={30}
        onAdd={handleAddPhotos}
        onRemove={handleRemovePhoto}
      />

      <div className="px-4">
        <h3 className="text-[16px] font-semibold font-[family-name:var(--font-manrope)] mb-3">
          Видео
        </h3>
      </div>
      <VideoUpload
        video={form.media.video}
        previewUrl={form.media.videoPreviewUrl}
        onAdd={handleAddVideo}
        onRemove={handleRemoveVideo}
      />
    </div>
  );
}
