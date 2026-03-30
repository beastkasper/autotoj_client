"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, ChevronLeft, Star, BadgeCheck, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/EmptyState";
import {
  useGetServiceProvidersQuery,
  useGetServiceCategoriesQuery,
} from "@/lib/features/services/servicesApi";

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
  const queryParams = useMemo(() => {
    const p: { category_id: string; q?: string; sort?: string } = {
      category_id: categoryId,
    };
    if (searchQuery) p.q = searchQuery;
    if (sortBy) p.sort = sortBy;
    return p;
  }, [categoryId, searchQuery, sortBy]);

  const { data: providersData, isLoading } = useGetServiceProvidersQuery(queryParams);
  const providers = providersData?.providers ?? [];

  const handleProviderClick = useCallback(
    (id: string) => router.push(`/services/provider/${id}`),
    [router]
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
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
      <div className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E7]">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => router.push("/services")}
            className="w-10 h-10 rounded-full flex items-center justify-center -ml-2 hover:bg-[#F2F2F7] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#111111]" />
          </button>
          <h1 className="text-[17px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)] truncate">
            {categoryName}
          </h1>
        </div>
      </div>

      {/* ── Mobile Search ── */}
      <div className="lg:hidden px-4 pt-4 pb-2 space-y-3">
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-[#E5E5E7] px-4 h-12">
          <Search className="w-5 h-5 text-[#8E8E93] shrink-0" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className="flex-1 bg-transparent border-none shadow-none text-[15px] text-[#111111] placeholder:text-[#8E8E93] focus-visible:ring-0 font-[family-name:var(--font-manrope)] h-12 px-0"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {SORT_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={sortBy === opt.value ? "default" : "outline"}
              onClick={() => setSortBy(opt.value)}
              className={`shrink-0 h-9 rounded-full text-[14px] font-medium font-[family-name:var(--font-manrope)] ${
                sortBy === opt.value
                  ? "bg-[#111111] text-white hover:bg-[#111111]/90"
                  : "bg-white border-[#E5E5E7] text-[#111111]"
              }`}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <p className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
          Найдено {providers.length} компаний
        </p>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E5E5E7] border-t-[#111111] rounded-full animate-spin" />
        </div>
      )}

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
          </div>

          {/* Mobile */}
          <div className="lg:hidden px-4 pb-6 space-y-2">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderClick(provider.id)}
                className="w-full bg-white rounded-2xl p-4 text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex gap-3">
                  {provider.logo_url ? (
                    <img
                      src={provider.logo_url}
                      alt={provider.name}
                      className="w-14 h-14 rounded-xl object-cover bg-[#F5F5F7] shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#F5F5F7] flex items-center justify-center shrink-0">
                      <span className="text-xl text-[#C7C7CC]">🔧</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[15px] font-semibold text-[#111111] truncate font-[family-name:var(--font-manrope)]">
                        {provider.name}
                      </h3>
                      {provider.is_verified && (
                        <BadgeCheck className="w-4 h-4 text-[#007AFF] shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Star className="w-3.5 h-3.5 text-[#FF9500] fill-[#FF9500]" />
                      <span className="text-[13px] font-medium text-[#111111] font-[family-name:var(--font-manrope)]">
                        {provider.rating.toFixed(1)}
                      </span>
                      <span className="text-[12px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                        ({provider.reviews_count})
                      </span>
                    </div>
                    {provider.address && (
                      <p className="text-[12px] text-[#8E8E93] mt-1 truncate font-[family-name:var(--font-manrope)]">
                        {provider.city}, {provider.address}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
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
