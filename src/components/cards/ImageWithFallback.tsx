"use client";

import { useState } from "react";
import { Car, type LucideIcon } from "lucide-react";
import { mediaUrl } from "@/lib/utils/mediaUrl";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  Icon?: LucideIcon;
  /** Ширина для оптимизатора — по умолчанию хватает для карточки. */
  width?: number;
}

export function ImageWithFallback({
  src,
  alt,
  className = "",
  Icon = Car,
  width = 800,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const safeSrc = mediaUrl(src, width);

  if (!safeSrc || hasError) {
    return (
      <div className={`bg-gradient-to-br from-[#E5E5E7] to-[#F2F2F7] flex items-center justify-center ${className}`}>
        <Icon className="size-12 text-[#C7C7CC]" strokeWidth={1} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={safeSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}
