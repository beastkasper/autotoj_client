"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/components/cards/ImageWithFallback";

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageGallery({
  images,
  alt,
  className = "",
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentImage = images[selectedIndex] ?? "";

  const goToPrev = useCallback(() => {
    setSelectedIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className={`relative bg-[#F5F5F7] flex items-center justify-center ${className}`}>
        <ImageWithFallback src="" alt={alt} className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Main image */}
      <div className="relative bg-[#F5F5F7] aspect-[4/3] lg:aspect-[16/10] rounded-2xl overflow-hidden group">
        <img
          src={currentImage}
          alt={`${alt} ${selectedIndex + 1}`}
          className="w-full h-full object-contain"
        />

        {/* Navigation arrows (desktop) */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5 text-[#111111]" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="w-5 h-5 text-[#111111]" />
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[12px] text-white font-medium font-[family-name:var(--font-manrope)]">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`shrink-0 w-[80px] h-[60px] lg:w-[100px] lg:h-[70px] rounded-xl overflow-hidden border-2 transition-colors ${
                i === selectedIndex
                  ? "border-[#111111]"
                  : "border-transparent hover:border-[#8E8E93]"
              }`}
            >
              <img
                src={img}
                alt={`${alt} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
