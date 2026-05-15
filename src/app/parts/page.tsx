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
import { useGetPartsQuery } from "@/lib/features/parts/partsApi";
import {
  PART_CATEGORIES,
  CONDITION_OPTIONS,
  type PartCondition,
} from "@/lib/types/part";
import type { PartsSearchParams } from "@/lib/types/api";

export default function PartsPage() {
  const router = useRouter();
  const { requireAuth, showAuthModal, closeAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все категории");
  const [selectedCondition, setSelectedCondition] = useState<PartCondition>("Все");

  // RTK Query — fetch from backend
  const queryParams: PartsSearchParams = useMemo(() => {
    const p: PartsSearchParams = {};
    if (searchQuery) p.q = searchQuery;
    if (selectedCondition === "Новый") p.condition = "new";
    else if (selectedCondition === "Б/у") p.condition = "used";
    return p;
  }, [searchQuery, selectedCondition]);

  const { data: apiData, isLoading } = useGetPartsQuery(queryParams);

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
    <main className="min-h-screen bg-[#F5F5F7]">
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
                {PART_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
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
      </div>

      {/* ── Mobile Header ── */}
      <PageHeader
        title="Запчасти"
        rightAction={
          <button
            onClick={() => requireAuth(() => router.push("/post-ad?category=parts"))}
            aria-label="Добавить объявление"
            className="flex items-center gap-1 h-9 px-3 bg-[#E53935] text-white rounded-lg hover:bg-[#D32F2F] active:scale-95 transition-all font-[family-name:var(--font-manrope)]"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[14px] font-medium">Добавить</span>
          </button>
        }
      />

      {/* ── Mobile Search + Filters ── */}
      <div className="lg:hidden px-4 pt-4 pb-2 space-y-3">
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-[#E5E5E7] px-4 h-12">
          <Search className="w-5 h-5 text-[#8E8E93] shrink-0" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск запчастей"
            className="flex-1 bg-transparent border-none shadow-none text-[15px] text-[#111111] placeholder:text-[#8E8E93] focus-visible:ring-0 font-[family-name:var(--font-manrope)] h-12 px-0"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="p-1">
              <span className="text-[#8E8E93] text-sm">&#x2715;</span>
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {CONDITION_OPTIONS.map((cond) => (
            <Button
              key={cond}
              variant={selectedCondition === cond ? "default" : "outline"}
              onClick={() => setSelectedCondition(cond)}
              className={`shrink-0 h-9 rounded-full text-[14px] font-medium font-[family-name:var(--font-manrope)] ${
                selectedCondition === cond
                  ? "bg-[#111111] text-white hover:bg-[#111111]/90"
                  : "bg-white border-[#E5E5E7] text-[#111111]"
              }`}
            >
              {cond}
            </Button>
          ))}
          <div className="w-px h-9 bg-[#E5E5E7] shrink-0 self-center" />
          {PART_CATEGORIES.slice(1).map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat ? "Все категории" : cat
                )
              }
              className={`shrink-0 h-9 rounded-full text-[14px] font-medium font-[family-name:var(--font-manrope)] ${
                selectedCategory === cat
                  ? "bg-[#111111] text-white hover:bg-[#111111]/90"
                  : "bg-white border-[#E5E5E7] text-[#111111]"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        <p className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
          Найдено {filteredParts.length} объявлений
        </p>
      </div>

      {/* ── Mobile + Tablet Grid ── */}
      <div className="lg:hidden px-4 md:px-6 pb-24">
        {isLoading ? (
          <GridPageSkeleton count={6} />
        ) : filteredParts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
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
            description="Попробуйте изменить параметры поиска"
          />
        )}
      </div>
      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </main>
  );
}
