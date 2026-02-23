"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion } from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FilterSection } from "./FilterSection";
import { FilterChipGroup } from "./FilterChipGroup";
import { FilterRangeInput } from "./FilterRangeInput";
import {
  type FilterState,
  EMPTY_FILTERS,
  countActiveFilters,
} from "./FilterSheet";
import {
  QUICK_FILTERS,
  BRANDS,
  MODELS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  DRIVE_TYPES,
  BODY_TYPES,
  COLORS,
} from "@/lib/data/filterConstants";

interface DesktopFilterPanelProps {
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  activeFilters?: FilterState;
}

export function DesktopFilterPanel({
  onClose,
  onApply,
  activeFilters,
}: DesktopFilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>(
    activeFilters || EMPTY_FILTERS
  );
  const count = countActiveFilters(filters);
  const availableModels = filters.brand
    ? MODELS[filters.brand] || []
    : [];

  const handleReset = () => setFilters(EMPTY_FILTERS);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleQuickToggle = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      [id]: !prev[id as keyof FilterState],
    }));
  };

  const setField = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] flex flex-col rounded-2xl p-0 gap-0 [&>button]:hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-[#E5E5E7] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-[20px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
                Фильтры
              </DialogTitle>
              {count > 0 && (
                <Badge className="bg-[#111111] text-white border-transparent hover:bg-[#111111] rounded-full px-2.5 py-1 text-[12px] font-medium">
                  {count}
                </Badge>
              )}
            </div>
            <button
              onClick={handleReset}
              className="text-[15px] font-medium text-[#8E8E93] hover:text-[#111111] transition-colors font-[family-name:var(--font-manrope)]"
            >
              Сбросить
            </button>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 overflow-y-auto">
          {/* Quick Filters */}
          <div className="px-6 py-5 border-b border-[#E5E5E7]">
            <h3 className="text-[15px] font-semibold text-[#111111] mb-3 font-[family-name:var(--font-manrope)]">
              Быстрые фильтры
            </h3>
            <div className="flex flex-wrap gap-2">
              {QUICK_FILTERS.map((qf) => (
                <Button
                  key={qf.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickToggle(qf.id)}
                  className={`rounded-lg text-[14px] font-medium font-[family-name:var(--font-manrope)] transition-all ${
                    filters[qf.id as keyof FilterState]
                      ? "bg-[#111111] text-white border-[#111111] hover:bg-[#333] hover:text-white"
                      : "bg-[#F5F5F7] text-[#111111] border-transparent hover:bg-[#E5E5E7]"
                  }`}
                >
                  {qf.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Two-Column Grid */}
          <div className="px-6 py-5 grid grid-cols-2 gap-6">
            {/* Left Column */}
            <Accordion
              type="multiple"
              defaultValue={["brand-model", "price"]}
              className="space-y-3"
            >
              {/* Brand/Model */}
              <FilterSection value="brand-model" title="Марка / Модель">
                <div className="space-y-3">
                  <div>
                    <Label className="text-[13px] text-[#8E8E93] mb-1.5 block font-[family-name:var(--font-manrope)]">
                      Марка
                    </Label>
                    <Select
                      value={filters.brand || ""}
                      onValueChange={(v) => {
                        setField("brand", v || undefined);
                        setField("model", undefined);
                      }}
                    >
                      <SelectTrigger className="h-10 rounded-lg border-[#E5E5E7] bg-white text-[14px] font-[family-name:var(--font-manrope)]">
                        <SelectValue placeholder="Любая" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANDS.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {filters.brand && availableModels.length > 0 && (
                    <div>
                      <Label className="text-[13px] text-[#8E8E93] mb-1.5 block font-[family-name:var(--font-manrope)]">
                        Модель
                      </Label>
                      <Select
                        value={filters.model || ""}
                        onValueChange={(v) =>
                          setField("model", v || undefined)
                        }
                      >
                        <SelectTrigger className="h-10 rounded-lg border-[#E5E5E7] bg-white text-[14px] font-[family-name:var(--font-manrope)]">
                          <SelectValue placeholder="Любая" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </FilterSection>

              {/* Price */}
              <FilterSection value="price" title="Цена">
                <FilterRangeInput
                  fromValue={filters.priceFrom}
                  toValue={filters.priceTo}
                  onFromChange={(v) => setField("priceFrom", v)}
                  onToChange={(v) => setField("priceTo", v)}
                  fromPlaceholder="0"
                  toPlaceholder="∞"
                />
              </FilterSection>

              {/* Year */}
              <FilterSection value="year" title="Год выпуска">
                <FilterRangeInput
                  fromValue={filters.yearFrom}
                  toValue={filters.yearTo}
                  onFromChange={(v) => setField("yearFrom", v)}
                  onToChange={(v) => setField("yearTo", v)}
                  fromPlaceholder="2000"
                  toPlaceholder="2026"
                />
              </FilterSection>

              {/* Mileage */}
              <FilterSection value="mileage" title="Пробег">
                <FilterRangeInput
                  fromValue={filters.mileageFrom}
                  toValue={filters.mileageTo}
                  onFromChange={(v) => setField("mileageFrom", v)}
                  onToChange={(v) => setField("mileageTo", v)}
                  fromLabel="От, км"
                  toLabel="До, км"
                  fromPlaceholder="0"
                  toPlaceholder="∞"
                />
              </FilterSection>
            </Accordion>

            {/* Right Column */}
            <Accordion type="multiple" defaultValue={[]} className="space-y-3">
              <FilterSection value="fuel" title="Топливо">
                <FilterChipGroup
                  options={FUEL_TYPES}
                  value={filters.fuel}
                  onChange={(v) => setField("fuel", v)}
                />
              </FilterSection>

              <FilterSection value="transmission" title="Коробка передач">
                <FilterChipGroup
                  options={TRANSMISSION_TYPES}
                  value={filters.transmission}
                  onChange={(v) => setField("transmission", v)}
                />
              </FilterSection>

              <FilterSection value="drive" title="Привод">
                <FilterChipGroup
                  options={DRIVE_TYPES}
                  value={filters.drive}
                  onChange={(v) => setField("drive", v)}
                />
              </FilterSection>

              <FilterSection value="body" title="Кузов">
                <FilterChipGroup
                  options={BODY_TYPES}
                  value={filters.bodyType}
                  onChange={(v) => setField("bodyType", v)}
                />
              </FilterSection>

              <FilterSection value="color" title="Цвет">
                <FilterChipGroup
                  options={COLORS}
                  value={filters.color}
                  onChange={(v) => setField("color", v)}
                />
              </FilterSection>
            </Accordion>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-6 py-5 border-t border-[#E5E5E7] bg-[#FAFAFA] flex-shrink-0 flex gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl text-[15px] font-semibold border-[#E5E5E7] text-[#111111] hover:bg-[#F5F5F7] font-[family-name:var(--font-manrope)]"
          >
            Отмена
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 h-12 rounded-xl bg-[#111111] text-white hover:bg-[#333] text-[15px] font-semibold font-[family-name:var(--font-manrope)]"
          >
            Показать результаты
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
