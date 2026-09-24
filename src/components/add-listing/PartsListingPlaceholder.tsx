"use client";

/**
 * PartsListingPlaceholder - временный компонент для раздела "Запчасти"
 *
 * На текущем этапе показывает только список категорий, без форм и без дальнейших шагов:
 * - Шины (реализовано - 9 шагов)
 * - Диски (реализовано - 9 шагов)
 * - Руль (реализовано - 7 секций)
 * - Оптика (реализовано - 8 секций)
 * - Ходовая часть (реализовано - 8 секций)
 * - Детали кузова (реализовано - 5 секций)
 * - Двигатель (реализовано - 7 секций)
 * - КПП (реализовано - 6 секций: Основная информация с маркой/моделью, Параметры КПП, Медиа, Описание, Цена, Контакты)
 * - Расходники (реализовано - 9 секций: Основная информация, Тип расходника, Параметры, Совместимость, Количество, Медиа, Описание, Цена, Контакты)
 *
 * При нажатии на категорию с реализованной формой открывается форма размещения объявления.
 * Для остальных категорий - временное наполнение, ничего не открывается.
 * Остальную информацию по запчастям добавим позже поэтапно.
 */

import { Fragment } from "react";
import { ArrowLeft, X } from "lucide-react";

interface PartsListingPlaceholderProps {
  onBack: () => void;
  onSelectCategory: (category: string) => void;
}

const PARTS_CATEGORIES = [
  "Шины",
  "Диски",
  "Руль",
  "Оптика",
  "Ходовая часть",
  "Детали кузова",
  "Двигатель",
  "КПП",
  "Расходники",
];

export function PartsListingPlaceholder({ onBack, onSelectCategory }: PartsListingPlaceholderProps) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b border-border bg-background"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="mx-auto flex h-14 w-full max-w-[720px] flex-row items-center px-4">
          <button type="button" onClick={onBack} className="flex size-8 items-center justify-center">
            <ArrowLeft color="#111111" size={20} />
          </button>
          <span className="flex-1 text-center text-[16px] font-semibold text-foreground">Запчасти</span>
          <button type="button" onClick={onBack} className="flex size-8 items-center justify-center">
            <X color="#111111" size={20} />
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="mx-auto w-full max-w-[720px] flex-1">
        <div className="bg-[#FFFFFF]">
          {PARTS_CATEGORIES.map((category, index) => (
            <Fragment key={category}>
              <button
                type="button"
                onClick={() => onSelectCategory(category)}
                className="flex h-14 w-full flex-col justify-center px-4 text-left active:bg-[#F7F7F7]"
              >
                <span className="text-[16px] font-normal text-[#000000]">{category}</span>
              </button>
              {/* Divider - don't show after last item */}
              {index < PARTS_CATEGORIES.length - 1 && <div className="ml-4 h-px bg-[#E5E5EA]" />}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
