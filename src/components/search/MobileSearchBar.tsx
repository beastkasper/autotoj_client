"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  hasActiveFilters: boolean;
}

/**
 * Плавающая шапка главной (DESIGN.md §10.1): липкая, фон прозрачный —
 * карточки проезжают под ней. Белый контейнер r28, p12, gap12, shadow-float.
 */
export function MobileSearchBar({
  searchQuery,
  onSearchChange,
  onFilterClick,
  hasActiveFilters,
}: MobileSearchBarProps) {
  return (
    <div className="sticky top-0 z-40 pt-[env(safe-area-inset-top)] lg:hidden">
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 rounded-[28px] bg-card p-3 shadow-[var(--shadow-float)]">
          {/* Поле поиска: h40 r20 bg secondary, иконка 18 stroke 2 */}
          <div className="flex h-10 flex-1 items-center gap-2 rounded-[20px] bg-secondary px-3">
            <Search className="size-[18px] shrink-0 text-foreground" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск автомобилей"
              className="w-full flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          {/* Кнопка фильтров: 40×40 r20; при активных фильтрах — чёрная */}
          <button
            type="button"
            onClick={onFilterClick}
            aria-label="Фильтры"
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-[20px] transition-all active:scale-95",
              hasActiveFilters
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground",
            )}
          >
            <SlidersHorizontal className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
