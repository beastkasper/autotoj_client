"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RentalCard } from "@/components/cards/RentalCard";
import { EmptyState } from "@/components/states/EmptyState";
import { RentalAddForm } from "@/components/rental/rental-add-form";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/search/search-input";
import { FilterChip } from "@/components/search/filter-chip";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { useAuth } from "@/hooks/useAuth";
import { GridPageSkeleton } from "@/components/skeletons/grid-page-skeleton";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { usePagedParams } from "@/hooks/usePagedParams";
import { useGetRentalsQuery } from "@/lib/features/rental/rentalApi";
import { useGetCitiesQuery } from "@/lib/features/dicts/dictsApi";
import {
  CAR_CLASSES,
  CAR_CLASS_LABELS,
  type RentalCar,
} from "@/lib/types/rental";
import type { RentalSearchParams } from "@/lib/types/api";

export default function RentalPage() {
  const router = useRouter();
  const { requireAuth, showAuthModal, closeAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // City dictionary — backend filters/returns city slugs (e.g. "dushanbe").
  const { data: cities } = useGetCitiesQuery();
  const cityLabels = useMemo(
    () => Object.fromEntries((cities ?? []).map((c) => [c.id, c.name])),
    [cities],
  );

  // RTK Query — fetch from backend
  const baseParams: RentalSearchParams = useMemo(() => {
    const p: RentalSearchParams = {};
    if (searchQuery) p.q = searchQuery;
    if (selectedClass) p.car_class = selectedClass;
    if (selectedCity) p.city = selectedCity;
    return p;
  }, [searchQuery, selectedClass, selectedCity]);

  const { params: queryParams, page, setPage } = usePagedParams(baseParams);
  const { data: apiData, isLoading, isFetching } = useGetRentalsQuery(queryParams);
  const isLoadingMore = isFetching && !isLoading;
  const hasMore = apiData?.has_more ?? false;

  const filteredCars: RentalCar[] = useMemo(() => {
    if (!apiData?.cars) return [];
    return apiData.cars.map((car) => ({
      id: car.id,
      title: car.title,
      carClass: CAR_CLASS_LABELS[car.car_class] ?? car.car_class,
      year: car.year,
      transmission: car.transmission === "automatic" ? "Автомат" : "Механика",
      fuel:
        car.fuel_type === "petrol"
          ? "Бензин"
          : car.fuel_type === "diesel"
            ? "Дизель"
            : car.fuel_type,
      pricePerDay: String(car.price_per_day),
      image: car.photos[0] ?? "",
      city: cityLabels[car.contact_city] ?? car.contact_city,
      publishedDate: car.published_at,
    }));
  }, [apiData, cityLabels]);

  const handleAddSuccess = useCallback((_car: Omit<RentalCar, "id">) => {
    // TODO: Use createRental API mutation instead
    setShowAddForm(false);
  }, []);

  const hasActiveFilters =
    searchQuery !== "" || selectedClass !== null || selectedCity !== null;

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedClass(null);
    setSelectedCity(null);
  }, []);

  const handleCarClick = useCallback(
    (id: string) => router.push(`/rental/${id}`),
    [router],
  );

  return (
    <main className="screen lg:min-h-screen lg:bg-[#F5F5F7]">
      {/* ── Desktop Filter Bar (sticky) ── */}
      <div className="hidden lg:block sticky top-[65px] z-20 bg-white border-b border-[#E5E5E7]">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          {/* Row 1: search + add button */}
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-sm">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Поиск автомобилей.."
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

          {/* Row 2: class + city filter chips — wrap to avoid horizontal overflow */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {CAR_CLASSES.map((cls) => (
              <FilterChip
                key={cls.id}
                label={cls.label}
                isActive={selectedClass === cls.id}
                onClick={() => setSelectedClass(selectedClass === cls.id ? null : cls.id)}
              />
            ))}
            <div className="w-px h-6 bg-[#E5E5E7] mx-1 self-center" />
            {(cities ?? []).map((city) => (
              <FilterChip
                key={city.id}
                label={city.name}
                isActive={selectedCity === city.id}
                onClick={() => setSelectedCity(selectedCity === city.id ? null : city.id)}
              />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              Найдено {filteredCars.length} автомобилей
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
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCars.map((car) => (
              <RentalCard key={car.id} car={car} onClick={handleCarClick} variant="desktop" />
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

      {/* ── Шапка (§10.8) ── */}
      <PageHeader
        title="Авто прокат"
        rightAction={
          <button
            onClick={() => requireAuth(() => setShowAddForm(true))}
            aria-label="Добавить автомобиль"
            className="grid size-10 place-items-center rounded-[20px] bg-black/5 transition-transform active:scale-95 dark:bg-white/10"
          >
            <Plus className="size-5 text-foreground" strokeWidth={1.5} />
          </button>
        }
      />

      {/* ── Поиск + фильтры (§10.8) ── */}
      <div className="px-4 py-3 lg:hidden">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск автомобилей"
          variant="mobile"
        />

        <div className="scroll-x -mx-4 mt-3 flex gap-2 px-4">
          {CAR_CLASSES.map((cls) => (
            <FilterChip
              key={cls.id}
              label={cls.label}
              isActive={selectedClass === cls.id}
              onClick={() => setSelectedClass(selectedClass === cls.id ? null : cls.id)}
              variant="mobile"
            />
          ))}
          <span className="h-9 w-px shrink-0 self-center bg-border" />
          {(cities ?? []).map((city) => (
            <FilterChip
              key={city.id}
              label={city.name}
              isActive={selectedCity === city.id}
              onClick={() => setSelectedCity(selectedCity === city.id ? null : city.id)}
              variant="mobile"
            />
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="mt-3 text-[13px] font-medium text-link"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* ── Сетка: 2 колонки, gap 12, px16 ── */}
      <div className="px-4 lg:hidden">
        {isLoading ? (
          <GridPageSkeleton count={6} />
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredCars.map((car) => (
              <RentalCard key={car.id} car={car} onClick={handleCarClick} variant="mobile" />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="Ничего не найдено"
            description={
              hasActiveFilters || searchQuery
                ? "Попробуйте изменить параметры поиска"
                : "Пока нет объявлений"
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

      {/* ── Add Form Overlay ── */}
      {showAddForm && (
        <RentalAddForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </main>
  );
}
