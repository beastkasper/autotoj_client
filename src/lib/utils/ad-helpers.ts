// ── Shared helper functions for ad display ──

export function buildAdTitle(ad: {
  title?: string;
  brand: string;
  model: string;
}): string {
  if (ad.title) return ad.title;
  return `${ad.brand} ${ad.model}`.trim();
}

export function buildAdCharacteristics(ad: {
  year?: number;
  mileage?: number;
  location?: string;
}): string {
  const parts: string[] = [];
  if (ad.year) parts.push(`${ad.year}`);
  if (ad.mileage) parts.push(`${ad.mileage.toLocaleString("ru-RU")} км`);
  if (ad.location) parts.push(ad.location);
  return parts.join(" \u2022 ");
}

// formatDateRu has been moved to @/lib/utils/dateFormat
export { formatDateRu } from "./dateFormat";
