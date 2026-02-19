"use client";

import { useMemo } from "react";
import type { Ad } from "@/lib/data/mockAds";

interface UseFilteredAdsOptions {
  ads: Ad[];
  searchQuery: string;
}

export function useFilteredAds({ ads, searchQuery }: UseFilteredAdsOptions) {
  const filteredAds = useMemo(() => {
    if (!searchQuery.trim()) return ads;
    const q = searchQuery.toLowerCase();
    return ads.filter(
      (ad) =>
        (ad.brand && ad.brand.toLowerCase().includes(q)) ||
        (ad.model && ad.model.toLowerCase().includes(q)) ||
        (ad.version && ad.version.toLowerCase().includes(q))
    );
  }, [ads, searchQuery]);

  return filteredAds;
}
