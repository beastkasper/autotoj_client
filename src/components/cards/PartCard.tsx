"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDateWithCity } from "@/lib/utils/dateFormat";
import type { PartListing } from "@/lib/data/mockParts";

interface PartCardProps {
  part: PartListing;
  onClick: (id: number) => void;
  variant?: "desktop" | "mobile";
}

export const PartCard = React.memo(function PartCard({
  part,
  onClick,
  variant = "desktop",
}: PartCardProps) {
  const isMobile = variant === "mobile";

  return (
    <button
      onClick={() => onClick(part.id)}
      className={`bg-white rounded-2xl overflow-hidden text-left transition-all ${
        isMobile
          ? "active:scale-[0.98] transition-transform"
          : "hover:shadow-lg group"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#F5F5F7]">
        <img
          src={part.image}
          alt={part.title}
          className={`w-full h-full object-cover ${
            !isMobile ? "group-hover:scale-105 transition-transform duration-300" : ""
          }`}
        />
        <div className={`absolute ${isMobile ? "top-2 left-2" : "top-3 left-3"}`}>
          <Badge
            className={`${isMobile ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-[13px]"} font-medium font-[family-name:var(--font-manrope)] ${
              part.condition === "Новый"
                ? "bg-[#2E7D32] text-white border-transparent hover:bg-[#2E7D32]"
                : "bg-white/90 backdrop-blur-sm text-[#111111] border-transparent hover:bg-white/90"
            }`}
          >
            {part.condition}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className={isMobile ? "p-3" : "p-4"}>
        <h3
          className={`font-semibold text-[#111111] mb-${isMobile ? "1" : "2"} line-clamp-2 font-[family-name:var(--font-manrope)] ${
            isMobile ? "text-[13px]" : "text-[15px]"
          }`}
        >
          {part.title}
        </h3>
        <p
          className={`font-bold text-[#111111] mb-${isMobile ? "1" : "2"} font-[family-name:var(--font-manrope)] ${
            isMobile ? "text-[15px]" : "text-[17px]"
          }`}
        >
          {part.price} сомони
        </p>
        <p
          className={`text-[#8E8E93] font-[family-name:var(--font-manrope)] ${
            isMobile ? "text-[11px]" : "text-[13px]"
          }`}
        >
          {formatDateWithCity(part.publishedDate, part.city)}
        </p>
      </div>
    </button>
  );
});
