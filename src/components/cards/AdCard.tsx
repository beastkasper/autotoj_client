"use client";

import React from "react";
import { Heart, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "./ImageWithFallback";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { Ad } from "@/lib/data/mockAds";

export type { Ad };

interface AdCardProps {
  ad: Ad;
  variant?: "grid" | "list";
  onFavoriteToggle: (id: string) => void;
  onClick: (id: string) => void;
  showCategoryBadge?: boolean;
}

const buildCharacteristics = (ad: Ad): string => {
  const parts: string[] = [];
  if (ad.year) parts.push(`${ad.year}`);
  return parts.join(" • ");
};

function StatusBadges({ statusNew, statusOnOrder }: { statusNew?: boolean; statusOnOrder?: boolean }) {
  if (!statusNew && !statusOnOrder) return null;
  return (
    <div className="absolute top-2 left-2 flex gap-1">
      {statusNew && (
        <Badge className="bg-[#4CAF50] text-white border-transparent hover:bg-[#4CAF50] backdrop-blur-sm rounded-md px-2 py-1 text-[11px] font-bold font-[family-name:var(--font-manrope)]">
          Новый
        </Badge>
      )}
      {statusOnOrder && (
        <Badge className="bg-[#111111] text-white border-transparent hover:bg-[#111111] backdrop-blur-sm rounded-md px-2 py-1 text-[11px] font-bold font-[family-name:var(--font-manrope)]">
          На заказ
        </Badge>
      )}
    </div>
  );
}

export const AdCard = React.memo(function AdCard({
  ad,
  variant = "grid",
  onFavoriteToggle,
  onClick,
}: AdCardProps) {
  const characteristics = buildCharacteristics(ad);
  const title = ad.version
    ? `${ad.brand} · ${ad.model}`
    : `${ad.brand} ${ad.model}`;

  if (variant === "list") {
    return (
      <div
        className="bg-white rounded-[20px] overflow-hidden border border-[#E5E5EA] shadow-[0_4px_16px_rgba(0,0,0,0.06)] cursor-pointer active:opacity-96 transition-opacity"
        onClick={() => onClick(ad.id)}
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-32 h-32 shrink-0">
            <ImageWithFallback
              src={ad.image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(ad.id);
              }}
              className="absolute top-2 right-2 w-7 h-7 bg-black/20 backdrop-blur-sm rounded-[14px] flex items-center justify-center active:opacity-70 transition-opacity z-10"
            >
              <Heart className="w-4 h-4 text-white" />
            </button>
            <StatusBadges statusNew={ad.statusNew} statusOnOrder={ad.statusOnOrder} />
            {ad.hasVideo && (
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-0.5">
                <Video className="w-3 h-3 text-white" strokeWidth={2} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <h3 className="font-medium text-sm line-clamp-1 mb-0.5 text-[#111111] font-[family-name:var(--font-manrope)]">
                {title}
              </h3>
              {ad.version && (
                <div className="text-xs text-[#8E8E93] mb-1 font-[family-name:var(--font-manrope)]">
                  {ad.version}
                </div>
              )}
              <div className="text-base font-bold text-[#111111] mb-1 font-[family-name:var(--font-manrope)]">
                {formatPrice(ad.price)} сомони
              </div>
              {characteristics && (
                <div className="text-xs text-[#8E8E93] line-clamp-1 font-[family-name:var(--font-manrope)]">
                  {characteristics}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid variant
  return (
    <article
      onClick={() => onClick(ad.id)}
      className="bg-white rounded-2xl overflow-hidden border border-[#E5E5E7] transition-all cursor-pointer group hover:border-[#111111] hover:shadow-lg lg:hover:scale-[1.02] flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3]">
        <ImageWithFallback
          src={ad.image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(ad.id);
          }}
          className="absolute top-2 right-2 w-7 h-7 bg-black/20 backdrop-blur-sm rounded-[14px] flex items-center justify-center active:opacity-70 transition-opacity z-10"
        >
          <Heart className="w-4 h-4 text-white" />
        </button>
        <StatusBadges statusNew={ad.statusNew} statusOnOrder={ad.statusOnOrder} />
        {ad.hasVideo && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-0.5">
            <Video className="w-3 h-3 text-white" strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-1 mb-0.5 text-[#111111] font-[family-name:var(--font-manrope)]">
          {title}
        </h3>
        {ad.version && (
          <div className="text-xs text-[#8E8E93] mb-1 font-[family-name:var(--font-manrope)]">
            {ad.version}
          </div>
        )}
        <div className="text-base font-bold text-[#111111] mb-1 font-[family-name:var(--font-manrope)]">
          {formatPrice(ad.price)} сомони
        </div>
        {characteristics && (
          <div className="text-xs text-[#8E8E93] line-clamp-1 font-[family-name:var(--font-manrope)]">
            {characteristics}
          </div>
        )}
      </div>
    </article>
  );
});
