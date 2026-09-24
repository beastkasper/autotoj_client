"use client";

import { useEffect, useState } from "react";

/**
 * Значение с задержкой.
 *
 * Поисковые строки в разделах шли в query-параметры напрямую, поэтому на
 * каждое нажатие клавиши уходил отдельный запрос к API — «Toyota Camry»
 * порождала 12 запросов, а на мобильной сети это ещё и заметные тормоза.
 */
export function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
