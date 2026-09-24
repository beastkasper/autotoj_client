/**
 * Русское склонение существительных после числительного.
 *
 * Раньше по разделам было захардкожено «Найдено {n} номеров» / «{n} автомобилей»,
 * из-за чего на экране появлялось «Найдено 1 номеров».
 *
 *   plural(1, ["объявление", "объявления", "объявлений"])  → "объявление"
 *   plural(3, ...)  → "объявления"
 *   plural(21, ...) → "объявление"
 */
export function plural(count: number, forms: [string, string, string]): string {
  const n = Math.abs(Math.trunc(count));
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  const mod10 = n % 10;
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}

/** Число вместе со склонённым словом: «1 номер», «5 номеров». */
export function pluralize(count: number, forms: [string, string, string]): string {
  return `${count} ${plural(count, forms)}`;
}

// ── Готовые наборы форм ──
export const WORD_ADS: [string, string, string] = ["объявление", "объявления", "объявлений"];
export const WORD_PLATES: [string, string, string] = ["номер", "номера", "номеров"];
export const WORD_CARS: [string, string, string] = ["автомобиль", "автомобиля", "автомобилей"];
export const WORD_COMPANIES: [string, string, string] = ["компания", "компании", "компаний"];
export const WORD_REVIEWS: [string, string, string] = ["отзыв", "отзыва", "отзывов"];
export const WORD_COMMENTS: [string, string, string] = ["комментарий", "комментария", "комментариев"];
export const WORD_PHOTOS: [string, string, string] = ["фото", "фото", "фото"];
