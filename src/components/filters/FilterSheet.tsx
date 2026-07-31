"use client";

import { useState, useCallback, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { BottomSheet } from "@/components/layout/bottom-sheet";
import { QUICK_FILTERS } from "@/lib/data/filterConstants";
import {
  useGetBrandsQuery,
  useGetDictsQuery,
  useGetModelsQuery,
} from "@/lib/features/dicts/dictsApi";
import { cn } from "@/lib/utils";

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

type Option = { id: string; label: string };

/** Аккордеон шита фильтров (§8.2): p16, заголовок 16/500 + Chevron 20 muted. */
function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="hairline">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="text-[16px] font-medium text-foreground">{title}</span>
        <ChevronDown
          className={cn(
            "size-5 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          strokeWidth={1.5}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

/** Ряд чипов-опций с горизонтальным скроллом (§6.2). */
function OptionRow({
  label,
  options,
  value,
  onChange,
  anyLabel = "Любой",
}: {
  label?: string;
  options: readonly Option[];
  value?: string;
  onChange: (v: string | undefined) => void;
  anyLabel?: string;
}) {
  return (
    <div>
      {label && (
        <p className="mb-2 text-[14px] text-muted-foreground">{label}</p>
      )}
      <div className="scroll-x -mx-4 flex gap-2 px-4">
        <button
          type="button"
          aria-pressed={!value}
          onClick={() => onChange(undefined)}
          className="chip-option shrink-0"
        >
          {anyLabel}
        </button>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            aria-pressed={value === opt.id}
            onClick={() => onChange(value === opt.id ? undefined : opt.id)}
            className="chip-option shrink-0"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Диапазон «От / До»: два инпута в ряд, gap 12, лейблы 14/400 muted (§8.2). */
function RangeRow({
  fromValue,
  toValue,
  onFrom,
  onTo,
  fromPlaceholder = "0",
  toPlaceholder = "∞",
  hint,
}: {
  fromValue?: number;
  toValue?: number;
  onFrom: (v: number | undefined) => void;
  onTo: (v: number | undefined) => void;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            ["От", fromValue, onFrom, fromPlaceholder],
            ["До", toValue, onTo, toPlaceholder],
          ] as const
        ).map(([label, value, onChange, placeholder]) => (
          <div key={label}>
            <p className="mb-2 text-[14px] text-muted-foreground">{label}</p>
            <input
              type="number"
              inputMode="numeric"
              placeholder={placeholder}
              value={value ?? ""}
              onChange={(e) =>
                onChange(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-[16px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
        ))}
      </div>
      {hint && <p className="mt-2 text-[12px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ── Мобильный шит фильтров (DESIGN.md §8.2) ── */
interface FilterSheetProps {
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  activeFilters?: FilterState;
}

export function FilterSheet({ onClose, onApply, activeFilters }: FilterSheetProps) {
  const [filters, setFilters] = useState<FilterState>(activeFilters || EMPTY_FILTERS);
  // По умолчанию раскрыт только аккордеон «Марка / Модель»
  const [openSection, setOpenSection] = useState<string | null>("brand-model");
  const count = countActiveFilters(filters);

  const { data: brands } = useGetBrandsQuery({ type: "cars" });
  const { data: dicts } = useGetDictsQuery();
  const { data: brandModels } = useGetModelsQuery(
    { brand_id: filters.brand ?? "" },
    { skip: !filters.brand },
  );

  const toOptions = (list?: { id: string; name: string }[]): Option[] =>
    (list ?? []).map((d) => ({ id: d.id, label: d.name }));

  const brandOptions = useMemo(() => toOptions(brands), [brands]);
  const modelOptions = useMemo(() => toOptions(brandModels), [brandModels]);

  const setField = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleSection = (key: string) =>
    setOpenSection((prev) => (prev === key ? null : key));

  return (
    <BottomSheet
      open
      onClose={onClose}
      radius={16}
      showHandle={false}
      maxHeight="85vh"
      ariaLabel="Фильтры"
    >
      {/* Шапка */}
      <div className="hairline flex items-center justify-between p-4">
        <h2 className="text-[20px] font-semibold text-foreground">Фильтры</h2>
        <button
          type="button"
          onClick={() => setFilters(EMPTY_FILTERS)}
          className="text-[14px] font-medium text-muted-foreground"
        >
          Сбросить
        </button>
      </div>

      {/* Быстрые фильтры — круглые чипы, горизонтальный скролл */}
      <div className="hairline scroll-x flex gap-2 p-4">
        {QUICK_FILTERS.map((qf) => (
          <button
            key={qf.id}
            type="button"
            aria-pressed={!!filters[qf.id as keyof FilterState]}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                [qf.id]: !prev[qf.id as keyof FilterState],
              }))
            }
            className="chip shrink-0"
          >
            {qf.label}
          </button>
        ))}
      </div>

      {/* Аккордеоны */}
      <div className="flex-1 overflow-y-auto">
        <Section
          title="Марка / Модель"
          open={openSection === "brand-model"}
          onToggle={() => toggleSection("brand-model")}
        >
          <div className="space-y-4">
            <OptionRow
              label="Марка"
              options={brandOptions}
              value={filters.brand}
              anyLabel="Любая"
              onChange={(v) => {
                setField("brand", v);
                setField("model", undefined);
              }}
            />
            {filters.brand && modelOptions.length > 0 && (
              <OptionRow
                label="Модель"
                options={modelOptions}
                value={filters.model}
                anyLabel="Любая"
                onChange={(v) => setField("model", v)}
              />
            )}
          </div>
        </Section>

        <Section
          title="Цена"
          open={openSection === "price"}
          onToggle={() => toggleSection("price")}
        >
          <RangeRow
            fromValue={filters.priceFrom}
            toValue={filters.priceTo}
            onFrom={(v) => setField("priceFrom", v)}
            onTo={(v) => setField("priceTo", v)}
            hint="Валюта: сомони"
          />
        </Section>

        <Section
          title="Год"
          open={openSection === "year"}
          onToggle={() => toggleSection("year")}
        >
          <RangeRow
            fromValue={filters.yearFrom}
            toValue={filters.yearTo}
            onFrom={(v) => setField("yearFrom", v)}
            onTo={(v) => setField("yearTo", v)}
            fromPlaceholder="1976"
            toPlaceholder="2026"
          />
        </Section>

        <Section
          title="Пробег"
          open={openSection === "mileage"}
          onToggle={() => toggleSection("mileage")}
        >
          <RangeRow
            fromValue={filters.mileageFrom}
            toValue={filters.mileageTo}
            onFrom={(v) => setField("mileageFrom", v)}
            onTo={(v) => setField("mileageTo", v)}
          />
        </Section>

        <Section
          title="Технические"
          open={openSection === "tech"}
          onToggle={() => toggleSection("tech")}
        >
          <div className="space-y-4">
            <OptionRow
              label="Двигатель"
              options={toOptions(dicts?.fuel_types)}
              value={filters.fuel}
              onChange={(v) => setField("fuel", v)}
            />
            <OptionRow
              label="Коробка"
              options={toOptions(dicts?.transmission_types)}
              value={filters.transmission}
              anyLabel="Любая"
              onChange={(v) => setField("transmission", v)}
            />
            <OptionRow
              label="Привод"
              options={toOptions(dicts?.drive_types)}
              value={filters.drive}
              onChange={(v) => setField("drive", v)}
            />
            <OptionRow
              label="Кузов"
              options={toOptions(dicts?.body_types)}
              value={filters.bodyType}
              onChange={(v) => setField("bodyType", v)}
            />
          </div>
        </Section>

        <Section
          title="Дополнительно"
          open={openSection === "extra"}
          onToggle={() => toggleSection("extra")}
        >
          <OptionRow
            label="Цвет"
            options={toOptions(dicts?.colors)}
            value={filters.color}
            onChange={(v) => setField("color", v)}
          />
        </Section>
      </div>

      {/* Кнопка применения (§8.2) */}
      <div className="hairline-top p-4">
        <button
          type="button"
          onClick={() => {
            onApply(filters);
            onClose();
          }}
          className="btn w-full rounded-lg bg-primary py-4 text-[16px] font-medium text-primary-foreground"
        >
          Показать объявления{count > 0 ? ` (${count})` : ""}
        </button>
      </div>
    </BottomSheet>
  );
}
