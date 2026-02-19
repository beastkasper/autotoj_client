const MONTHS_SHORT = [
  "янв", "фев", "мар", "апр", "мая", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];

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
