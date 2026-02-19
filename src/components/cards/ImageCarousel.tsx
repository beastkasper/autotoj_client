"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeImages = images.length > 0 ? images : [""];

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + safeImages.length) % safeImages.length);
    },
    [safeImages.length]
  );

  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  return (
    <div className="flex flex-col gap-3">
      {/* ── Main image ── */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#E5E5E7] group">
        <ImageWithFallback
          src={safeImages[activeIndex]}
          alt={`${alt} — фото ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Arrow buttons */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5 text-[#111111]" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="w-5 h-5 text-[#111111]" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {safeImages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all ${
                  i === activeIndex
                    ? "w-2.5 h-2.5 bg-white"
                    : "w-2 h-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Thumbnails ── */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((src, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`relative shrink-0 w-[120px] h-[80px] rounded-xl overflow-hidden transition-all ${
                i === activeIndex
                  ? "ring-2 ring-[#111111] ring-offset-1"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <ImageWithFallback
                src={src}
                alt={`${alt} — миниатюра ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
