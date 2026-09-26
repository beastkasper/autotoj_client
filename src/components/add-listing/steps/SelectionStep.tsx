"use client";

import { useState, useMemo } from 'react';
import { Check, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectionItem {
  label: string;
  /** Optional stable id emitted via onSelect. Falls back to `label` when omitted (back-compat). */
  value?: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

const itemValue = (item: SelectionItem) => item.value ?? item.label;

interface SelectionStepProps {
  title: string;
  items: SelectionItem[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  /** When true, shows "add your own" when list is empty or no search results */
  allowCustom?: boolean;
  customPlaceholder?: string;
  /**
   * Максимальная длина своего значения. Бэкенд хранит марку/модель в
   * VARCHAR(100), поколение/кузов/цвет — в VARCHAR(50); длиннее → 500/422.
   */
  customMaxLength?: number;
  /** When provided, shows a "Skip" button */
  onSkip?: () => void;
  skipLabel?: string;
}

export function SelectionStep({
  title,
  items,
  selectedValue,
  onSelect,
  searchable = false,
  searchPlaceholder = 'Поиск',
  allowCustom = false,
  customPlaceholder = 'Введите своё значение',
  customMaxLength = 100,
  onSkip,
  skipLabel = 'Пропустить',
}: SelectionStepProps) {
  const [query, setQuery] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  // Поиск и ручной ввод относятся к одному шагу. CarListingForm монтирует каждый
  // шаг с собственным key; на случай формы без key — новый заголовок = новый шаг,
  // сбрасываем состояние прямо во время рендера. Иначе поиск марки «Toy»
  // переезжал на шаг «Год выпуска» и отфильтровывал все годы.
  const [stepTitle, setStepTitle] = useState(title);
  if (stepTitle !== title) {
    setStepTitle(title);
    setQuery('');
    setShowCustomInput(false);
    setCustomValue('');
  }

  const listIsEmpty = items.length === 0;

  const filtered = useMemo(() => {
    // Без поля поиска фильтр не применяется вовсе — его нельзя было бы очистить.
    if (!searchable || !query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter(item => item.label.toLowerCase().includes(q));
  }, [items, query, searchable]);

  // Show "add your own" when: list is empty, or search has no results
  const showAddOwn = allowCustom && !showCustomInput && (
    listIsEmpty || (query.trim() !== '' && filtered.length === 0)
  );

  // For empty list + allowCustom, always show custom input mode
  const effectiveShowCustom = showCustomInput || (allowCustom && listIsEmpty);

  const handleSubmitCustom = () => {
    const value = customValue.trim().slice(0, customMaxLength);
    if (value) {
      // «Своё» значение, совпадающее с пунктом списка («toyota»), выбирает этот
      // пункт: иначе марка ушла бы текстом и каскад моделей не загрузился.
      const lower = value.toLowerCase();
      const match = items.find(item => item.label.trim().toLowerCase() === lower);
      onSelect(match ? itemValue(match) : value);
      setCustomValue('');
      setShowCustomInput(false);
    }
  };

  const renderItem = (item: SelectionItem) => {
    const v = itemValue(item);
    const isSelected = v === selectedValue;
    return (
      <button
        type="button"
        key={v}
        onClick={() => onSelect(v)}
        className="flex w-full flex-row items-center border-b-[0.5px] border-border py-4 text-left"
      >
        {item.icon && <div className="mr-3 flex w-8 flex-col items-center">{item.icon}</div>}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[16px] font-normal text-foreground">
            {item.label}
          </span>
          {item.subtitle && (
            <span className="mt-[2px] text-[13px] font-normal text-muted-foreground">
              {item.subtitle}
            </span>
          )}
        </div>
        {isSelected && (
          <Check className="size-5 shrink-0 text-foreground" strokeWidth={2} />
        )}
      </button>
    );
  };

  const renderListFooter = () => {
    if (!allowCustom || listIsEmpty) return null;

    // "Add your own" button always at the bottom of the list
    if (!showAddOwn && !showCustomInput && filtered.length > 0) {
      return (
        <button
          type="button"
          onClick={() => setShowCustomInput(true)}
          className="mt-2 flex w-full flex-row items-center gap-[10px] border-t-[0.5px] border-border py-4"
        >
          <Plus className="size-[18px] text-primary" strokeWidth={2} />
          <span className="text-[16px] font-medium text-primary">
            Добавить своё
          </span>
        </button>
      );
    }

    return null;
  };

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col px-4">
      <h2 className="mb-4 mt-4 text-[28px] font-bold text-foreground">{title}</h2>

      {/* Search bar (when list has items) */}
      {searchable && !listIsEmpty && (
        <div className="mb-2 flex h-[44px] shrink-0 flex-row items-center gap-2 rounded-[10px] bg-secondary px-3">
          <Search className="size-[18px] shrink-0 text-muted-foreground" />
          <input
            className="h-[44px] min-w-0 flex-1 bg-transparent p-0 text-[16px] font-normal text-foreground outline-none placeholder:text-muted-foreground"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      )}

      {/* Custom input mode: empty list or user chose "add your own" */}
      {effectiveShowCustom ? (
        <div className="flex flex-col pt-2">
          <div className="mb-6 border-b border-border pb-3">
            <input
              className="w-full bg-transparent p-0 text-[22px] font-normal text-foreground outline-none placeholder:text-muted-foreground"
              placeholder={customPlaceholder}
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              maxLength={customMaxLength}
              autoFocus
              enterKeyHint="done"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmitCustom();
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleSubmitCustom}
            disabled={!customValue.trim()}
            className={cn(
              'mb-3 flex h-[52px] items-center justify-center rounded-[12px]',
              customValue.trim() ? 'bg-foreground' : 'bg-border',
            )}
          >
            <span
              className={cn(
                'text-[16px] font-semibold',
                customValue.trim() ? 'text-background' : 'text-muted-foreground',
              )}
            >
              Продолжить
            </span>
          </button>

          {/* Back to list if it's not an empty list */}
          {!listIsEmpty && (
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(false);
                setCustomValue('');
              }}
              className="flex items-center justify-center py-3"
            >
              <span className="text-[15px] font-medium text-primary">
                Выбрать из списка
              </span>
            </button>
          )}

          {/* Skip button for optional steps */}
          {onSkip && (
            <button type="button" onClick={onSkip} className="mt-1 flex items-center justify-center py-3">
              <span className="text-[15px] font-medium text-muted-foreground">
                {skipLabel}
              </span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Skip button above the list for optional steps */}
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="mb-1 w-full shrink-0 border-b-[0.5px] border-border py-[14px] text-left"
            >
              <span className="text-[16px] font-medium text-primary">
                {skipLabel}
              </span>
            </button>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filtered.length === 0
              ? (showAddOwn ? (
                <div className="flex flex-col items-center pt-6">
                  <span className="mb-4 text-[15px] font-normal text-muted-foreground">
                    Ничего не найдено
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomInput(true);
                      setCustomValue(query.trim().slice(0, customMaxLength));
                    }}
                    className="flex flex-row items-center gap-[10px] self-stretch rounded-[12px] bg-secondary px-5 py-[14px]"
                  >
                    <Plus className="size-5 shrink-0 text-primary" strokeWidth={2} />
                    <span className="text-[16px] font-medium text-foreground">
                      Добавить «{query.trim()}»
                    </span>
                  </button>
                </div>
              ) : query.trim() !== '' ? (
                <div className="flex flex-col items-center pt-6">
                  <span className="text-[15px] font-normal text-muted-foreground">
                    Ничего не найдено
                  </span>
                </div>
              ) : null)
              : filtered.map(renderItem)}
            {renderListFooter()}
          </div>
        </>
      )}
    </div>
  );
}
