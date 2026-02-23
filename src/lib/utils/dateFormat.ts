const MONTHS_SHORT = [
  "янв", "фев", "мар", "апр", "мая", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];

const MONTHS_FULL = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

/**
 * Formats a date string with full month name, year and city.
 * Example: "18 января 2026, Душанбе"
 */
export function formatFullDateWithCity(dateStr: string, city: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = MONTHS_FULL[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}, ${city}`;
}

/**
 * Formats a date string with city context.
 * - Today → "Сегодня, Душанбе"
 * - Yesterday → "Вчера, Худжанд"
 * - Older → "18 янв, Душанбе"
 */
export function formatDateWithCity(dateStr: string, city: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  );

  let label: string;
  if (diffDays === 0) {
    label = "Сегодня";
  } else if (diffDays === 1) {
    label = "Вчера";
  } else {
    label = `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
  }

  return `${label}, ${city}`;
}
