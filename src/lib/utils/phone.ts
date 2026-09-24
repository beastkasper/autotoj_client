/**
 * Телефоны Таджикистана: +992 и 9 цифр национального номера.
 *
 * Раньше formatPhone просто резал первые 9 цифр из строки, поэтому вставка
 * номера в привычном виде «+992900001001» превращалась в «(99) 290 00 01»,
 * а в API уходил совсем другой номер (+992992900001) — SMS приходила не туда,
 * и никакой ошибки при этом не было.
 */

const COUNTRY_CODE = "992";
const NATIONAL_LENGTH = 9;

/** Оставляет только 9 цифр национального номера, отбрасывая код страны. */
export function normalizeNationalDigits(input: string): string {
  let digits = input.replace(/\D/g, "");
  // «00992…» — международный префикс, «992…» — код страны.
  if (digits.startsWith("00" + COUNTRY_CODE)) digits = digits.slice(2 + COUNTRY_CODE.length);
  else if (digits.startsWith(COUNTRY_CODE) && digits.length > NATIONAL_LENGTH) {
    digits = digits.slice(COUNTRY_CODE.length);
  }
  // Ведущий ноль национального формата («0 90 …») тоже убираем.
  if (digits.length > NATIONAL_LENGTH && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, NATIONAL_LENGTH);
}

/** Строка из поля ввода → номер для API: «+992XXXXXXXXX». */
export function parseRawPhone(formatted: string): string {
  return `+${COUNTRY_CODE}${normalizeNationalDigits(formatted)}`;
}

/** Цифры → отображаемый формат «(XX) XXX XX XX». */
export function formatPhone(raw: string): string {
  const digits = normalizeNationalDigits(raw);
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

/** Номер заполнен полностью? */
export function isCompletePhone(value: string): boolean {
  return normalizeNationalDigits(value).length === NATIONAL_LENGTH;
}
