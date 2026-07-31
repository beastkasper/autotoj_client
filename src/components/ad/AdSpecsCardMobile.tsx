"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";

export interface SpecEntry {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface AdSpecsCardMobileProps {
  specs: SpecEntry[];
  /** Сколько характеристик показывать до «Подробнее» */
  visibleCount?: number;
}

/**
 * Карточка характеристик (DESIGN.md §10.2): r24, p20, shadow-panel,
 * сетка 2 колонки gap16; иконка 24 в боксе 40×40, лейбл 13 muted, значение 17/600.
 */
export function AdSpecsCardMobile({ specs, visibleCount = 6 }: AdSpecsCardMobileProps) {
  const [expanded, setExpanded] = useState(false);
  if (specs.length === 0) return null;

  const shown = expanded ? specs : specs.slice(0, visibleCount);
  const canExpand = specs.length > visibleCount;

  return (
    <section>
      <h2 className="mb-3 text-[17px] font-semibold text-foreground">Характеристики</h2>
      <div className="rounded-[24px] bg-card p-5 shadow-[var(--shadow-panel)]">
        <div className="grid grid-cols-2 gap-4">
          {shown.map((spec) => {
            const Icon = spec.icon;
            return (
              <div key={spec.label} className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
                  <Icon className="size-6 text-foreground" strokeWidth={1.5} />
                </span>
                <span className="min-w-0">
                  <span className="mb-1 block text-[13px] text-muted-foreground">
                    {spec.label}
                  </span>
                  <span className="line-1 block text-[17px] font-semibold text-foreground">
                    {spec.value}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {canExpand && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 flex w-full items-center justify-center gap-1 py-3 text-[15px] font-medium text-foreground"
          >
            {expanded ? "Свернуть" : "Подробнее"}
            {expanded ? (
              <ChevronUp className="size-5" strokeWidth={1.5} />
            ) : (
              <ChevronDown className="size-5" strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
    </section>
  );
}
