/**
 * Format a numeric price with spaces as thousand separators.
 * Example: 1250000 → "1 250 000"
 */
export function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU").replace(/,/g, " ");
}
