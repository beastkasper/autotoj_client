"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PartCard } from "@/components/cards/PartCard";
import { EmptyState } from "@/components/states/EmptyState";
import {
  mockPartsListings,
  PART_CATEGORIES,
  CONDITION_OPTIONS,
  type PartCondition,
} from "@/lib/data/mockParts";

export default function PartsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все категории");
  const [selectedCondition, setSelectedCondition] = useState<PartCondition>("Все");

  const filteredParts = useMemo(() => {
    return mockPartsListings.filter((part) => {
      const matchesSearch = part.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCondition =
        selectedCondition === "Все" || part.condition === selectedCondition;
      return matchesSearch && matchesCondition;
    });
  }, [searchQuery, selectedCondition]);

  const handlePartClick = useCallback(
    (id: number) => router.push(`/parts/${id}`),
    [router]
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
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
                    <span className="text-[#8E8E93] text-xs">✕</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 h-10 bg-[#F5F5F7] border-none rounded-xl text-[15px] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] cursor-pointer font-[family-name:var(--font-manrope)]"
            >
              {PART_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

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
        {filteredParts.length > 0 ? (
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
      <div className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E7]">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center -ml-2 hover:bg-[#F2F2F7] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#111111]" />
          </button>
          <h1 className="text-[17px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
            Запчасти
          </h1>
        </div>
      </div>

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
              <span className="text-[#8E8E93] text-sm">✕</span>
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

      {/* ── Mobile Grid ── */}
      <div className="lg:hidden px-4 pb-6">
        {filteredParts.length > 0 ? (
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
            description="Попробуйте изменить параметры поиска"
          />
        )}
      </div>
    </div>
  );
}
