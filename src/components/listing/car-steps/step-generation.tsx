"use client";

import { useMemo } from "react";
import type { CarListingForm } from "@/lib/types/listing";
import { useGetGenerationsQuery } from "@/lib/features/dicts/dictsApi";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";

interface StepGenerationProps {
  form: CarListingForm;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

export function StepGeneration({ form, onUpdate }: StepGenerationProps) {
  const { data: generations, isFetching } = useGetGenerationsQuery(
    { model_id: form.model },
    { skip: !form.model }
  );

  const options = useMemo(
    () =>
      (generations ?? []).map((g) => ({
        id: g.id,
        label: g.year_to
          ? `${g.name} (${g.year_from}-${g.year_to})`
          : `${g.name} (${g.year_from}-)`,
      })),
    [generations]
  );

  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Поколение
      </h2>
      <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)] -mt-2">
        Необязательное поле
      </p>

      <BottomSheetSelect
        label="Выберите поколение"
        placeholder={
          isFetching
            ? "Загрузка..."
            : options.length === 0
              ? "Нет данных — можно указать вручную"
              : "Выберите поколение"
        }
        value={form.generation}
        options={options}
        onSelect={(v) => onUpdate("generation", v)}
        searchable={options.length > 8}
        searchPlaceholder="Поиск поколения..."
        allowCustom
        customLabel="Указать вручную"
        onAddCustom={(v) => onUpdate("generation", v)}
      />
    </div>
  );
}
