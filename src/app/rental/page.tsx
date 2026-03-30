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
import { useGetRentalsQuery } from "@/lib/features/rental/rentalApi";
import {
  CAR_CLASSES,
  RENTAL_CITIES,
  type CarClass,
  type RentalCity,
  type RentalCar,
} from "@/lib/types/rental";
import type { RentalSearchParams } from "@/lib/types/api";

export default function RentalPage() {
  const router = useRouter();
  const { requireAuth, showAuthModal, closeAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<CarClass | null>(null);
  const [selectedCity, setSelectedCity] = useState<RentalCity | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // RTK Query — fetch from backend
  const queryParams: RentalSearchParams = useMemo(() => {
    const p: RentalSearchParams = {};
    if (searchQuery) p.q = searchQuery;
    if (selectedClass) p.car_class = selectedClass;
    if (selectedCity) p.city = selectedCity;
    return p;
  }, [searchQuery, selectedClass, selectedCity]);

  const { data: apiData } = useGetRentalsQuery(queryParams);

  const filteredCars: RentalCar[] = useMemo(() => {
    if (!apiData?.cars) return [];
    return apiData.cars.map((car) => ({
      id: car.id,
      title: car.title,
      carClass: car.car_class as RentalCar["carClass"],
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
      city: car.contact_city,
      publishedDate: car.published_at,
    }));
  }, [apiData]);

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
    <main className="min-h-screen bg-[#F5F5F7]">
      {/* ── Desktop Filter Bar (sticky) ── */}
      <div className="hidden lg:block sticky top-[65px] z-20 bg-white border-b border-[#E5E5E7]">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-sm">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Поиск автомобилей.."
              />
            </div>

            <div className="flex gap-2">
              {CAR_CLASSES.map((cls) => (
                <FilterChip
                  key={cls}
                  label={cls}
                  isActive={selectedClass === cls}
                  onClick={() => setSelectedClass(selectedClass === cls ? null : cls)}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {RENTAL_CITIES.map((city) => (
                <FilterChip
                  key={city}
                  label={city}
                  isActive={selectedCity === city}
                  onClick={() => setSelectedCity(selectedCity === city ? null : city)}
                />
              ))}
            </div>

            <Button
              onClick={() => requireAuth(() => setShowAddForm(true))}
              className="h-10 bg-[#E53935] text-white rounded-xl hover:bg-[#D32F2F] font-medium text-[15px] ml-auto font-[family-name:var(--font-manrope)]"
            >
              <Plus className="w-5 h-5" />
              Добавить
            </Button>
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
        {filteredCars.length > 0 ? (
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
      </div>

      {/* ── Mobile Header ── */}
      <PageHeader title="Авто прокат" />

      {/* ── Mobile Search + Filters ── */}
      <div className="lg:hidden px-4 pt-4 pb-2 space-y-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск автомобилей.."
          variant="mobile"
        />

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {CAR_CLASSES.map((cls) => (
            <FilterChip
              key={cls}
              label={cls}
              isActive={selectedClass === cls}
              onClick={() => setSelectedClass(selectedClass === cls ? null : cls)}
              variant="mobile"
            />
          ))}
          <div className="w-px h-9 bg-[#E5E5E7] shrink-0 self-center" />
          {RENTAL_CITIES.map((city) => (
            <FilterChip
              key={city}
              label={city}
              isActive={selectedCity === city}
              onClick={() => setSelectedCity(selectedCity === city ? null : city)}
              variant="mobile"
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
            Найдено {filteredCars.length} автомобилей
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

      {/* ── Mobile Grid ── */}
      <div className="lg:hidden px-4 pb-6">
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredCars.map((car) => (
              <RentalCard key={car.id} car={car} onClick={handleCarClick} variant="mobile" />
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

      {/* ── Mobile FAB ── */}
      <button
        type="button"
        onClick={() => requireAuth(() => setShowAddForm(true))}
        className="lg:hidden fixed bottom-6 right-4 z-30 w-14 h-14 rounded-full bg-[#E53935] text-white flex items-center justify-center shadow-lg hover:bg-[#D32F2F] active:scale-95 transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>

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
