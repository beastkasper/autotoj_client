"use client";

import React from "react";
import { formatFullDateWithCity } from "@/lib/utils/dateFormat";
import type { RentalCar } from "@/lib/data/mockRentals";

interface RentalCardProps {
  car: RentalCar;
  onClick: (id: number) => void;
  variant?: "desktop" | "mobile";
}

export const RentalCard = React.memo(function RentalCard({
  car,
  onClick,
  variant = "desktop",
}: RentalCardProps) {
  const isMobile = variant === "mobile";

  return (
    <button
      onClick={() => onClick(car.id)}
      className={`bg-white rounded-2xl overflow-hidden text-left transition-all ${
        isMobile
          ? "active:scale-[0.98] transition-transform"
          : "hover:shadow-lg group"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F5F7]">
        <img
          src={car.image}
          alt={car.title}
          className={`w-full h-full object-cover ${
            !isMobile
              ? "group-hover:scale-105 transition-transform duration-300"
              : ""
          }`}
        />
      </div>

      {/* Info */}
      <div className={isMobile ? "p-3" : "p-4"}>
        <h3
          className={`font-semibold text-[#111111] mb-0.5 line-clamp-1 font-[family-name:var(--font-manrope)] ${
            isMobile ? "text-[13px]" : "text-[15px]"
          }`}
        >
          {car.title}
        </h3>
        <p
          className={`text-[#8E8E93] font-[family-name:var(--font-manrope)] ${
            isMobile ? "text-[11px] mb-1.5" : "text-[13px] mb-2"
          }`}
        >
          {car.transmission}
        </p>
        <p
          className={`text-[#111111] font-[family-name:var(--font-manrope)] ${
            isMobile ? "text-[15px] mb-1" : "text-[17px] mb-2"
          }`}
        >
          <span className="font-bold">{car.pricePerDay} сомони/</span>
          <span className="font-normal text-[13px]">день</span>
        </p>
        <p
          className={`text-[#8E8E93] font-[family-name:var(--font-manrope)] ${
            isMobile ? "text-[11px]" : "text-[13px]"
          }`}
        >
          {formatFullDateWithCity(car.publishedDate, car.city)}
        </p>
      </div>
    </button>
  );
});
