"use client";

import React from "react";
import { formatDateWithCity } from "@/lib/utils/dateFormat";
import type { PartListing } from "@/lib/types/part";

interface PartCardProps {
  part: PartListing;
  onClick: (id: string) => void;
  variant?: "desktop" | "mobile";
}

/** Карточка запчасти (DESIGN.md §10.7): r12 + border, фото 1:1, бейдж состояния top8 left8. */
export const PartCard = React.memo(function PartCard({
  part,
  onClick,
  variant = "desktop",
}: PartCardProps) {
  const isMobile = variant === "mobile";
  const isNew = part.condition === "Новый";

  return (
    <button
      onClick={() => onClick(part.id)}
      className={`overflow-hidden bg-card text-left transition-all ${
        isMobile
          ? "press-card rounded-xl border border-border"
          : "group rounded-2xl hover:shadow-lg"
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={part.image}
          alt={part.title}
          className={`size-full object-cover ${
            !isMobile ? "transition-transform duration-300 group-hover:scale-105" : ""
          }`}
        />
        <span
          className={`absolute rounded-md font-medium text-white ${
            isMobile
              ? "left-2 top-2 px-2 py-0.5 text-[11px]"
              : "left-3 top-3 px-3 py-1 text-[13px]"
          }`}
          style={{ background: isNew ? "#34C759" : "#FF9500" }}
        >
          {part.condition}
        </span>
      </div>

      <div className={isMobile ? "p-3" : "p-4"}>
        <h3
          className={`line-2 font-medium text-foreground ${
            isMobile ? "mb-1 text-[14px]" : "mb-2 text-[15px] font-semibold"
          }`}
        >
          {part.title}
        </h3>
        <p
          className={`font-bold text-foreground ${
            isMobile ? "mb-1 text-[15px]" : "mb-2 text-[17px]"
          }`}
        >
          {part.price} сомони
        </p>
        <p
          className={`text-muted-foreground ${isMobile ? "text-[12px]" : "text-[13px]"}`}
        >
          {formatDateWithCity(part.publishedDate, part.city)}
        </p>
      </div>
    </button>
  );
});
