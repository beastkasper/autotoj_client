"use client";

import { useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useDicts } from '@/lib/add-listing/dicts';
import { CustomCheckbox } from '@/components/add-listing/form/CustomCheckbox';

/** Если /dicts не загрузился — города как на проде (id — slug). */
export const FALLBACK_CITIES: { id: string; name: string }[] = [
  { id: 'dushanbe', name: 'Душанбе' },
  { id: 'khujand', name: 'Худжанд' },
  { id: 'kulob', name: 'Куляб' },
  { id: 'qurghonteppa', name: 'Курган-Тюбе' },
  { id: 'istaravshan', name: 'Истаравшан' },
  { id: 'tursunzoda', name: 'Турсунзаде' },
  { id: 'khorog', name: 'Хорог' },
  { id: 'isfara', name: 'Исфара' },
  { id: 'panjakent', name: 'Пенджикент' },
  { id: 'konibodom', name: 'Канибадам' },
];

/**
 * Город по slug'у ('dushanbe' — так его отдаёт GET /profile) или по названию
 * ('Душанбе'). Без совпадения — undefined.
 */
export function findCity<T extends { id: string; name: string }>(
  cities: readonly T[],
  value: string,
): T | undefined {
  const q = (value || '').trim().toLowerCase();
  if (!q) return undefined;
  return cities.find(c => c.id.toLowerCase() === q) ?? cities.find(c => c.name.trim().toLowerCase() === q);
}

/** Бэкенд: contact_name max_length=100. */
const NAME_MAX = 100;

/** '+992 93 555 11 22' / '992935551122' / '93 555 11 22' → '935551122' (не больше 9 цифр). */
function localDigits(value: string): string {
  let digits = (value || '').replace(/\D/g, '');
  if (digits.length > 9 && digits.startsWith('992')) digits = digits.slice(3);
  return digits.slice(0, 9);
}

/** '935551122' → '93 555 11 22' (частичный ввод форматируется по мере набора). */
function formatLocal(d: string): string {
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
  if (d.length <= 7) return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}`;
}

interface ContactsStepProps {
  name: string;
  /** 9 цифр номера без +992 (как в userStore). */
  phone: string;
  /** Название города из dicts.cities ('Душанбе'); бэкенд принимает и slug, и имя. */
  city: string;
  readyForOnlineViewing: boolean;
  onChangeName: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeCity: (value: string) => void;
  onToggleOnlineViewing: () => void;
  onNext: () => void;
}

const INPUT_CLASS =
  'mb-5 w-full border-b border-border bg-transparent pb-3 text-[16px] font-normal text-foreground outline-none placeholder:text-muted-foreground';

export function ContactsStep({
  name,
  phone,
  city,
  readyForOnlineViewing,
  onChangeName,
  onChangePhone,
  onChangeCity,
  onToggleOnlineViewing,
  onNext,
}: ContactsStepProps) {
  const { dicts } = useDicts();
  // Город выбирается из справочника: свободный текст ('г. Душанбе', 'Dushanbe')
  // бэкенд сохраняет как есть, и объявление потом не находится фильтром по городу.
  const cities = useMemo(
    () => (dicts?.cities?.length ? dicts.cities : FALLBACK_CITIES),
    [dicts],
  );
  const selectedCity = useMemo(() => findCity(cities, city), [cities, city]);

  // Профиль отдаёт город slug'ом ('dushanbe'): чип подсвечивается по id, но в
  // предпросмотре «Продавец» было бы видно сырое 'dushanbe' — приводим к названию.
  useEffect(() => {
    if (selectedCity && city !== selectedCity.name) onChangeCity(selectedCity.name);
  }, [selectedCity, city, onChangeCity]);

  const digits = localDigits(phone);
  const phoneValid = digits.length === 9;
  const phoneError = digits.length > 0 && !phoneValid ? 'Введите 9 цифр номера' : undefined;
  const isValid = name.trim() !== '' && phoneValid && !!selectedCity;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex w-full max-w-[720px] flex-col px-4 pb-10">
        <h2 className="mb-6 mt-4 text-[28px] font-bold text-foreground">Контакты</h2>

        <span className="mb-[6px] text-[14px] font-normal text-muted-foreground">Имя</span>
        <input
          className={INPUT_CLASS}
          placeholder="Ваше имя"
          value={name}
          maxLength={NAME_MAX}
          onChange={(e) => onChangeName(e.target.value)}
        />

        <span className="mb-[6px] text-[14px] font-normal text-muted-foreground">Телефон</span>
        <div
          className={cn(
            'flex flex-row items-center gap-2 border-b pb-3',
            phoneError ? 'mb-[6px] border-destructive' : 'mb-5 border-border',
          )}
        >
          <span className="text-[16px] font-normal text-foreground">+992</span>
          <input
            className="min-w-0 flex-1 bg-transparent p-0 text-[16px] font-normal text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="90 123 45 67"
            value={formatLocal(digits)}
            onChange={(e) => onChangePhone(localDigits(e.target.value))}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
          />
        </div>
        {phoneError && (
          <span className="mb-5 text-[13px] font-normal text-destructive">{phoneError}</span>
        )}

        <span className="mb-[6px] text-[14px] font-normal text-muted-foreground">Город</span>
        <div className="mb-6 mt-1 flex flex-row flex-wrap gap-2">
          {cities.map(option => {
            const isSelected = selectedCity?.id === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChangeCity(option.name)}
                aria-pressed={isSelected}
                className={cn(
                  'rounded-[20px] border px-4 py-[10px]',
                  isSelected ? 'border-foreground bg-foreground' : 'border-border bg-transparent',
                )}
              >
                <span
                  className={cn(
                    'text-[14px] font-medium',
                    isSelected ? 'text-background' : 'text-foreground',
                  )}
                >
                  {option.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mb-8">
          <CustomCheckbox
            label="Готов к онлайн-показу"
            checked={readyForOnlineViewing}
            onChange={onToggleOnlineViewing}
          />
        </div>

        {/* Continue */}
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className={cn(
            'flex h-[52px] items-center justify-center rounded-[12px]',
            isValid ? 'bg-foreground' : 'bg-border',
          )}
        >
          <span
            className={cn(
              'text-[16px] font-semibold',
              isValid ? 'text-background' : 'text-muted-foreground',
            )}
          >
            Продолжить
          </span>
        </button>
      </div>
    </div>
  );
}
