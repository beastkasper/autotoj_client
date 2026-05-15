"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
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
import type { AdsSearchParams } from "@/lib/types/api";

type PageState = "default" | "loading" | "empty" | "error" | "offline";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [filterParams, setFilterParams] = useState<AdsSearchParams>({});

  const queryParams: AdsSearchParams = useMemo(
    () => ({ ...filterParams, ...(searchQuery ? { q: searchQuery } : {}) }),
    [filterParams, searchQuery]
  );

  // RTK Query — fetch from backend API
  const { data: apiData, isLoading, isError, refetch } = useGetAdsQuery(queryParams);

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
    await refetch();
  }, [refetch]);

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
    const params: AdsSearchParams = {};
    if (filters.brand) params.brand_id = filters.brand;
    if (filters.yearFrom) params.year_from = Number(filters.yearFrom);
    if (filters.yearTo) params.year_to = Number(filters.yearTo);
    if (filters.priceFrom) params.price_from = Number(filters.priceFrom);
    if (filters.priceTo) params.price_to = Number(filters.priceTo);
    if (filters.fuel) params.fuel = filters.fuel;
    if (filters.transmission) params.transmission = filters.transmission;
    if (filters.drive) params.drive = filters.drive;
    if (filters.bodyType) params.body = filters.bodyType;
    setFilterParams(params);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setHasActiveFilters(false);
    setFilterParams({});
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

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

      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </main>
  );
}
