"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { AdCard } from "@/components/cards/AdCard";
import { EmptyState } from "@/components/states/EmptyState";
import { PageHeader } from "@/components/layout/page-header";
import { SkeletonGrid } from "@/components/layout/skeleton-grid";
import { ContentGrid } from "@/components/layout/content-grid";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { usePagedParams } from "@/hooks/usePagedParams";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "@/lib/features/favorites/favoritesApi";
import { mapAdListItemToAd } from "@/lib/utils/map-ad";

export default function FavoritesPage() {
  const router = useRouter();
  const baseParams = useMemo(() => ({}), []);
  const { params: queryParams, page, setPage } = usePagedParams(baseParams);
  const { data: apiData, isLoading, isFetching } = useGetFavoritesQuery(queryParams);
  const [removeFavorite] = useRemoveFavoriteMutation();

  const favorites = apiData?.ads.map(mapAdListItemToAd) ?? [];
  const isLoadingMore = isFetching && !isLoading;
  const hasMore = apiData?.has_more ?? false;

  const handleAdClick = useCallback(
    (id: string) => router.push(`/ad/${id}`),
    [router],
  );

  const handleFavoriteToggle = useCallback(
    (id: string) => {
      removeFavorite(id);
    },
    [removeFavorite],
  );

  // Склонение: 1 → объявление, 2–4 → объявления, 5+ → объявлений (§10.15)
  const countLabel = (() => {
    const n = favorites.length % 100;
    if (n > 10 && n < 20) return "объявлений";
    const d = n % 10;
    if (d === 1) return "объявление";
    if (d >= 2 && d <= 4) return "объявления";
    return "объявлений";
  })();

  return (
    <main className="screen lg:min-h-screen lg:bg-[#F5F5F7]">
      {/* ── Desktop Header Bar (sticky) ── */}
      <div className="hidden lg:block sticky top-[65px] z-20 bg-white border-b border-[#E5E5E7]">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
              Избранное
            </h1>
            {favorites.length > 0 && (
              <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                {favorites.length} {countLabel}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop Grid ── */}
      <div className="hidden lg:block max-w-[1440px] mx-auto px-6 py-6">
        {isLoading ? (
          <ContentGrid desktopCols={4} mobileCols={2}>
            <SkeletonGrid count={8} />
          </ContentGrid>
        ) : favorites.length > 0 ? (
          <ContentGrid desktopCols={4} mobileCols={2}>
            {favorites.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                variant="grid"
                onFavoriteToggle={handleFavoriteToggle}
                onClick={handleAdClick}
              />
            ))}
          </ContentGrid>
        ) : (
          <EmptyState
            icon={Heart}
            title="Нет избранных объявлений"
            description="Добавляйте объявления в избранное, чтобы не потерять их"
            action={{
              label: "Перейти к объявлениям",
              onClick: () => router.push("/"),
            }}
          />
        )}
        {!isLoading && (
          <LoadMoreButton
            hasMore={hasMore}
            isLoading={isLoadingMore}
            onClick={() => setPage(page + 1)}
          />
        )}
      </div>

      {/* ── Шапка (§10.15): «Избранное» 24/600 + «N объявлений» ── */}
      <PageHeader
        title="Избранное"
        variant="large"
        titleClass="text-[24px] leading-[30px]"
        subtitle={
          favorites.length > 0
            ? `${favorites.length} ${countLabel}`
            : undefined
        }
      />

      {/* ── Список: карточки list-варианта, padding 16, gap 12 (§10.15) ── */}
      <div className="flex flex-col gap-3 p-4 lg:hidden">
        {isLoading ? (
          <SkeletonGrid count={4} variant="list" />
        ) : favorites.length > 0 ? (
          favorites.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              variant="list"
              isFavorite
              onFavoriteToggle={handleFavoriteToggle}
              onClick={handleAdClick}
            />
          ))
        ) : (
          <EmptyState
            icon={Heart}
            title="Нет избранных объявлений"
            description="Добавляйте объявления в избранное, чтобы не потерять их"
            action={{
              label: "К поиску",
              onClick: () => router.push("/"),
            }}
          />
        )}
        {!isLoading && (
          <LoadMoreButton
            hasMore={hasMore}
            isLoading={isLoadingMore}
            onClick={() => setPage(page + 1)}
          />
        )}
      </div>
    </main>
  );
}
