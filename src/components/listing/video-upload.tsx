"use client";

import { useRef, useCallback } from "react";
import { Video, X, Play } from "lucide-react";

interface VideoUploadProps {
  video: File | null;
  previewUrl: string | null;
  onAdd: (file: File) => void;
  onRemove: () => void;
}

export function VideoUpload({
  video,
  previewUrl,
  onAdd,
  onRemove,
}: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onAdd(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [onAdd]
  );

  return (
    <div className="px-4">
      {video && previewUrl ? (
        <div className="relative w-full h-[200px] rounded-xl overflow-hidden bg-[#F2F2F7]">
          <video
            src={previewUrl}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
              <Play className="w-5 h-5 text-white ml-0.5" />
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-3 w-full h-14 px-4 rounded-xl bg-[#F2F2F7] border-2 border-dashed border-[#D1D1D6] transition-colors active:bg-[#E5E5EA]"
        >
          <Video className="w-6 h-6 text-[#8E8E93]" />
          <span className="text-[15px] text-[#8E8E93] font-medium font-[family-name:var(--font-manrope)]">
            Добавить видео (до 60 сек)
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
