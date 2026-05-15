const MONTHS_SHORT = [
  "янв", "фев", "мар", "апр", "мая", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];

/**
 * Compact time label for chat list entries.
 * - Today → "14:23"
 * - Yesterday → "Вчера"
 * - Within current year → "14 мая"
 * - Older → "14.05.24"
 */
export function formatChatListTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  if (diffDays === 1) return "Вчера";
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
  }
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${dd}.${mm}.${yy}`;
}

/** "14:23" — used inside message bubbles. */
export function formatMessageTime(dateStr: string): string {
  const d = new Date(dateStr);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** Section separator label inside a chat: "Сегодня" / "Вчера" / "14 мая". */
export function formatMessageDateSeparator(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
  }
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}
