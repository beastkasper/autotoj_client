"use client";

import React from "react";
import { AdCard, type Ad } from "@/components/cards/AdCard";

interface AdsGridProps {
  ads: Ad[];
  onFavoriteToggle: (id: string) => void;
  onAdClick: (id: string) => void;
  /** Desktop columns (default: 4) */
  desktopCols?: 2 | 3 | 4;
}

const DESKTOP_COLS = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
} as const;

export const AdsGrid = React.memo(function AdsGrid({
  ads,
  onFavoriteToggle,
  onAdClick,
  desktopCols = 4,
}: AdsGridProps) {
  const cards = ads.map((ad) => (
    <AdCard
      key={ad.id}
      ad={ad}
      variant="grid"
      onFavoriteToggle={onFavoriteToggle}
      onClick={onAdClick}
    />
  ));

  return (
    <>
      {/* Desktop */}
      <div className={`hidden gap-5 lg:grid ${DESKTOP_COLS[desktopCols]}`}>
        {cards}
      </div>

      {/* Мобилка: 2 колонки, gap 12, px 16 (§10.1) */}
      <div className="grid grid-cols-2 gap-3 px-4 lg:hidden">{cards}</div>
    </>
  );
});
