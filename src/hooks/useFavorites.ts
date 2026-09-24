"use client";

import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "@/lib/features/favorites/favoritesApi";

/**
 * Избранное, синхронизированное с сервером.
 *
 * Раньше это был чистый useState: клик по сердечку в ленте не отправлял ни
 * одного запроса, объявление не попадало в /favorites, а уже добавленные
 * объявления показывались с пустым сердечком, потому что начальное состояние
 * ниоткуда не подгружалось.
 *
 * Гостю запрос не отправляется вовсе — иначе на каждой странице ловим 401,
 * который вдобавок запускает попытку refresh в baseQuery.
 */
export function useFavorites() {
  const { isAuthenticated, requireAuth } = useAuth();

  const { data } = useGetFavoritesQuery(
    { page: 1, limit: 100 },
    { skip: !isAuthenticated },
  );
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  // Локальные переопределения поверх серверного списка: сердечко должно
  // закраситься сразу, не дожидаясь инвалидации кэша.
  const [pending, setPending] = useState<Record<string, boolean>>({});

  const serverIds = useMemo(
    () => new Set((data?.ads ?? []).map((ad) => ad.id)),
    [data],
  );

  const isFavorite = useCallback(
    (id: string) => pending[id] ?? serverIds.has(id),
    [pending, serverIds],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      requireAuth(async () => {
        const next = !(pending[id] ?? serverIds.has(id));
        setPending((prev) => ({ ...prev, [id]: next }));
        try {
          if (next) await addFavorite(id).unwrap();
          else await removeFavorite(id).unwrap();
        } catch {
          // Откатываем оптимистичное изменение — иначе сердечко врёт.
          setPending((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
          });
        }
      });
    },
    [requireAuth, pending, serverIds, addFavorite, removeFavorite],
  );

  const favorites = useMemo(() => {
    const set = new Set(serverIds);
    for (const [id, on] of Object.entries(pending)) {
      if (on) set.add(id);
      else set.delete(id);
    }
    return set;
  }, [serverIds, pending]);

  return { favorites, toggleFavorite, isFavorite };
}
