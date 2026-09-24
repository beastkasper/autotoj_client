"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlateCard } from "@/components/cards/PlateCard";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { PlateAddForm } from "@/components/plates/plate-add-form";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/search/search-input";
import { FilterChip } from "@/components/search/filter-chip";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { SuccessToast } from "@/components/ui/success-toast";
import { useAuth } from "@/hooks/useAuth";
import { GridPageSkeleton } from "@/components/skeletons/grid-page-skeleton";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { usePagedParams } from "@/hooks/usePagedParams";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useGetPlatesQuery } from "@/lib/features/plates/platesApi";
import { pluralize, WORD_PLATES } from "@/lib/utils/plural";
import {
  PLATE_CATEGORIES,
  PLATE_REGION_LABELS,
  type PlateCategory,
  type PlateListing,
  type PlatesSearchParams,
} from "@/lib/types/plate";

export default function PlatesPage() {
  const router = useRouter();
  const { requireAuth, showAuthModal, closeAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  // Поиск с задержкой: иначе запрос уходит на каждое нажатие клавиши.
  const debouncedSearch = useDebouncedValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<PlateCategory | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [justPublished, setJustPublished] = useState(false);

  // RTK Query — fetch from backend
  const baseParams: PlatesSearchParams = useMemo(() => {
    const p: PlatesSearchParams = {};
    if (debouncedSearch) p.q = debouncedSearch;
    if (selectedCategory) p.category = selectedCategory;
    return p;
  }, [debouncedSearch, selectedCategory]);

  const { params: queryParams, page, setPage } = usePagedParams(baseParams);
  const { data: apiData, isLoading, isFetching, error, refetch } = useGetPlatesQuery(queryParams);
  const isLoadingMore = isFetching && !isLoading;
  const hasMore = apiData?.has_more ?? false;

  const plates: PlateListing[] = useMemo(() => {
    if (!apiData?.plates) return [];
    return apiData.plates.map((plate) => ({
      id: plate.id,
      plateNumber: plate.plate_number,
      region: PLATE_REGION_LABELS[plate.region_code] ?? plate.region,
      regionCode: plate.region_code,
      category: plate.category,
      price: plate.price,
      isVip: plate.is_vip,
      views: plate.views_count,
      publishedDate: plate.created_at,
    }));
  }, [apiData]);

  const handleAddSuccess = useCallback(() => {
    setShowAddForm(false);
    setJustPublished(true);
  }, []);

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== null;

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(null);
  }, []);

  const handlePlateClick = useCallback(
    (id: string) => router.push(`/plates/${id}`),
    [router],
  );

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      {/* ── Desktop Filter Bar (sticky) ── */}
      <div className="hidden lg:block sticky top-[65px] z-20 bg-white border-b border-[#E5E5E7]">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          {/* Row 1: search + add button */}
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-sm">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Поиск номеров (777, 001...)"
              />
            </div>

            <Button
              onClick={() => requireAuth(() => setShowAddForm(true))}
              className="h-10 shrink-0 bg-[#E53935] text-white rounded-xl hover:bg-[#D32F2F] font-medium text-[15px] ml-auto font-[family-name:var(--font-manrope)]"
            >
              <Plus className="w-5 h-5" />
              Добавить
            </Button>
          </div>

          {/* Row 2: category filter chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <FilterChip
              label="Все"
              isActive={selectedCategory === null}
              onClick={() => setSelectedCategory(null)}
            />
            {PLATE_CATEGORIES.map((cat) => (
              <FilterChip
                key={cat.id}
                label={cat.label}
                isActive={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              Найдено {pluralize(apiData?.total ?? plates.length, WORD_PLATES)}
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[14px] text-[#E53935] hover:text-[#D32F2F] font-medium font-[family-name:var(--font-manrope)] transition-colors"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop Grid ── */}
      <div className="hidden lg:block max-w-[1440px] mx-auto px-6 py-6">
        {isLoading ? (
          <GridPageSkeleton />
        ) : error ? (
          <ErrorState
            type="error"
            title="Не удалось загрузить номера"
            description={getApiErrorMessage(error)}
            onRetry={() => refetch()}
          />
        ) : plates.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {plates.map((plate) => (
              <PlateCard key={plate.id} plate={plate} onClick={handlePlateClick} variant="desktop" />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="Ничего не найдено"
            description="Попробуйте изменить параметры поиска"
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

      {/* ── Mobile Header ── */}
      <PageHeader
        title="Гос. номера"
        rightAction={
          <button
            onClick={() => requireAuth(() => setShowAddForm(true))}
            aria-label="Добавить номер"
            className="flex items-center gap-1 h-9 px-3 bg-[#E53935] text-white rounded-lg hover:bg-[#D32F2F] active:scale-95 transition-all font-[family-name:var(--font-manrope)]"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[14px] font-medium">Добавить</span>
          </button>
        }
      />

      {/* ── Mobile Search + Filters ── */}
      <div className="lg:hidden px-4 pt-4 pb-2 space-y-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск номеров (777, 001...)"
          variant="mobile"
        />

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          <FilterChip
            label="Все"
            isActive={selectedCategory === null}
            onClick={() => setSelectedCategory(null)}
            variant="mobile"
          />
          {PLATE_CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.id}
              label={cat.label}
              isActive={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              variant="mobile"
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
            Найдено {pluralize(apiData?.total ?? plates.length, WORD_PLATES)}
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[13px] text-[#E53935] font-medium font-[family-name:var(--font-manrope)]"
            >
              Сбросить
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile + Tablet Grid ── */}
      <div className="lg:hidden px-4 md:px-6 pb-24">
        {isLoading ? (
          <GridPageSkeleton count={6} />
        ) : error ? (
          <ErrorState
            type="error"
            title="Не удалось загрузить номера"
            description={getApiErrorMessage(error)}
            onRetry={() => refetch()}
          />
        ) : plates.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {plates.map((plate) => (
              <PlateCard key={plate.id} plate={plate} onClick={handlePlateClick} variant="mobile" />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="Ничего не найдено"
            description="Попробуйте изменить параметры поиска"
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

      {/* ── Add Form Overlay ── */}
      {showAddForm && (
        <PlateAddForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />

      <SuccessToast
        open={justPublished}
        onClose={() => setJustPublished(false)}
        title="Номер отправлен на модерацию"
        description="После проверки он появится в разделе «Гос. номера»."
      />
    </main>
  );
}
