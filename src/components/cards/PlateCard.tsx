"use client";

import React from "react";
import { Eye } from "lucide-react";
import { PlateNumber } from "@/components/plates/PlateNumber";
import { formatPrice } from "@/lib/utils/formatPrice";
import { formatDateWithCity } from "@/lib/utils/dateFormat";
import type { PlateListing } from "@/lib/types/plate";

interface PlateCardProps {
  plate: PlateListing;
  onClick: (id: string) => void;
  variant?: "desktop" | "mobile";
}

export const PlateCard = React.memo(function PlateCard({
  plate,
  onClick,
  variant = "desktop",
}: PlateCardProps) {
  const isMobile = variant === "mobile";

  return (
    <button
      onClick={() => onClick(plate.id)}
      className={`bg-white rounded-2xl overflow-hidden text-left transition-all ${
        isMobile
          ? "active:scale-[0.98] transition-transform"
          : "hover:shadow-lg group"
      }`}
    >
      {/* Plate visualization */}
      <div className="relative flex aspect-[4/3] items-center justify-center bg-[#F5F5F7] px-4">
        <PlateNumber plateNumber={plate.plateNumber} size="sm" />
        {plate.isVip && (
          <div className={`absolute ${isMobile ? "top-2 left-2" : "top-3 left-3"}`}>
            <span className="inline-flex items-center rounded-md bg-[#F8C300] px-2 py-0.5 text-[11px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
              VIP
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={isMobile ? "p-3" : "p-4"}>
        <p
          className={`text-[#8E8E93] font-[family-name:var(--font-manrope)] ${
            isMobile ? "text-[11px] mb-1" : "text-[13px] mb-1.5"
          }`}
        >
          {formatDateWithCity(plate.publishedDate, plate.region)}
        </p>
        <p
          className={`text-[#111111] font-bold font-[family-name:var(--font-manrope)] ${
            isMobile ? "text-[15px] mb-1" : "text-[17px] mb-1.5"
          }`}
        >
          {formatPrice(plate.price)} сомони
        </p>
        <div
          className={`flex items-center gap-1 text-[#8E8E93] font-[family-name:var(--font-manrope)] ${
            isMobile ? "text-[11px]" : "text-[13px]"
          }`}
        >
          <Eye className={isMobile ? "w-3 h-3" : "w-3.5 h-3.5"} />
          <span>{plate.views}</span>
        </div>
      </div>
    </button>
  );
});
