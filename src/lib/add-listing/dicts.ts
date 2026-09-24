"use client";

/**
 * Веб-аналог autoToj-app/src/contexts/DictsContext.tsx поверх RTK Query:
 * useDicts() — все справочники /dicts, useBrandCascade() — марка → модель →
 * поколение. Формы подачи используют ровно тот же интерфейс, что и в мобилке.
 */

import { useCallback } from "react";
import {
  useGetDictsQuery,
  useGetBrandsQuery,
  useGetModelsQuery,
  useGetGenerationsQuery,
} from "@/lib/features/dicts/dictsApi";
import type { Brand, DictItem, DictsResponse, Generation, Model } from "@/lib/types/api";

export type { Brand, DictItem, DictsResponse, Generation, Model };

export function useDicts() {
  const { data, isLoading, error, refetch } = useGetDictsQuery();

  const labelFor = useCallback((items: DictItem[] | undefined, id: string) => {
    if (!id) return "";
    const match = items?.find((it) => it.id === id);
    return match?.name ?? id;
  }, []);

  return {
    dicts: (data ?? null) as DictsResponse | null,
    loading: isLoading,
    error: error ? "Не удалось загрузить справочники" : null,
    refresh: async () => {
      await refetch();
    },
    labelFor,
  };
}

const EMPTY_BRANDS: Brand[] = [];
const EMPTY_MODELS: Model[] = [];
const EMPTY_GENERATIONS: Generation[] = [];

export function useBrandCascade(
  vehicleType: "cars" | "car" | "moto" | "commercial",
  brandId: string | undefined,
  modelId: string | undefined,
) {
  const { data: brands } = useGetBrandsQuery({ type: vehicleType });
  const { data: models } = useGetModelsQuery({ brand_id: brandId ?? "" }, { skip: !brandId });
  const { data: generations } = useGetGenerationsQuery(
    { model_id: modelId ?? "" },
    { skip: !modelId },
  );

  return {
    brands: brands ?? EMPTY_BRANDS,
    models: brandId ? (models ?? EMPTY_MODELS) : EMPTY_MODELS,
    generations: modelId ? (generations ?? EMPTY_GENERATIONS) : EMPTY_GENERATIONS,
  };
}
