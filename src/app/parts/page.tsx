"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PartCard } from "@/components/cards/PartCard";
import { EmptyState } from "@/components/states/EmptyState";
import { PageHeader } from "@/components/layout/page-header";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { useAuth } from "@/hooks/useAuth";
import { GridPageSkeleton } from "@/components/skeletons/grid-page-skeleton";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { usePagedParams } from "@/hooks/usePagedParams";
import { useGetPartsQuery } from "@/lib/features/parts/partsApi";
import {
  CONDITION_OPTIONS,
  type PartCondition,
} from "@/lib/types/part";
import { PARTS_CATEGORIES } from "@/lib/types/parts-listing";
import type { PartsSearchParams } from "@/lib/types/api";

export default function PartsPage() {
  const router = useRouter();
  const { requireAuth, showAuthModal, closeAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState<PartCondition>("Все");

  // RTK Query — fetch from backend
  const baseParams: PartsSearchParams = useMemo(() => {
    const p: PartsSearchParams = {};
    if (searchQuery) p.q = searchQuery;
    if (selectedCategory !== "all") p.part_type = selectedCategory;
    if (selectedCondition === "Новый") p.condition = "new";
    else if (selectedCondition === "Б/у") p.condition = "used";
    return p;
  }, [searchQuery, selectedCategory, selectedCondition]);

  const { params: queryParams, page, setPage } = usePagedParams(baseParams);
  const { data: apiData, isLoading, isFetching } = useGetPartsQuery(queryParams);
  const isLoadingMore = isFetching && !isLoading;
  const hasMore = apiData?.has_more ?? false;

  const filteredParts = useMemo(() => {
    if (!apiData?.parts) return [];
    return apiData.parts.map((part) => ({
      id: part.id,
      title: part.title ?? `${part.brand ?? ""} ${part.model ?? ""}`.trim(),
      price: String(part.price),
      condition: part.condition === "new" ? "Новый" as const : "Б/у" as const,
      image: part.photos[0] ?? "",
      city: part.contact_city,
      category: part.part_type,
      publishedDate: part.created_at,
    }));
  }, [apiData]);

  const handlePartClick = useCallback(
    (id: string) => router.push(`/parts/${id}`),
    [router]
  );

  return (
    <main className="screen lg:min-h-screen lg:bg-[#F5F5F7]">
      {/* ── Desktop Filter Bar (sticky) ── */}
      <div className="hidden lg:block sticky top-[65px] z-20 bg-white border-b border-[#E5E5E7]">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-2 bg-[#F5F5F7] rounded-xl px-4 h-10">
                <Search className="w-5 h-5 text-[#8E8E93] shrink-0" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск запчастей"
                  className="flex-1 bg-transparent border-none shadow-none text-[15px] text-[#111111] placeholder:text-[#8E8E93] focus-visible:ring-0 font-[family-name:var(--font-manrope)] h-10 px-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 hover:bg-[#E5E5E7] rounded-lg transition-colors"
                  >
                    <span className="text-[#8E8E93] text-xs">&#x2715;</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category Select */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="px-4 h-10 bg-[#F5F5F7] border-none rounded-xl text-[15px] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] cursor-pointer font-[family-name:var(--font-manrope)] w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {PARTS_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Condition Toggles */}
            <div className="flex gap-2">
              {CONDITION_OPTIONS.map((cond) => (
                <Button
                  key={cond}
                  variant={selectedCondition === cond ? "default" : "outline"}
                  onClick={() => setSelectedCondition(cond)}
                  className={`h-10 rounded-xl text-[15px] font-medium font-[family-name:var(--font-manrope)] ${
                    selectedCondition === cond
                      ? "bg-[#111111] text-white hover:bg-[#111111]/90"
                      : "bg-[#F5F5F7] text-[#111111] hover:bg-[#EAEAEA] border-transparent"
                  }`}
                >
                  {cond}
                </Button>
              ))}
            </div>

            {/* Add Button */}
            <Button
              onClick={() => requireAuth(() => router.push("/post-ad?category=parts"))}
              className="h-10 bg-[#E53935] text-white rounded-xl hover:bg-[#D32F2F] font-medium text-[15px] ml-auto font-[family-name:var(--font-manrope)]"
            >
              <Plus className="w-5 h-5" />
              Добавить
            </Button>
          </div>

          {/* Results Count */}
          <div className="mt-3">
            <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              Найдено {filteredParts.length} объявлений
            </p>
          </div>
        </div>
      </div>

      {/* ── Desktop Grid ── */}
      <div className="hidden lg:block max-w-[1440px] mx-auto px-6 py-6">
        {isLoading ? (
          <GridPageSkeleton />
        ) : filteredParts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredParts.map((part) => (
              <PartCard
                key={part.id}
                part={part}
                onClick={handlePartClick}
                variant="desktop"
              />
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

      {/* ── Шапка (§10.7): кнопка добавления 40×40 r20 ── */}
      <PageHeader
        title="Запчасти"
        rightAction={
          <button
            onClick={() => requireAuth(() => router.push("/post-ad?category=parts"))}
            aria-label="Добавить объявление"
            className="grid size-10 place-items-center rounded-[20px] bg-black/5 transition-transform active:scale-95 dark:bg-white/10"
          >
            <Plus className="size-5 text-foreground" strokeWidth={1.5} />
          </button>
        }
      />

      {/* ── Поиск + фильтры (§10.7) ── */}
      <div className="px-4 pb-3 pt-4 lg:hidden">
        {/* h44 r12 bg secondary, иконка слева на 12 */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск запчастей"
            className="h-11 w-full rounded-xl bg-secondary pl-10 pr-10 text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Очистить"
              className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground"
            >
              <span className="text-sm">&#x2715;</span>
            </button>
          )}
        </div>

        {/* Чипы-фильтры h36 r18, gap 8, горизонтальный скролл */}
        <div className="scroll-x -mx-4 mt-3 flex gap-2 px-4">
          {CONDITION_OPTIONS.map((cond) => (
            <button
              key={cond}
              type="button"
              aria-pressed={selectedCondition === cond}
              onClick={() => setSelectedCondition(cond)}
              className="chip shrink-0"
            >
              {cond}
            </button>
          ))}
          <span className="h-9 w-px shrink-0 self-center bg-border" />
          {PARTS_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              aria-pressed={selectedCategory === cat.id}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.id ? "all" : cat.id)
              }
              className="chip shrink-0"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Сетка: 2 колонки, gap 12, px16 ── */}
      <div className="px-4 lg:hidden">
        {isLoading ? (
          <GridPageSkeleton count={6} />
        ) : filteredParts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredParts.map((part) => (
              <PartCard
                key={part.id}
                part={part}
                onClick={handlePartClick}
                variant="mobile"
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="Ничего не найдено"
            description={
              searchQuery || selectedCategory !== "all"
                ? "Попробуйте другой запрос"
                : "Пока нет объявлений. Добавьте первую запчасть"
            }
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
      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </main>
  );
}
