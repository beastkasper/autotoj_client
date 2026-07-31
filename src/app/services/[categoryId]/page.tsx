"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, ChevronLeft, Star, BadgeCheck, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/search/search-input";
import { EmptyState } from "@/components/states/EmptyState";
import {
  useGetServiceProvidersQuery,
  useGetServiceCategoriesQuery,
} from "@/lib/features/services/servicesApi";
import { ServiceProvidersSkeleton } from "@/components/skeletons/services-skeleton";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { usePagedParams } from "@/hooks/usePagedParams";

const SORT_OPTIONS = [
  { value: "rating", label: "По рейтингу" },
  { value: "reviews", label: "По отзывам" },
  { value: "name", label: "По названию" },
] as const;

export default function ServiceProvidersPage() {
  const router = useRouter();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  // Get category name
  const { data: categories } = useGetServiceCategoriesQuery();
  const categoryName = useMemo(
    () => categories?.find((c) => c.id === categoryId)?.name ?? "Сервисы",
    [categories, categoryId]
  );

  // Fetch providers
  const baseParams = useMemo(() => {
    const p: { category_id: string; q?: string; sort?: string } = {
      category_id: categoryId,
    };
    if (searchQuery) p.q = searchQuery;
    if (sortBy) p.sort = sortBy;
    return p;
  }, [categoryId, searchQuery, sortBy]);

  const { params: queryParams, page, setPage } = usePagedParams(baseParams);
  const { data: providersData, isLoading, isFetching } =
    useGetServiceProvidersQuery(queryParams);
  const providers = providersData?.providers ?? [];
  const isLoadingMore = isFetching && !isLoading;
  const hasMore = providersData?.has_more ?? false;

  const handleProviderClick = useCallback(
    (id: string) => router.push(`/services/provider/${id}`),
    [router]
  );

  return (
    <div className="screen lg:min-h-screen lg:bg-[#F5F5F7]">
      {/* ── Desktop Filter Bar ── */}
      <div className="hidden lg:block sticky top-[65px] z-20 bg-white border-b border-[#E5E5E7]">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/services")}
              className="flex items-center gap-1 text-[15px] text-[#8E8E93] hover:text-[#111111] transition-colors font-[family-name:var(--font-manrope)]"
            >
              <ChevronLeft className="w-4 h-4" />
              Назад
            </button>
            <h2 className="text-[20px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
              {categoryName}
            </h2>
            <div className="flex-1 max-w-sm ml-auto">
              <div className="flex items-center gap-2 bg-[#F5F5F7] rounded-xl px-4 h-10">
                <Search className="w-5 h-5 text-[#8E8E93] shrink-0" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск..."
                  className="flex-1 bg-transparent border-none shadow-none text-[15px] text-[#111111] placeholder:text-[#8E8E93] focus-visible:ring-0 font-[family-name:var(--font-manrope)] h-10 px-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 hover:bg-[#E5E5E7] rounded-lg transition-colors"
                  >
                    <span className="text-[#8E8E93] text-xs">✕</span>
                  </button>
                )}
              </div>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 h-10 bg-[#F5F5F7] border-none rounded-xl text-[15px] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] cursor-pointer font-[family-name:var(--font-manrope)]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-3 text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
            Найдено {providers.length} компаний
          </p>
        </div>
      </div>

      {/* ── Mobile Header ── */}
      <PageHeader title={categoryName} onBack={() => router.push("/services")} />

      {/* ── Mobile Search ── */}
      <div className="px-4 py-3 lg:hidden">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск"
          variant="mobile"
        />
        <div className="scroll-x -mx-4 mt-3 flex gap-2 px-4">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={sortBy === opt.value}
              onClick={() => setSortBy(opt.value)}
              className="chip shrink-0"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading ── */}
      {isLoading && <ServiceProvidersSkeleton />}

      {/* ── Providers List ── */}
      {!isLoading && providers.length > 0 && (
        <>
          {/* Desktop */}
          <div className="hidden lg:block max-w-[1440px] mx-auto px-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleProviderClick(provider.id)}
                  className="bg-white rounded-2xl p-5 text-left hover:shadow-lg transition-all group"
                >
                  <div className="flex gap-4">
                    {provider.logo_url ? (
                      <img
                        src={provider.logo_url}
                        alt={provider.name}
                        className="w-16 h-16 rounded-xl object-cover bg-[#F5F5F7] shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#F5F5F7] flex items-center justify-center shrink-0">
                        <span className="text-2xl text-[#C7C7CC]">🔧</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[17px] font-semibold text-[#111111] truncate font-[family-name:var(--font-manrope)]">
                          {provider.name}
                        </h3>
                        {provider.is_verified && (
                          <BadgeCheck className="w-5 h-5 text-[#007AFF] shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#FF9500] fill-[#FF9500]" />
                          <span className="text-[14px] font-medium text-[#111111] font-[family-name:var(--font-manrope)]">
                            {provider.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                          {provider.reviews_count} отзывов
                        </span>
                      </div>
                      {provider.address && (
                        <div className="flex items-center gap-1 mt-2">
                          <MapPin className="w-4 h-4 text-[#8E8E93] shrink-0" />
                          <span className="text-[13px] text-[#8E8E93] truncate font-[family-name:var(--font-manrope)]">
                            {provider.city}, {provider.address}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="w-4 h-4 text-[#8E8E93] shrink-0" />
                        <span className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                          {provider.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <LoadMoreButton
              hasMore={hasMore}
              isLoading={isLoadingMore}
              onClick={() => setPage(page + 1)}
            />
          </div>

          {/* Mobile + Tablet */}
          <div className="px-4 lg:hidden">
            <div className="flex flex-col gap-3">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderClick(provider.id)}
                className="press-card w-full rounded-2xl border border-border-soft bg-card p-4 text-left shadow-[var(--shadow-icon-card)] transition-transform"
              >
                <div className="flex gap-3">
                  {provider.logo_url ? (
                    <img
                      src={provider.logo_url}
                      alt={provider.name}
                      className="size-20 shrink-0 rounded-xl bg-secondary object-cover"
                    />
                  ) : (
                    <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-secondary">
                      <span className="text-xl">🔧</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="line-1 text-[17px] font-semibold text-foreground">
                        {provider.name}
                      </h3>
                      {provider.is_verified && (
                        <BadgeCheck className="w-4 h-4 text-[#007AFF] shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Star className="size-4 fill-star text-star" />
                      <span className="text-[14px] font-medium text-foreground">
                        {provider.rating.toFixed(1)}
                      </span>
                      <span className="text-[13px] text-muted-foreground">
                        ({provider.reviews_count} отзывов)
                      </span>
                    </div>
                    {provider.address && (
                      <p className="line-1 mt-2 text-[13px] text-muted-foreground">
                        {provider.city}, {provider.address}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
            </div>
            <LoadMoreButton
              hasMore={hasMore}
              isLoading={isLoadingMore}
              onClick={() => setPage(page + 1)}
            />
          </div>
        </>
      )}

      {/* ── Empty ── */}
      {!isLoading && providers.length === 0 && (
        <EmptyState
          icon={Search}
          title="Ничего не найдено"
          description="Попробуйте изменить параметры поиска"
        />
      )}
    </div>
  );
}
