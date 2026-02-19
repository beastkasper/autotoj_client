"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface MobileSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  hasActiveFilters: boolean;
}

export function MobileSearchBar({
  searchQuery,
  onSearchChange,
  onFilterClick,
  hasActiveFilters,
}: MobileSearchBarProps) {
  return (
    <div className="lg:hidden sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
      <div className="px-4 py-3">
        <div className="bg-white rounded-[28px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-3 flex items-center gap-3">
          {/* Search input */}
          <div className="flex-1 bg-[#F2F2F7] rounded-[20px] px-3 h-10 flex items-center gap-2">
            <Search className="size-[18px] text-[#111111] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск автомобилей"
              className="flex-1 bg-transparent text-sm text-[#111111] placeholder:text-[#8E8E93] focus:outline-none font-[family-name:var(--font-manrope)]"
            />
          </div>
          {/* Filter button */}
          <button
            onClick={onFilterClick}
            className={`size-10 rounded-[20px] flex items-center justify-center transition-all active:scale-95 shrink-0 ${
              hasActiveFilters
                ? "bg-[#111111] text-white"
                : "bg-[#F2F2F7] text-[#111111]"
            }`}
          >
            <SlidersHorizontal className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
