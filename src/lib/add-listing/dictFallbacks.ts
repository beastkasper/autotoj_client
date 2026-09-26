import type { DictItem } from '@/lib/types/api';

/**
 * Резервные справочники для форм подачи объявлений.
 *
 * Используются, только если GET /dicts не ответил или вернул пустой список
 * (нет сети, старый бэкенд). Без запасного списка шаги мастера «Двигатель / Привод / Руль»
 * рендерили бы ноль вариантов и не давали пройти дальше.
 *
 * Ids обязаны совпадать со slug'ами прод-справочника /dicts ('fwd', 'gas_petrol', 'white', …):
 * объявление, поданное с запасным списком, иначе не находится фильтрами поиска.
 */

export const FALLBACK_FUEL_TYPES: DictItem[] = [
  { id: 'petrol', name: 'Бензин' },
  { id: 'diesel', name: 'Дизель' },
  { id: 'hybrid', name: 'Гибрид' },
  { id: 'electric', name: 'Электро' },
  { id: 'gas_petrol', name: 'Газ/Бензин' },
];

export const FALLBACK_DRIVE_TYPES: DictItem[] = [
  { id: 'fwd', name: 'Передний' },
  { id: 'rwd', name: 'Задний' },
  { id: 'awd', name: 'Полный' },
];

export const FALLBACK_BODY_TYPES: DictItem[] = [
  { id: 'sedan', name: 'Седан' },
  { id: 'hatchback', name: 'Хэтчбек' },
  { id: 'suv', name: 'Внедорожник' },
  { id: 'crossover', name: 'Кроссовер' },
  { id: 'wagon', name: 'Универсал' },
  { id: 'coupe', name: 'Купе' },
  { id: 'minivan', name: 'Минивэн' },
  { id: 'pickup', name: 'Пикап' },
  { id: 'van', name: 'Фургон' },
];

export const FALLBACK_STEERING_POSITIONS: DictItem[] = [
  { id: 'left', name: 'Левый' },
  { id: 'right', name: 'Правый' },
];

/** Возвращает список из API, а если он пустой/отсутствует — резервный. */
export function withFallback<T>(list: T[] | null | undefined, fallback: T[]): T[] {
  return list && list.length > 0 ? list : fallback;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * true, если значение похоже на UUID справочника. Марка/модель, введённые вручную
 * через «Добавить марку», хранятся как обычные имена — их нельзя отправлять в
 * GET /models?brand_id=… (бэкенд требует UUID и отвечает 422).
 */
export function isUuid(value: string | null | undefined): boolean {
  return !!value && UUID_RE.test(value);
}

/** Id для каскада марка → модель: UUID проходит, введённое вручную имя — нет. */
export function cascadeId(value: string | null | undefined): string | undefined {
  return isUuid(value) ? (value as string) : undefined;
}
