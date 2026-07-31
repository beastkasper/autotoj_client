"use client";

import React from "react";
import { Settings } from "lucide-react";
import { formatFullDateWithCity } from "@/lib/utils/dateFormat";
import type { RentalCar } from "@/lib/types/rental";

interface RentalCardProps {
  car: RentalCar;
  onClick: (id: string) => void;
  variant?: "desktop" | "mobile";
}

/** Карточка проката (DESIGN.md §10.8): r16, тень 0 2px 8px rgba(0,0,0,.06), без границы. */
export const RentalCard = React.memo(function RentalCard({
  car,
  onClick,
  variant = "desktop",
}: RentalCardProps) {
  const isMobile = variant === "mobile";

  return (
    <button
      onClick={() => onClick(car.id)}
      className={`overflow-hidden bg-card text-left transition-all ${
        isMobile
          ? "press-card rounded-2xl shadow-[var(--shadow-icon-card)]"
          : "group rounded-2xl hover:shadow-lg"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={car.image}
          alt={car.title}
          className={`size-full object-cover ${
            !isMobile ? "transition-transform duration-300 group-hover:scale-105" : ""
          }`}
        />
      </div>

      <div className={isMobile ? "p-3" : "p-4"}>
        <h3
          className={`line-1 font-semibold text-foreground ${
            isMobile ? "mb-1 text-[14px]" : "mb-0.5 text-[15px]"
          }`}
        >
          {car.title}
        </h3>
        {isMobile ? (
          <p className="mb-2 flex items-center gap-1 text-[12px] text-muted-foreground">
            <Settings className="size-3.5 shrink-0" strokeWidth={1.5} />
            {car.transmission}
          </p>
        ) : (
          <p className="mb-2 text-[13px] text-muted-foreground">{car.transmission}</p>
        )}
        <p
          className={`text-foreground ${isMobile ? "mb-1 text-[15px]" : "mb-2 text-[17px]"}`}
        >
          <span className="font-bold">{car.pricePerDay} сомони</span>
          <span className="text-[12px] font-normal text-muted-foreground"> / день</span>
        </p>
        <p
          className={`text-muted-foreground ${isMobile ? "text-[12px]" : "text-[13px]"}`}
        >
          {formatFullDateWithCity(car.publishedDate, car.city)}
        </p>
      </div>
    </button>
  );
});
