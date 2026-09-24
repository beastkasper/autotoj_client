import type { DictItem } from '@/lib/types/api';

/**
 * Резервные справочники для форм подачи объявлений.
 *
 * Live API (GET /dicts) сейчас отдаёт ПУСТЫЕ списки для fuel_types, drive_types,
 * body_types и steering_positions, а GET /brands?type=moto|commercial — 0 марок.
 * Без запасного списка шаги мастера «Двигатель / Привод / Руль» в CarListingForm
 * рендерят ноль вариантов и не дают пройти дальше (у них нет ни allowCustom, ни onSkip).
 *
 * Ids совпадают со slug-соглашением бэкенда ('automatic', 'white', ...), чтобы
 * при появлении настоящих справочников уже сохранённые объявления не разъехались.
 */

export const FALLBACK_FUEL_TYPES: DictItem[] = [
  { id: 'petrol', name: 'Бензин' },
  { id: 'diesel', name: 'Дизель' },
  { id: 'hybrid', name: 'Гибрид' },
  { id: 'electric', name: 'Электро' },
  { id: 'gas', name: 'Газ' },
];

export const FALLBACK_DRIVE_TYPES: DictItem[] = [
  { id: 'front', name: 'Передний' },
  { id: 'rear', name: 'Задний' },
  { id: 'all', name: 'Полный' },
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
