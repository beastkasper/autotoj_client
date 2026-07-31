"use client";

import { X } from "lucide-react";
import { BottomSheet } from "@/components/layout/bottom-sheet";
import { useTheme, type ThemeMode } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeSheetProps {
  open: boolean;
  onClose: () => void;
}

const OPTIONS: { mode: ThemeMode; label: string }[] = [
  { mode: "light", label: "Светлая" },
  { mode: "dark", label: "Тёмная" },
  { mode: "system", label: "Системная" },
];

/** Превью экрана внутри карточки выбора темы (§10.21). */
function Preview({ mode }: { mode: ThemeMode }) {
  const isDark = mode === "dark";
  const bg = isDark ? "#1C1C1E" : "#FFFFFF";
  const border = isDark ? "#2C2C2E" : "#E5E5EA";
  const bar = isDark ? "#3A3A3C" : "#E5E5EA";

  return (
    <div
      className="flex aspect-[9/16] flex-col gap-2 rounded-[20px] border-2 p-3"
      style={{
        background:
          mode === "system"
            ? "linear-gradient(90deg, #FFFFFF 50%, #1C1C1E 50%)"
            : bg,
        borderColor: border,
      }}
    >
      <span
        className="h-3 w-2/3 rounded"
        style={{ background: mode === "system" ? "#E5E5EA" : bar }}
      />
      <span
        className="h-8 rounded-md"
        style={{ background: mode === "system" ? "#E5E5EA" : bar }}
      />
      <span
        className="h-8 rounded-md"
        style={{ background: mode === "system" ? "#3A3A3C" : bar }}
      />
    </div>
  );
}

/** Шит выбора темы (DESIGN.md §10.21): радиус сверху 28, три превью в ряд. */
export function ThemeSheet({ open, onClose }: ThemeSheetProps) {
  const { mode, setTheme } = useTheme();

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      radius={28}
      showHandle={false}
      ariaLabel="Тема оформления"
      className="shadow-[0_-4px_24px_rgba(0,0,0,0.15)]"
    >
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <h2 className="text-[22px] font-bold text-foreground">Тема оформления</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="grid size-8 place-items-center rounded-full bg-secondary"
        >
          <X className="size-4 text-foreground" strokeWidth={1.5} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 px-5 pb-6">
        {OPTIONS.map((opt) => {
          const selected = mode === opt.mode;
          return (
            <button
              key={opt.mode}
              type="button"
              onClick={() => setTheme(opt.mode)}
              className="text-center"
            >
              <Preview mode={opt.mode} />
              <span className="mt-2 block text-[15px] font-semibold text-foreground">
                {opt.label}
              </span>
              <span
                className={cn(
                  "mx-auto mt-2 grid size-6 place-items-center rounded-full border-2",
                  selected ? "border-foreground bg-foreground" : "border-border",
                )}
              >
                {selected && (
                  <span className="size-2 rounded-full bg-background" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
