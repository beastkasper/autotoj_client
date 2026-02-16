"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { AdCard, type Ad } from "@/components/cards/AdCard";
import { LoadingState } from "@/components/states/LoadingState";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { FilterSheet } from "@/components/filters/FilterSheet";
import { DesktopFilterPanel } from "@/components/filters/DesktopFilterPanel";
import { AutoTojLogo } from "@/components/brand/AutoTojLogo";
import { getAllAds } from "@/lib/data/mockAds";
import type { FilterState } from "@/components/filters/FilterSheet";

type PageState = "default" | "loading" | "empty" | "error" | "offline";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pageState, setPageState] = useState<PageState>("default");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ─── Handlers ──────────────────────────────────────────────

  const handleFavoriteToggle = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdClick = (id: string) => {
    router.push(`/ad/${id}`);
  };

  const handleFilterApply = (filters: FilterState) => {
    console.log("Filters applied:", filters);
    const isActive = Object.values(filters).some(
      (v) => v !== undefined && v !== false && v !== "" && v !== null
    );
    setHasActiveFilters(isActive);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setHasActiveFilters(false);
  };

  const handleRetry = () => {
    setPageState("loading");
    setTimeout(() => setPageState("default"), 1000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setPullDistance(0);
    }, 1000);
  };

  // ─── Pull-to-refresh (mobile) ─────────────────────────────

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollContainerRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (scrollContainerRef.current?.scrollTop === 0 && !isRefreshing) {
      const distance = Math.max(
        0,
        Math.min(e.touches[0].clientY - touchStartY.current, 80)
      );
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60 && !isRefreshing) handleRefresh();
    else setPullDistance(0);
  };

  const handleNavigate = (page: string) => {
    console.log("Navigate:", page);
  };

  // ─── Data ─────────────────────────────────────────────────

  const [ads] = useState<Ad[]>(getAllAds);

  const filteredAds = ads
    .map((ad) => ({ ...ad, isFavorite: favorites.has(ad.id) }))
    .filter((ad) => {
      const q = searchQuery.toLowerCase();
      return (
        (ad.brand && ad.brand.toLowerCase().includes(q)) ||
        (ad.model && ad.model.toLowerCase().includes(q)) ||
        (ad.title && ad.title.toLowerCase().includes(q)) ||
        (ad.version && ad.version.toLowerCase().includes(q))
      );
    });

  // ─── Render ───────────────────────────────────────────────

  return (
    <div
      className="pb-20 lg:pb-8 bg-white"
      ref={scrollContainerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ──────── Mobile Floating Search ──────── */}
      <div className="lg:hidden sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
        <div className="px-4 py-3">
          <div className="bg-white rounded-[28px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-3 flex items-center gap-3">
            {/* Search input */}
            <div className="flex-1 bg-[#F2F2F7] rounded-[20px] px-3 h-10 flex items-center gap-2">
              <Search className="size-[18px] text-[#111111] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск автомобилей"
                className="flex-1 bg-transparent text-sm text-[#111111] placeholder:text-[#8E8E93] focus:outline-none font-[family-name:var(--font-manrope)]"
              />
            </div>
            {/* Filter button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`size-10 rounded-[20px] flex items-center justify-center transition-all active:scale-95 shrink-0 ${
                hasActiveFilters
                  ? "bg-[#111111] text-white"
                  : "bg-[#F2F2F7] text-[#111111]"
              }`}
            >
              <SlidersHorizontal className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ──────── Mobile Logo ──────── */}
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

      {/* ──────── Pull-to-Refresh indicator (mobile) ──────── */}
      {pullDistance > 0 && (
        <div
          className="lg:hidden flex justify-center items-center transition-all"
          style={{ height: `${pullDistance}px`, opacity: pullDistance / 80 }}
        >
          <RefreshCw
            className={`size-5 text-[#111111] ${isRefreshing ? "animate-spin" : ""}`}
            style={{ transform: `rotate(${pullDistance * 4}deg)` }}
          />
        </div>
      )}

      {/* ──────── Desktop Logo & Subtitle ──────── */}
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

      {/* ──────── Desktop Grid ──────── */}
      <div className="hidden lg:block">
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          {pageState === "loading" && <LoadingState />}
          {pageState === "error" && (
            <ErrorState type="error" onRetry={handleRetry} />
          )}
          {pageState === "offline" && (
            <ErrorState type="offline" onRetry={handleRetry} />
          )}
          {pageState === "default" && filteredAds.length === 0 && (
            <EmptyState
              icon={Search}
              title="Ничего не найдено"
              description="Попробуйте изменить параметры поиска"
              action={{ label: "Сбросить", onClick: handleResetFilters }}
            />
          )}
          {pageState === "default" && filteredAds.length > 0 && (
            <div className="grid grid-cols-4 gap-5">
              {filteredAds.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  variant="grid"
                  onFavoriteToggle={handleFavoriteToggle}
                  onClick={handleAdClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ──────── Mobile Grid ──────── */}
      {pageState === "default" && filteredAds.length > 0 && (
        <div className="lg:hidden grid grid-cols-2 gap-3 px-4 mt-8">
          {filteredAds.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              variant="grid"
              onFavoriteToggle={handleFavoriteToggle}
              onClick={handleAdClick}
            />
          ))}
        </div>
      )}

      {/* ──────── Mobile States ──────── */}
      <div className="lg:hidden">
        {pageState === "loading" && <LoadingState />}
        {pageState === "error" && (
          <ErrorState type="error" onRetry={handleRetry} />
        )}
        {pageState === "offline" && (
          <ErrorState type="offline" onRetry={handleRetry} />
        )}
        {pageState === "default" && filteredAds.length === 0 && (
          <EmptyState
            icon={Search}
            title="Ничего не найдено"
            description="Попробуйте изменить параметры поиска или фильтры"
            action={{ label: "Сбросить фильтры", onClick: handleResetFilters }}
          />
        )}
      </div>

      {/* ──────── Mobile Filter Sheet ──────── */}
      {isFilterOpen && (
        <div className="lg:hidden">
          <FilterSheet
            onClose={() => setIsFilterOpen(false)}
            onApply={handleFilterApply}
          />
        </div>
      )}

      {/* ──────── Desktop Filter Panel ──────── */}
      {isFilterOpen && (
        <div className="hidden lg:block">
          <DesktopFilterPanel
            onClose={() => setIsFilterOpen(false)}
            onApply={handleFilterApply}
          />
        </div>
      )}

      {/* ──────── Desktop Footer ──────── */}

    </div>
  );
}
