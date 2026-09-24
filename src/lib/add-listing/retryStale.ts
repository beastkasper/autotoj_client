/**
 * Обход бага бэкенда (см. autoToj-app/BACKEND_ISSUES.md, п. 1): сервер коммитит
 * транзакцию уже ПОСЛЕ отправки ответа, поэтому следующий запрос цепочки может
 * увидеть ещё не зафиксированные данные (PATCH → 404 на свежий драфт, submit →
 * 422 «не заполнены поля» сразу после PATCH). Повторяем запрос с паузой.
 * Перенесено из autoToj-app/src/lib/retryStale.ts, ошибки — формата RTK Query.
 */
export interface RetryOptions {
  attempts?: number;
  delayMs?: number;
}

export async function retryWhile<T>(
  fn: () => Promise<T>,
  shouldRetry: (error: unknown) => boolean,
  { attempts = 4, delayMs = 350 }: RetryOptions = {},
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i === attempts - 1 || !shouldRetry(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
    }
  }
  throw lastError;
}

function statusOf(error: unknown): unknown {
  return error && typeof error === "object" ? (error as { status?: unknown }).status : undefined;
}

function codeOf(error: unknown): unknown {
  const data = error && typeof error === "object" ? (error as { data?: unknown }).data : undefined;
  if (!data || typeof data !== "object") return undefined;
  const e = (data as { error?: { code?: unknown } }).error;
  return e?.code ?? (data as { code?: unknown }).code;
}

/** 404 на только что созданной сущности — она ещё не закоммичена. */
export const isStaleNotFound = (error: unknown): boolean => statusOf(error) === 404;

/** 422 «не заполнены обязательные поля» сразу после PATCH — PATCH ещё не закоммичен. */
export const isStaleValidation = (error: unknown): boolean =>
  statusOf(error) === 422 && codeOf(error) === "VALIDATION_ERROR";

/** Сообщения по полям из 422: { error: { details: { fields } } }. */
export function extractFieldMessages(error: unknown): string[] {
  const data = error && typeof error === "object" ? (error as { data?: unknown }).data : undefined;
  if (!data || typeof data !== "object") return [];
  const e = (data as { error?: { details?: { fields?: unknown }; fields?: unknown } }).error;
  const fields = e?.details?.fields ?? e?.fields;
  if (!fields || typeof fields !== "object") return [];
  return Object.values(fields as Record<string, unknown>).filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );
}
