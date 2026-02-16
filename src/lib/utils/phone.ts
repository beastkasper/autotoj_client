/**
 * Parse a formatted phone string like "(XX) XXX XX XX" into raw digits "992XXXXXXXXX"
 * for sending to the API.
 */
export function parseRawPhone(formatted: string): string {
  const digits = formatted.replace(/\D/g, "");
  return `992${digits}`;
}

/**
 * Format raw phone digits into the display format: (XX) XXX XX XX
 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 9);
  if (digits.length === 0) return "";

  if (digits.length <= 2) {
    return `(${digits}`;
  } else if (digits.length <= 5) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
}
