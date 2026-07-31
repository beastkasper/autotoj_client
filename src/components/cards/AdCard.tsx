"use client";

import React from "react";
import { Heart, Video } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { formatPrice } from "@/lib/utils/formatPrice";
import { buildAdTitle } from "@/lib/utils/ad-helpers";
import { cn } from "@/lib/utils";
import type { Ad } from "@/lib/types/ad";

export type { Ad };

interface AdCardProps {
  ad: Ad;
  variant?: "grid" | "list";
  onFavoriteToggle: (id: string) => void;
  onClick: (id: string) => void;
  showCategoryBadge?: boolean;
  /** Карточка в избранном — сердце залито брендовым красным (§6.8) */
  isFavorite?: boolean;
}

const buildCharacteristics = (ad: Ad): string => {
  const parts: string[] = [];
  if (ad.year) parts.push(`${ad.year}`);
  return parts.join(" • ");
};

/** Бейджи статуса поверх фото: r6, 11/700, белый текст (§6.7) */
function StatusBadges({
  statusNew,
  statusOnOrder,
}: {
  statusNew?: boolean;
  statusOnOrder?: boolean;
}) {
  if (!statusNew && !statusOnOrder) return null;
  return (
    <div className="absolute left-2 top-2 flex gap-1">
      {statusNew && (
        <span className="rounded-md bg-[#4CAF50] px-2 py-1 text-[11px] font-bold leading-none text-white">
          Новый
        </span>
      )}
      {statusOnOrder && (
        <span className="rounded-md bg-[#111111] px-2 py-1 text-[11px] font-bold leading-none text-white">
          На заказ
        </span>
      )}
    </div>
  );
}

function MediaOverlays({
  ad,
  isFavorite,
  onFavoriteToggle,
}: {
  ad: Ad;
  isFavorite?: boolean;
  onFavoriteToggle: (id: string) => void;
}) {
  return (
    <>
      <button
        type="button"
        aria-label="В избранное"
        aria-pressed={isFavorite ? "true" : "false"}
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle(ad.id);
        }}
        className="absolute right-2 top-2 z-10 grid size-7 place-items-center rounded-[14px] bg-black/20 backdrop-blur-[4px] transition-opacity active:opacity-70"
      >
        <Heart
          className={cn("size-4", isFavorite ? "text-[#E53935]" : "text-white")}
          strokeWidth={2}
          fill={isFavorite ? "#E53935" : "none"}
        />
      </button>
      <StatusBadges statusNew={ad.statusNew} statusOnOrder={ad.statusOnOrder} />
      {ad.hasVideo && (
        <div className="absolute bottom-2 left-2 flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 backdrop-blur-[4px]">
          <Video className="size-3 text-white" strokeWidth={2} />
        </div>
      )}
    </>
  );
}

/** Карточка объявления (DESIGN.md §6.8): r20, border 1px, тень 0 4px 16px rgba(0,0,0,.06) */
export const AdCard = React.memo(function AdCard({
  ad,
  variant = "grid",
  onFavoriteToggle,
  onClick,
  isFavorite,
}: AdCardProps) {
  const characteristics = buildCharacteristics(ad);
  // Есть версия → «{марка} · {модель}» и версия отдельной строкой
  const title = ad.version ? `${ad.brand} · ${ad.model}` : buildAdTitle(ad);

  const body = (
    <>
      <h3 className="line-1 mb-0.5 text-[14px] font-medium text-foreground">{title}</h3>
      {ad.version && (
        <p className="line-1 mb-1 text-[12px] text-muted-foreground">{ad.version}</p>
      )}
      <p className="mb-1 text-[16px] font-bold text-foreground">
        {formatPrice(ad.price)} сомони
      </p>
      {characteristics && (
        <p className="line-1 text-[12px] text-muted-foreground">{characteristics}</p>
      )}
    </>
  );

  if (variant === "list") {
    return (
      <article
        onClick={() => onClick(ad.id)}
        className="ad-card cursor-pointer"
        role="button"
      >
        <div className="flex">
          <div className="relative size-32 shrink-0">
            <ImageWithFallback
              src={ad.image}
              alt={title}
              className="size-full object-cover"
            />
            <MediaOverlays
              ad={ad}
              isFavorite={isFavorite}
              onFavoriteToggle={onFavoriteToggle}
            />
          </div>
          <div className="flex flex-1 flex-col justify-between overflow-hidden p-3">
            {body}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => onClick(ad.id)}
      role="button"
      className="ad-card flex cursor-pointer flex-col lg:hover:border-foreground lg:hover:shadow-lg lg:hover:scale-[1.02] lg:transition-all"
    >
      <div className="relative aspect-[4/3]">
        <ImageWithFallback
          src={ad.image}
          alt={title}
          className="size-full object-cover"
        />
        <MediaOverlays
          ad={ad}
          isFavorite={isFavorite}
          onFavoriteToggle={onFavoriteToggle}
        />
      </div>
      <div className="p-3">{body}</div>
    </article>
  );
});
