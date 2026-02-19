"use client";

import { useState, useEffect, useCallback } from "react";

interface UseSearchOptions {
  debounceMs?: number;
}

export function useSearch({ debounceMs = 300 }: UseSearchOptions = {}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const clearQuery = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  return { query, debouncedQuery, setQuery, clearQuery };
}
