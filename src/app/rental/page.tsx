"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RentalCard } from "@/components/cards/RentalCard";
import { EmptyState } from "@/components/states/EmptyState";
import {
  mockRentals,
  CAR_CLASSES,
  RENTAL_CITIES,
  type CarClass,
  type RentalCity,
} from "@/lib/data/mockRentals";

export default function RentalPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<CarClass | null>(null);
  const [selectedCity, setSelectedCity] = useState<RentalCity | null>(null);

  const filteredCars = useMemo(() => {
    return mockRentals.filter((car) => {
      const matchesSearch = car.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesClass =
        selectedClass === null || car.carClass === selectedClass;
      const matchesCity = selectedCity === null || car.city === selectedCity;
      return matchesSearch && matchesClass && matchesCity;
    });
  }, [searchQuery, selectedClass, selectedCity]);

  const hasActiveFilters =
    searchQuery !== "" || selectedClass !== null || selectedCity !== null;

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedClass(null);
    setSelectedCity(null);
  }, []);

  const handleCarClick = useCallback(
    (id: number) => router.push(`/rental/${id}`),
    [router]
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* ── Desktop Filter Bar (sticky) ── */}
      <div className="hidden lg:block sticky top-[65px] z-20 bg-white border-b border-[#E5E5E7]">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 max-w-sm">
              <div className="flex items-center gap-2 bg-[#F5F5F7] rounded-xl px-4 h-10">
                <Search className="w-5 h-5 text-[#8E8E93] shrink-0" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск автомобилей.."
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

            {/* Car Class chips */}
            <div className="flex gap-2">
              {CAR_CLASSES.map((cls) => (
                <Button
                  key={cls}
                  variant="outline"
                  onClick={() =>
                    setSelectedClass(selectedClass === cls ? null : cls)
                  }
                  className={`h-10 rounded-xl text-[15px] font-medium font-[family-name:var(--font-manrope)] ${
                    selectedClass === cls
                      ? "bg-white text-[#111111] border-[#111111] border-2 hover:bg-[#F5F5F7]"
                      : "bg-[#F5F5F7] text-[#111111] hover:bg-[#EAEAEA] border-transparent"
                  }`}
                >
                  {cls}
                </Button>
              ))}
            </div>

            {/* City chips */}
            <div className="flex gap-2">
              {RENTAL_CITIES.map((city) => (
                <Button
                  key={city}
                  variant="outline"
                  onClick={() =>
                    setSelectedCity(selectedCity === city ? null : city)
                  }
                  className={`h-10 rounded-xl text-[15px] font-medium font-[family-name:var(--font-manrope)] ${
                    selectedCity === city
                      ? "bg-white text-[#111111] border-[#111111] border-2 hover:bg-[#F5F5F7]"
                      : "bg-[#F5F5F7] text-[#111111] hover:bg-[#EAEAEA] border-transparent"
                  }`}
                >
                  {city}
                </Button>
              ))}
            </div>

            {/* Add Button */}
            <Button className="h-10 bg-[#E53935] text-white rounded-xl hover:bg-[#D32F2F] font-medium text-[15px] ml-auto font-[family-name:var(--font-manrope)]">
              <Plus className="w-5 h-5" />
              Добавить
            </Button>
          </div>

          {/* Results Count + Reset */}
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
              <RentalCard
                key={car.id}
                car={car}
                onClick={handleCarClick}
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
            Авто прокат
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
            placeholder="Поиск автомобилей.."
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
          {CAR_CLASSES.map((cls) => (
            <Button
              key={cls}
              variant="outline"
              onClick={() =>
                setSelectedClass(selectedClass === cls ? null : cls)
              }
              className={`shrink-0 h-9 rounded-full text-[14px] font-medium font-[family-name:var(--font-manrope)] ${
                selectedClass === cls
                  ? "bg-white text-[#111111] border-[#111111] border-2"
                  : "bg-white border-[#E5E5E7] text-[#111111]"
              }`}
            >
              {cls}
            </Button>
          ))}
          <div className="w-px h-9 bg-[#E5E5E7] shrink-0 self-center" />
          {RENTAL_CITIES.map((city) => (
            <Button
              key={city}
              variant="outline"
              onClick={() =>
                setSelectedCity(selectedCity === city ? null : city)
              }
              className={`shrink-0 h-9 rounded-full text-[14px] font-medium font-[family-name:var(--font-manrope)] ${
                selectedCity === city
                  ? "bg-white text-[#111111] border-[#111111] border-2"
                  : "bg-white border-[#E5E5E7] text-[#111111]"
              }`}
            >
              {city}
            </Button>
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
              <RentalCard
                key={car.id}
                car={car}
                onClick={handleCarClick}
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
