"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FilterSection } from "./FilterSection";
import { FilterChipGroup } from "./FilterChipGroup";
import { FilterRangeInput } from "./FilterRangeInput";
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
import { useState, useCallback, useMemo } from "react";

/* ── FilterState ── */
export interface FilterState {
  // Quick filters
  priceUnder100k?: boolean;
  automatic?: boolean;
  withPhoto?: boolean;
  withVideo?: boolean;
  notDamaged?: boolean;
  fromOwner?: boolean;
  // Detail filters
  brand?: string;
  model?: string;
  priceFrom?: number;
  priceTo?: number;
  yearFrom?: number;
  yearTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  fuel?: string;
  transmission?: string;
  drive?: string;
  bodyType?: string;
  color?: string;
}

export const EMPTY_FILTERS: FilterState = {};

export function countActiveFilters(f: FilterState): number {
  let c = 0;
  QUICK_FILTERS.forEach((qf) => {
    if (f[qf.id as keyof FilterState]) c++;
  });
  if (f.brand) c++;
  if (f.model) c++;
  if (f.priceFrom || f.priceTo) c++;
  if (f.yearFrom || f.yearTo) c++;
  if (f.mileageFrom || f.mileageTo) c++;
  if (f.fuel) c++;
  if (f.transmission) c++;
  if (f.drive) c++;
  if (f.bodyType) c++;
  if (f.color) c++;
  return c;
}

/* ── Shared filter content (used by both Desktop & Mobile) ── */
interface FilterContentProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

function FilterContent({ filters, setFilters }: FilterContentProps) {
  const availableModels = useMemo(
    () => (filters.brand ? MODELS[filters.brand] || [] : []),
    [filters.brand]
  );

  const handleQuickToggle = useCallback(
    (id: string) => {
      setFilters((prev) => ({
        ...prev,
        [id]: !prev[id as keyof FilterState],
      }));
    },
    [setFilters]
  );

  const setField = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [setFilters]
  );

  return (
    <>
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

      {/* Detailed Filters — Two-Column on Desktop, single column on Mobile */}
      <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                    onValueChange={(v) => setField("model", v || undefined)}
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
    </>
  );
}

/* ── Mobile FilterSheet ── */
interface FilterSheetProps {
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  activeFilters?: FilterState;
}

export function FilterSheet({
  onClose,
  onApply,
  activeFilters,
}: FilterSheetProps) {
  const [filters, setFilters] = useState<FilterState>(
    activeFilters || EMPTY_FILTERS
  );
  const count = countActiveFilters(filters);

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[85vh] flex flex-col p-0"
      >
        <SheetHeader className="px-6 pt-5 pb-0 border-b border-[#E5E5E7]">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-[18px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
                Фильтры
              </SheetTitle>
              {count > 0 && (
                <Badge className="bg-[#111111] text-white border-transparent hover:bg-[#111111] rounded-full px-2.5 py-0.5 text-[12px] font-medium">
                  {count}
                </Badge>
              )}
            </div>
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="text-[14px] font-medium text-[#8E8E93] hover:text-[#111111] transition-colors font-[family-name:var(--font-manrope)]"
            >
              Сбросить
            </button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <FilterContent filters={filters} setFilters={setFilters} />
        </ScrollArea>

        <div className="px-6 py-4 border-t border-[#E5E5E7] bg-white">
          <Button
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="w-full h-12 rounded-2xl bg-[#111111] text-white hover:bg-[#333] text-[15px] font-semibold font-[family-name:var(--font-manrope)]"
          >
            Показать результаты
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
