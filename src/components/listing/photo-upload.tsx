"use client";

import { useRef, useCallback } from "react";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  photos: File[];
  previewUrls: string[];
  maxPhotos?: number;
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export function PhotoUpload({
  photos,
  previewUrls,
  maxPhotos = 30,
  onAdd,
  onRemove,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const remaining = maxPhotos - photos.length;
      const newFiles = Array.from(files).slice(0, remaining);
      onAdd(newFiles);
      if (inputRef.current) inputRef.current.value = "";
    },
    [maxPhotos, photos.length, onAdd]
  );

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 px-4">
        {/* Existing photos */}
        {previewUrls.map((url, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-xl overflow-hidden bg-[#F2F2F7]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Фото ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        ))}

        {/* Add button */}
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "aspect-square rounded-xl bg-[#F2F2F7] border-2 border-dashed border-[#D1D1D6]",
              "flex flex-col items-center justify-center gap-1 transition-colors active:bg-[#E5E5EA]"
            )}
          >
            <Camera className="w-6 h-6 text-[#8E8E93]" />
            <span className="text-[12px] font-medium text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              Добавить
            </span>
          </button>
        )}
      </div>

      <p className="px-4 mt-2 text-[12px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
        {photos.length} из {maxPhotos} фото
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
