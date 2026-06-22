"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  setSearchQuery,
  setFilters,
  setPage,
  resetAdsFilters,
  selectAdsSearchQuery,
  selectAdsQueryParams,
  selectAdsPage,
  selectHasActiveFilters,
  selectAdsFilterState,
} from "@/lib/features/ads/adsFiltersSlice";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutoTojLogo } from "@/components/brand/AutoTojLogo";
import { MobileSearchBar } from "@/components/search/MobileSearchBar";
import { PullToRefreshIndicator } from "@/components/search/PullToRefreshIndicator";
import { AdsGrid } from "@/components/cards/AdsGrid";
import { PageStateRenderer } from "@/components/states/PageStateRenderer";
import { FilterSheet } from "@/components/filters/FilterSheet";
import { useFavorites } from "@/hooks/useFavorites";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useAuth } from "@/hooks/useAuth";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { useGetAdsQuery } from "@/lib/features/ads/adsApi";
import type { FilterState } from "@/components/filters/FilterSheet";
import type { Ad } from "@/lib/types/ad";

type PageState = "default" | "loading" | "empty" | "error" | "offline";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectAdsSearchQuery);
  const queryParams = useAppSelector(selectAdsQueryParams);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);
  const filterState = useAppSelector(selectAdsFilterState);
  const page = useAppSelector(selectAdsPage);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // RTK Query — fetch from backend API
  const { data: apiData, isLoading, isFetching, isError, refetch } =
    useGetAdsQuery(queryParams);

  const displayAds: Ad[] = useMemo(() => {
    if (!apiData?.ads) return [];
    return apiData.ads.map((ad) => ({
      id: ad.id,
      brand: ad.brand,
      model: ad.model,
      version: undefined,
      price: ad.price,
      category: "cars" as const,
      year: ad.year,
      mileage: ad.mileage,
      engineType: ad.fuel,
      transmission: ad.transmission,
      driveType: ad.drive,
      location: ad.location,
      publishedDate: ad.created_at,
      image: ad.photos[0] ?? "",
      bodyType: ad.body,
      color: ad.color,
      condition: ad.condition,
      engineVolume: ad.engine_volume ? `${ad.engine_volume}L` : undefined,
      sellerName: ad.seller.name,
      sellerType: (ad.seller.type === "business" ? "dealer" : ad.seller.type ?? "private") as "private" | "dealer",
      sellerAdsCount: ad.seller.ads_count ?? 0,
      description: undefined,
      equipment: undefined,
      vehicleStatus: "В наличии" as const,
      statusNew: ad.condition === "Новый",
      statusOnOrder: false,
      owners: undefined,
      isCustomsCleared: undefined,
    } satisfies Ad));
  }, [apiData]);

  const pageState: PageState = isLoading ? "loading" : isError ? "error" : "default";

  const { toggleFavorite } = useFavorites();
  const { requireAuth, showAuthModal, closeAuthModal } = useAuth();

  const handleFavoriteToggle = useCallback(
    (id: string) => {
      requireAuth(() => toggleFavorite(id));
    },
    [requireAuth, toggleFavorite],
  );

  const handleRefresh = useCallback(async () => {
    // Collapse back to the first page, then refetch from the top.
    dispatch(setPage(1));
    await refetch();
  }, [dispatch, refetch]);

  const { pullDistance, isRefreshing, scrollRef, touchHandlers } =
    usePullToRefresh({ onRefresh: handleRefresh });

  const handleAdClick = useCallback(
    (id: string) => router.push(`/ad/${id}`),
    [router]
  );

  const handleFilterApply = useCallback(
    (filters: FilterState) => {
      setIsFilterOpen(false);
      dispatch(setFilters(filters));
    },
    [dispatch]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetAdsFilters());
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    dispatch(setPage(page + 1));
  }, [dispatch, page]);

  const hasMore = apiData?.has_more ?? false;
  const isLoadingMore = isFetching && !isLoading;

  return (
    <main
      className="pb-24 lg:pb-8 bg-white"
      ref={scrollRef}
      {...touchHandlers}
    >
      <h1 className="sr-only">autoTOJ — покупка, продажа и сервисы автомобилей в Таджикистане</h1>

      {/* Mobile Floating Search */}
      <MobileSearchBar
        searchQuery={searchQuery}
        onSearchChange={(value) => dispatch(setSearchQuery(value))}
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
          isEmpty={displayAds.length === 0}
          onRetry={handleRetry}
          onReset={handleResetFilters}
          emptyIcon={Search}
          emptyTitle="Ничего не найдено"
          emptyDescription="Попробуйте изменить параметры поиска"
          emptyActionLabel="Сбросить"
        >
          <AdsGrid
            ads={displayAds}
            onFavoriteToggle={handleFavoriteToggle}
            onAdClick={handleAdClick}
          />
        </PageStateRenderer>

        {pageState === "default" && hasMore && displayAds.length > 0 && (
          <div className="flex justify-center px-4 py-8 lg:px-0">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="min-w-[220px] rounded-xl border-[#E5E5E7] text-[15px] font-medium font-[family-name:var(--font-manrope)]"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                "Показать ещё"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Filter Sheet */}
      {isFilterOpen && (
        <div className="lg:hidden">
          <FilterSheet
            onClose={() => setIsFilterOpen(false)}
            onApply={handleFilterApply}
            activeFilters={filterState}
          />
        </div>
      )}

      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </main>
  );
}
