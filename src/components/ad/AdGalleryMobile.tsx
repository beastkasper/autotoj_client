"use client";

import { useRef, useState } from "react";
import { Video } from "lucide-react";
import { ImageWithFallback } from "@/components/cards/ImageWithFallback";
import { cn } from "@/lib/utils";

interface AdGalleryMobileProps {
  images: string[];
  alt: string;
  hasVideo?: boolean;
}

/**
 * Свайп-галерея в деталях (DESIGN.md §10.2): фото 4:3, счётчик top16 right16
 * на rgba(0,0,0,.6) r8, точки снизу (активная 24×8, остальные 8×8).
 */
export function AdGalleryMobile({ images, alt, hasVideo }: AdGalleryMobileProps) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const list = images.length > 0 ? images : [""];

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(delta) < 40) return;
    setIndex((i) =>
      delta < 0 ? Math.min(i + 1, list.length - 1) : Math.max(i - 1, 0),
    );
  };

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden bg-secondary"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {list.map((src, i) => (
          <div key={i} className="h-full w-full shrink-0">
            <ImageWithFallback
              src={src}
              alt={`${alt} ${i + 1}`}
              className="size-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Счётчик фото */}
      {list.length > 1 && (
        <div className="absolute right-4 top-4 rounded-lg bg-black/60 px-2 py-1 text-[14px] font-medium text-white backdrop-blur-[4px]">
          {index + 1}/{list.length}
        </div>
      )}

      {/* Бейдж видео */}
      {hasVideo && (
        <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 backdrop-blur-[4px]">
          <Video className="size-3 text-white" strokeWidth={2} />
          <span className="text-[11px] font-bold text-white">Видео</span>
        </div>
      )}

      {/* Точки-индикаторы */}
      {list.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Фото ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-6 bg-white" : "w-2 bg-white/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
