"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { AdCard } from "@/components/cards/AdCard";
import { EmptyState } from "@/components/states/EmptyState";
import { PageHeader } from "@/components/layout/page-header";
import { SkeletonGrid } from "@/components/layout/skeleton-grid";
import { ContentGrid } from "@/components/layout/content-grid";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "@/lib/features/favorites/favoritesApi";
import { mapAdListItemToAd } from "@/lib/utils/map-ad";

export default function FavoritesPage() {
  const router = useRouter();
  const { data: apiData, isLoading } = useGetFavoritesQuery();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const favorites = apiData?.ads.map(mapAdListItemToAd) ?? [];

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

  const countLabel =
    favorites.length === 1 ? "объявление" : "объявлений";

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
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
      </div>

      {/* ── Mobile Header ── */}
      <PageHeader
        title="Избранное"
        rightAction={
          favorites.length > 0 ? (
            <span className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              {favorites.length}
            </span>
          ) : undefined
        }
      />

      {/* ── Mobile Grid ── */}
      <div className="lg:hidden px-4 py-4 pb-6">
        {isLoading ? (
          <ContentGrid mobileCols={2}>
            <SkeletonGrid count={6} />
          </ContentGrid>
        ) : favorites.length > 0 ? (
          <ContentGrid mobileCols={2}>
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
            title="Нет избранных"
            description="Добавляйте объявления в избранное, чтобы не потерять их"
            action={{
              label: "К объявлениям",
              onClick: () => router.push("/"),
            }}
          />
        )}
      </div>
    </main>
  );
}
