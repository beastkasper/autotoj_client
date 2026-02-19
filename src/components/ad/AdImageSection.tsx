"use client";

import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/cards/ImageWithFallback";

interface AdImageSectionProps {
  image: string;
  alt: string;
  statusNew?: boolean;
  statusOnOrder?: boolean;
  className?: string;
}

export function AdImageSection({
  image,
  alt,
  statusNew,
  statusOnOrder,
  className = "",
}: AdImageSectionProps) {
  return (
    <div className={`relative overflow-hidden bg-[#E5E5E7] ${className}`}>
      <ImageWithFallback
        src={image}
        alt={alt}
        className="w-full h-full object-cover"
      />
      {(statusNew || statusOnOrder) && (
        <div className="absolute top-3 left-3 flex gap-1.5">
          {statusNew && (
            <Badge className="bg-[#4CAF50] text-white border-transparent hover:bg-[#4CAF50] rounded-lg px-2.5 py-1 text-[11px] font-bold font-[family-name:var(--font-manrope)]">
              Новый
            </Badge>
          )}
          {statusOnOrder && (
            <Badge className="bg-[#111111] text-white border-transparent hover:bg-[#111111] rounded-lg px-2.5 py-1 text-[11px] font-bold font-[family-name:var(--font-manrope)]">
              На заказ
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
