/**
 * Перевод слагов бэкенда в русские названия для интерфейса.
 *
 * Раньше единого места перевода не было, и слаги протекали в UI:
 * «Категория: tires», «23 сентября 2026, khujand», темы бортжурнала
 * «maintenance» / «road_trips». Теперь любой вывод слага идёт через `label()`.
 *
 * Неизвестный слаг возвращается как есть — это лучше пустоты, и такой случай
 * сразу видно в интерфейсе.
 */

import {
  FALLBACK_BODY_TYPES,
  FALLBACK_FUEL_TYPES,
  FALLBACK_DRIVE_TYPES,
  FALLBACK_STEERING_POSITIONS,
  FALLBACK_TRANSMISSION_TYPES,
  FALLBACK_CONDITIONS,
  FALLBACK_COLORS,
  FALLBACK_CITIES,
} from "@/lib/data/dict-fallbacks";

function toMap(list: { id: string; name: string }[]): Record<string, string> {
  return Object.fromEntries(list.map((x) => [x.id, x.name]));
}

export const CITY_LABELS: Record<string, string> = toMap(FALLBACK_CITIES);

export const PART_TYPE_LABELS: Record<string, string> = {
  tires: "Шины",
  wheels: "Диски",
  steering_wheel: "Руль",
  optics: "Оптика",
  suspension: "Ходовая часть",
  body_parts: "Детали кузова",
  engine: "Двигатель",
  transmission: "КПП",
  consumables: "Расходники",
};

export const LOGBOOK_CATEGORY_LABELS: Record<string, string> = {
  no_topic: "Без темы",
  automatics: "Автоматика",
  advice: "Прошу совета",
  road_trips: "Автопутешествия",
  breakdown: "Поломка",
  maintenance: "ТО",
  repair: "Ремонт",
  tuning: "Тюнинг",
  purchase: "Покупка",
  gadgets: "Гаджеты",
};

/** Обратное отображение: русское название темы → слаг для POST /logbook. */
export const LOGBOOK_CATEGORY_SLUGS: Record<string, string> = Object.fromEntries(
  Object.entries(LOGBOOK_CATEGORY_LABELS).map(([slug, name]) => [name, slug]),
);

export const RENTAL_CLASS_LABELS: Record<string, string> = {
  economy: "Эконом",
  comfort: "Комфорт",
  business: "Бизнес",
  premium: "Премиум",
  suv: "Внедорожник",
  minivan: "Минивэн",
  convertible: "Кабриолет",
  sport: "Спортивный",
};

export const PLATE_CATEGORY_LABELS: Record<string, string> = {
  beautiful: "Красивый",
  lucky: "Счастливый",
  standard: "Стандартный",
};

export const CONDITION_LABELS: Record<string, string> = {
  ...toMap(FALLBACK_CONDITIONS),
  new: "Новое",
  used: "Б/у",
};

export const STATUS_LABELS: Record<string, string> = {
  draft: "Черновик",
  moderation: "На модерации",
  active: "Активно",
  archived: "В архиве",
  rejected: "Отклонено",
  sold: "Продано",
};

export const BODY_LABELS: Record<string, string> = {
  ...toMap(FALLBACK_BODY_TYPES),
  truck: "Грузовик",
  tipper: "Самосвал",
};

export const FUEL_LABELS: Record<string, string> = {
  ...toMap(FALLBACK_FUEL_TYPES),
  petrol_injector: "Инжектор",
  petrol_carb: "Карбюратор",
  diesel_gas: "Дизель + газ",
};

export const DRIVE_LABELS: Record<string, string> = {
  ...toMap(FALLBACK_DRIVE_TYPES),
  // Бэкенд исторически отдаёт и короткие, и длинные варианты одного и того же.
  front: "Передний",
  rear: "Задний",
  full: "Полный",
  chain: "Цепь",
  belt: "Ремень",
  cardan: "Кардан",
};

export const TRANSMISSION_LABELS: Record<string, string> = {
  ...toMap(FALLBACK_TRANSMISSION_TYPES),
  gears_1: "1 передача",
  gears_4: "4 передачи",
  gears_5: "5 передач",
  gears_6: "6 передач",
  variator: "Вариатор",
};

export const COLOR_LABELS: Record<string, string> = toMap(FALLBACK_COLORS);

export const TIRE_TYPE_LABELS: Record<string, string> = {
  summer: "Летние",
  winter: "Зимние",
  all_season: "Всесезонные",
};

export const WHEEL_TYPE_LABELS: Record<string, string> = {
  alloy: "Литые",
  forged: "Кованые",
  steel: "Штампованные",
};

export const BODY_PART_LABELS: Record<string, string> = {
  bumper: "Бампер", hood: "Капот", fender: "Крыло", door: "Дверь",
  trunk_lid: "Крышка багажника", roof: "Крыша", sill: "Порог",
  body_panel: "Панель кузова", longerone: "Лонжерон",
  grille: "Решётка радиатора", mirror: "Зеркало", glass: "Стекло",
  headlight: "Фара", taillight: "Фонарь", molding: "Молдинг",
  bumper_reinforcement: "Усилитель бампера", fender_liner: "Подкрылок",
  engine_guard: "Защита двигателя",
};

export const SIDE_LABELS: Record<string, string> = {
  left: "Левая", right: "Правая", front: "Передняя", rear: "Задняя", set: "Комплект",
};

export const PTS_LABELS: Record<string, string> = {
  original: "Оригинал",
  duplicate: "Дубликат",
  none: "Нет ПТС",
  electronic: "Электронный",
};

export const STEERING_LABELS: Record<string, string> = toMap(FALLBACK_STEERING_POSITIONS);

const ALL: Record<string, string> = {
  ...CITY_LABELS,
  ...PART_TYPE_LABELS,
  ...LOGBOOK_CATEGORY_LABELS,
  ...RENTAL_CLASS_LABELS,
  ...PLATE_CATEGORY_LABELS,
  ...STATUS_LABELS,
  ...BODY_LABELS,
  ...FUEL_LABELS,
  ...DRIVE_LABELS,
  ...TRANSMISSION_LABELS,
  ...COLOR_LABELS,
  ...CONDITION_LABELS,
  ...STEERING_LABELS,
  ...PTS_LABELS,
  ...TIRE_TYPE_LABELS,
  ...WHEEL_TYPE_LABELS,
  ...BODY_PART_LABELS,
};

/**
 * Переводит слаг в русское название.
 * Можно сузить поиск конкретным словарём, чтобы избежать коллизий
 * (например, `suv` есть и среди кузовов, и среди классов аренды):
 *
 *   label(part.part_type, PART_TYPE_LABELS)
 *   label(ad.city)                            // поиск по всем словарям
 */
export function label(
  slug: string | null | undefined,
  dict?: Record<string, string>,
): string {
  if (!slug) return "";
  const source = dict ?? ALL;
  return source[slug] ?? ALL[slug] ?? slug;
}

/** То же, но для пустого значения отдаёт прочерк — удобно в таблицах характеристик. */
export function labelOrDash(
  slug: string | null | undefined,
  dict?: Record<string, string>,
): string {
  return label(slug, dict) || "—";
}
