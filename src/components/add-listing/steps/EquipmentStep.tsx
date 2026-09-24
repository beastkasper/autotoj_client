"use client";

import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EquipmentCategory {
  name: string;
  items: string[];
}

const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  { name: 'Комфорт', items: ['Кондиционер', 'Климат-контроль', 'Двухзонный климат-контроль', 'Круиз-контроль', 'Адаптивный круиз-контроль', 'Электростеклоподъёмники', 'Электропривод сидений', 'Электропривод зеркал', 'Подогрев сидений', 'Подогрев задних сидений', 'Подогрев руля', 'Подогрев зеркал', 'Вентиляция сидений', 'Массаж сидений', 'Запуск кнопкой (Start/Stop)', 'Бесключевой доступ'] },
  { name: 'Безопасность', items: ['ABS', 'ESP / ESC', 'Подушки безопасности (фронтальные)', 'Подушки безопасности (боковые)', 'Подушки безопасности (шторки)', 'Isofix', 'Иммобилайзер', 'Сигнализация', 'Центральный замок', 'Контроль давления в шинах', 'Контроль слепых зон', 'Удержание в полосе', 'Ассистент старта в гору', 'Автоматическое экстренное торможение'] },
  { name: 'Мультимедиа', items: ['Мультимедийная система', 'Сенсорный экран', 'Навигация', 'Bluetooth', 'USB', 'Apple CarPlay', 'Android Auto', 'Голосовое управление', 'Проекция на лобовое стекло (HUD)', 'Цифровая приборная панель', 'Аудиосистема премиум'] },
  { name: 'Экстерьер', items: ['Легкосплавные диски', 'Противотуманные фары', 'LED фары', 'Ксенон', 'Дневные ходовые огни', 'Люк', 'Панорамная крыша', 'Рейлинги на крыше', 'Тонированные стёкла'] },
  { name: 'Интерьер', items: ['Кожаный салон', 'Тканевый салон', 'Комбинированный салон', 'Спортивные сиденья', 'Регулировка руля', 'Многофункциональный руль', 'Подсветка салона'] },
  { name: 'Практичность', items: ['Камера заднего вида', 'Камеры 360°', 'Парктроники (передние)', 'Парктроники (задние)', 'Электропривод багажника', 'Складные задние сиденья', 'Розетка 12V'] },
];

interface EquipmentStepProps {
  selected: Set<string>;
  onToggle: (item: string) => void;
  onNext: () => void;
}

export function EquipmentStep({ selected, onToggle, onNext }: EquipmentStepProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleCategory = useCallback((name: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex w-full max-w-[720px] flex-col px-4 pb-[100px]">
          <h2 className="mb-1 mt-4 text-[28px] font-bold text-foreground">Комплектация</h2>
          {selected.size > 0 && (
            <span className="mb-4 text-[14px] font-normal text-muted-foreground">
              Выбрано: {selected.size}
            </span>
          )}

          {EQUIPMENT_CATEGORIES.map(category => {
            const isExpanded = expanded.has(category.name);
            const categorySelectedCount = category.items.filter(i => selected.has(i)).length;

            return (
              <div key={category.name} className="mb-2 overflow-hidden rounded-[12px] bg-secondary">
                <button
                  type="button"
                  onClick={() => toggleCategory(category.name)}
                  className="flex w-full flex-row items-center justify-between px-4 py-[14px]"
                >
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-[16px] font-semibold text-foreground">
                      {category.name}
                    </span>
                    {categorySelectedCount > 0 && (
                      <div className="flex h-[20px] min-w-[20px] items-center justify-center rounded-[10px] bg-primary px-[6px]">
                        <span className="text-[12px] font-semibold text-[#FFFFFF]">{categorySelectedCount}</span>
                      </div>
                    )}
                  </div>
                  {isExpanded
                    ? <ChevronUp className="size-[18px] text-muted-foreground" />
                    : <ChevronDown className="size-[18px] text-muted-foreground" />
                  }
                </button>

                {isExpanded && (
                  <div className="flex flex-col px-4">
                    {category.items.map(item => {
                      const isSelected = selected.has(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => onToggle(item)}
                          className="flex w-full flex-row items-center justify-between border-b-[0.5px] border-border py-3 text-left"
                        >
                          <span className="flex-1 text-[15px] font-normal text-foreground">
                            {item}
                          </span>
                          <div
                            className={cn(
                              'flex size-[22px] shrink-0 items-center justify-center rounded-[6px] border-[1.5px]',
                              isSelected ? 'border-primary bg-primary' : 'border-border bg-transparent',
                            )}
                          >
                            {isSelected && <Check color="#FFFFFF" size={14} strokeWidth={2.5} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue button fixed at bottom */}
      <div className="absolute inset-x-0 bottom-0 border-t-[0.5px] border-border bg-background px-4 pb-8 pt-3">
        <div className="mx-auto w-full max-w-[720px]">
          <button
            type="button"
            onClick={onNext}
            className="flex h-[52px] w-full items-center justify-center rounded-[12px] bg-foreground"
          >
            <span className="text-[16px] font-semibold text-background">
              Продолжить
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
