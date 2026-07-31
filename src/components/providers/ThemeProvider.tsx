"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "autotoj-theme";
const THEME_EVENT = "autotoj-theme-change";

/**
 * Режим по умолчанию — светлый: приложение остаётся белым, пока пользователь
 * сам не выберет тёмную или системную тему в профиле.
 */
const DEFAULT_MODE: ThemeMode = "light";

/**
 * Inline script applying the stored theme before first paint (§2 «Переключение темы»).
 * Kept as a raw string so it runs ahead of hydration and never flashes the wrong palette.
 */
const SCRIPT = `(function(){try{var m=localStorage.getItem("${THEME_STORAGE_KEY}")||"${DEFAULT_MODE}";var d=m==="dark"||(m==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var e=document.documentElement;e.setAttribute("data-theme",d?"dark":"light");e.classList.toggle("dark",d);}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}

function apply(mode: ThemeMode) {
  const dark =
    mode === "dark" ||
    (mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const el = document.documentElement;
  el.setAttribute("data-theme", dark ? "dark" : "light");
  el.classList.toggle("dark", dark);
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

const readMode = (): ThemeMode =>
  (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) ?? DEFAULT_MODE;

/** Читает/сохраняет режим темы: Светлая / Тёмная / Системная. */
export function useTheme() {
  const mode = useSyncExternalStore<ThemeMode>(
    subscribe,
    readMode,
    () => DEFAULT_MODE,
  );

  // Системный режим следит за настройкой ОС
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readMode() === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    apply(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return { mode, setTheme };
}
