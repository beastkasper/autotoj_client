"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CategoryKey = "all" | "new" | "used";

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "all", label: "Все объявления" },
  { key: "new", label: "Новые" },
  { key: "used", label: "С пробегом" },
];

interface ListingsBarProps {
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
  onNavigate: (tab: string) => void;
  resultsCount?: number;
}

export function ListingsBar({
  onSearch,
  onFilterClick,
  onNavigate,
  resultsCount = 1234,
}: ListingsBarProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const formattedCount = resultsCount.toLocaleString("ru-RU");

  return (
    <div className="border-t border-[#E5E5E7]">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-between gap-6 h-14">
          {/* Category filters */}
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.key}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(cat.key)}
                className={
                  selectedCategory === cat.key
                    ? "bg-[#111111] text-white hover:bg-[#111111]/90 rounded-lg text-[14px] font-medium font-[family-name:var(--font-manrope)]"
                    : "text-[#8E8E93] hover:text-[#111111] hover:bg-[#F5F5F5] rounded-lg text-[14px] font-medium font-[family-name:var(--font-manrope)]"
                }
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-2 bg-[#F5F5F5] rounded-lg px-3 h-9">
              <Search className="size-4 text-[#8E8E93] shrink-0" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Поиск автомобилей..."
                className="flex-1 border-0 bg-transparent shadow-none text-[14px] text-[#111111] placeholder:text-[#8E8E93] focus-visible:ring-0 h-9 px-0 font-[family-name:var(--font-manrope)]"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSearchChange("")}
                  className="size-6 hover:bg-[#E5E5E7] rounded text-[#8E8E93]"
                >
                  <X className="size-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Right side: filters, count, post */}
          <div className="flex items-center gap-4">
            <Button
              onClick={onFilterClick}
              className="bg-[#111111] text-white hover:bg-[#2C2C2E] rounded-lg text-[14px] font-medium font-[family-name:var(--font-manrope)]"
            >
              <SlidersHorizontal className="size-4" />
              Фильтры
            </Button>

            <span className="text-[14px] text-[#8E8E93] whitespace-nowrap font-[family-name:var(--font-manrope)]">
              Найдено: {formattedCount} авто
            </span>

            <Button
              onClick={() => onNavigate("post")}
              className="bg-[#E53935] text-white hover:bg-[#D32F2F] rounded-lg text-[14px] font-medium font-[family-name:var(--font-manrope)]"
            >
              <Plus className="size-4" />
              Разместить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
