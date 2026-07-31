"use client";

import { useCallback, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { BottomSheet } from "@/components/layout/bottom-sheet";
import { cn } from "@/lib/utils";

interface LanguageSheetProps {
  open: boolean;
  onClose: () => void;
}

const STORAGE_KEY = "autotoj-language";
const LANG_EVENT = "autotoj-language-change";

const LANGUAGES = [
  { code: "ru", native: "Русский", translated: "Русский язык" },
  { code: "tg", native: "Тоҷикӣ", translated: "Таджикский язык" },
] as const;

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(LANG_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LANG_EVENT, onChange);
  };
}

/** Шит выбора языка (DESIGN.md §10.22): радиус сверху 20, опции r16 border 2px. */
export function LanguageSheet({ open, onClose }: LanguageSheetProps) {
  const lang = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(STORAGE_KEY) ?? "ru",
    () => "ru",
  );

  const pick = useCallback((code: string) => {
    localStorage.setItem(STORAGE_KEY, code);
    window.dispatchEvent(new Event(LANG_EVENT));
  }, []);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      radius={20}
      showHandle={false}
      ariaLabel="Язык"
    >
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <h2 className="text-[22px] font-bold text-foreground">Язык</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="grid size-8 place-items-center rounded-full bg-secondary"
        >
          <X className="size-4 text-foreground" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-5 pb-8">
        {LANGUAGES.map((item) => {
          const selected = lang === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => pick(item.code)}
              className={cn(
                "flex items-center justify-between rounded-2xl border-2 bg-card p-4 text-left transition-colors",
                selected ? "border-foreground" : "border-border",
              )}
            >
              <span>
                <span className="block text-[17px] font-semibold text-foreground">
                  {item.native}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted-foreground">
                  {item.translated}
                </span>
              </span>
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full border-2",
                  selected ? "border-foreground bg-foreground" : "border-border",
                )}
              >
                {selected && <span className="size-2 rounded-full bg-background" />}
              </span>
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
