"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { AutoTojLogo } from "@/components/brand/AutoTojLogo";
import { MobileSearchBar } from "@/components/search/MobileSearchBar";
import { PullToRefreshIndicator } from "@/components/search/PullToRefreshIndicator";
import { AdsGrid } from "@/components/cards/AdsGrid";
import { PageStateRenderer } from "@/components/states/PageStateRenderer";
import { FilterSheet } from "@/components/filters/FilterSheet";
import { DesktopFilterPanel } from "@/components/filters/DesktopFilterPanel";
import { useFavorites } from "@/hooks/useFavorites";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useFilteredAds } from "@/hooks/useFilteredAds";
import { getAllAds } from "@/lib/data/mockAds";
import type { FilterState } from "@/components/filters/FilterSheet";
import type { Ad } from "@/lib/data/mockAds";

type PageState = "default" | "loading" | "empty" | "error" | "offline";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pageState, setPageState] = useState<PageState>("default");
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [ads] = useState<Ad[]>(getAllAds);

  const { toggleFavorite } = useFavorites();
  const filteredAds = useFilteredAds({ ads, searchQuery });

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 1000));
  }, []);

  const { pullDistance, isRefreshing, scrollRef, touchHandlers } =
    usePullToRefresh({ onRefresh: handleRefresh });

  const handleAdClick = useCallback(
    (id: string) => router.push(`/ad/${id}`),
    [router]
  );

  const handleFilterApply = useCallback((filters: FilterState) => {
    const isActive = Object.values(filters).some(
      (v) => v !== undefined && v !== false && v !== "" && v !== null
    );
    setHasActiveFilters(isActive);
    setIsFilterOpen(false);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setHasActiveFilters(false);
  }, []);

  const handleRetry = useCallback(() => {
    setPageState("loading");
    setTimeout(() => setPageState("default"), 1000);
  }, []);

  return (
    <div
      className="pb-20 lg:pb-8 bg-white"
      ref={scrollRef}
      {...touchHandlers}
    >
      {/* Mobile Floating Search */}
      <MobileSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setIsFilterOpen(true)}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Mobile Logo */}
      <div className="lg:hidden flex justify-center px-4 mt-6">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <AutoTojLogo size="lg" />
          </div>
          <p className="text-sm text-[#8E8E93] mt-1.5 font-[family-name:var(--font-manrope)]">
            Покупка, продажа и сервисы
          </p>
        </div>
      </div>

      {/* Pull-to-Refresh (mobile) */}
      <PullToRefreshIndicator
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
      />

      {/* Desktop Logo & Subtitle */}
      <div className="hidden lg:block">
        <div className="max-w-[1440px] mx-auto px-6 pt-6 pb-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <AutoTojLogo size="lg" className="text-4xl" />
          </div>
          <p className="text-[15px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
            Покупка, продажа и сервисы автомобилей
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto lg:px-6 lg:py-6">
        <PageStateRenderer
          state={pageState}
          isEmpty={filteredAds.length === 0}
          onRetry={handleRetry}
          onReset={handleResetFilters}
          emptyIcon={Search}
          emptyTitle="Ничего не найдено"
          emptyDescription="Попробуйте изменить параметры поиска"
          emptyActionLabel="Сбросить"
        >
          <AdsGrid
            ads={filteredAds}
            onFavoriteToggle={toggleFavorite}
            onAdClick={handleAdClick}
          />
        </PageStateRenderer>
      </div>

      {/* Mobile Filter Sheet */}
      {isFilterOpen && (
        <div className="lg:hidden">
          <FilterSheet
            onClose={() => setIsFilterOpen(false)}
            onApply={handleFilterApply}
          />
        </div>
      )}

      {/* Desktop Filter Panel */}
      {isFilterOpen && (
        <div className="hidden lg:block">
          <DesktopFilterPanel
            onClose={() => setIsFilterOpen(false)}
            onApply={handleFilterApply}
          />
        </div>
      )}
    </div>
  );
}
