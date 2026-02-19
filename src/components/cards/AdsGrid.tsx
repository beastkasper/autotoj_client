"use client";

import React from "react";
import { AdCard, type Ad } from "@/components/cards/AdCard";

interface AdsGridProps {
  ads: Ad[];
  onFavoriteToggle: (id: string) => void;
  onAdClick: (id: string) => void;
  /** Desktop columns (default: 4) */
  desktopCols?: number;
  /** Mobile columns (default: 2) */
  mobileCols?: number;
}

export const AdsGrid = React.memo(function AdsGrid({
  ads,
  onFavoriteToggle,
  onAdClick,
  desktopCols = 4,
  mobileCols = 2,
}: AdsGridProps) {
  const desktopGridCls =
    desktopCols === 4 ? "lg:grid-cols-4" : `lg:grid-cols-${desktopCols}`;

  return (
    <>
      {/* Desktop */}
      <div className={`hidden lg:grid ${desktopGridCls} gap-5`}>
        {ads.map((ad) => (
          <AdCard
            key={ad.id}
            ad={ad}
            variant="grid"
            onFavoriteToggle={onFavoriteToggle}
            onClick={onAdClick}
          />
        ))}
      </div>

      {/* Mobile */}
      <div className={`lg:hidden grid grid-cols-${mobileCols} gap-3 px-4 mt-8`}>
        {ads.map((ad) => (
          <AdCard
            key={ad.id}
            ad={ad}
            variant="grid"
            onFavoriteToggle={onFavoriteToggle}
            onClick={onAdClick}
          />
        ))}
      </div>
    </>
  );
});
