"use client";

import { useState, useCallback } from "react";

export function useFavorites(initial?: Iterable<string>) {
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(initial)
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.has(id),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
