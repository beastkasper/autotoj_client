"use client";

import { useMemo, useState } from "react";
import type { CarListingForm } from "@/lib/types/listing";
import { useGetDictsQuery } from "@/lib/features/dicts/dictsApi";
import type { DictItem } from "@/lib/types/api";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";

interface StepEquipmentProps {
  form: CarListingForm;
  onUpdate: <K extends keyof CarListingForm>(key: K, value: CarListingForm[K]) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  safety: "Безопасность",
  comfort: "Комфорт",
  tech: "Мультимедиа и техника",
  exterior: "Экстерьер",
  interior: "Интерьер",
  utility: "Дополнительно",
};

const CATEGORY_ORDER = ["safety", "comfort", "tech", "exterior", "interior", "utility"];

export function StepEquipment({ form, onUpdate }: StepEquipmentProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const { data: dicts } = useGetDictsQuery();

  const grouped = useMemo(() => {
    const map = new Map<string, DictItem[]>();
    for (const opt of dicts?.options ?? []) {
      const key = opt.category ?? "utility";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(opt);
    }
    return CATEGORY_ORDER.flatMap((key) => {
      const items = map.get(key);
      if (!items?.length) return [];
      return [{ key, title: CATEGORY_LABELS[key] ?? key, items }];
    });
  }, [dicts]);

  const toggleItem = (id: string) => {
    const next = form.equipment.includes(id)
      ? form.equipment.filter((e) => e !== id)
      : [...form.equipment, id];
    onUpdate("equipment", next);
  };

  const toggleExpand = (key: string) => {
    setExpandedCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="text-[20px] font-bold font-[family-name:var(--font-manrope)]">
        Комплектация
      </h2>
      <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)] -mt-2">
        Необязательное. Отметьте опции вашего автомобиля.
      </p>

      {grouped.map(({ key, title, items }) => {
        const isExpanded = expandedCategories[key];
        const visibleItems = isExpanded ? items : items.slice(0, 6);
        const hasMore = items.length > 6;

        return (
          <div key={key} className="space-y-3">
            <h3 className="text-[16px] font-semibold font-[family-name:var(--font-manrope)]">
              {title}
            </h3>
            <div className="space-y-2.5">
              {visibleItems.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 cursor-pointer active:opacity-60"
                >
                  <Checkbox
                    checked={form.equipment.includes(item.id)}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="w-5 h-5 rounded-[6px] border-2 border-[#D1D1D6] data-[state=checked]:bg-black data-[state=checked]:border-black"
                  />
                  <span className="text-[15px] text-[#1C1C1E] font-[family-name:var(--font-manrope)]">
                    {item.name}
                  </span>
                </label>
              ))}
            </div>
            {hasMore && (
              <button
                type="button"
                onClick={() => toggleExpand(key)}
                className="flex items-center gap-1 text-[15px] font-medium text-[#D32F2F] font-[family-name:var(--font-manrope)]"
              >
                {isExpanded ? (
                  <>
                    Свернуть <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Показать всё <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
