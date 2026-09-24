/**
 * Единый разбор ошибки RTK Query в человекочитаемый текст.
 *
 * Раньше эта логика жила приватной функцией в useListingForm и понимала только
 * формат {error:{code,message}} из INTEGRATION.md §17. Но бэкенд на невалидном
 * теле отвечает сырым форматом FastAPI {detail:[{loc,msg}]}, а при обрыве сети
 * RTK Query отдаёт FETCH_ERROR — в обоих случаях пользователь видел
 * бессмысленное «Произошла ошибка» или вообще ничего.
 */

const DEFAULT = "Что-то пошло не так. Попробуйте ещё раз.";

function asRecord(v: unknown): Record<string, unknown> | null {
  return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;
}

export function getApiErrorMessage(err: unknown, fallback: string = DEFAULT): string {
  const e = asRecord(err);
  if (!e) return fallback;

  // Обрыв сети / таймаут / нераспарсенный ответ.
  if (e.status === "FETCH_ERROR") return "Нет связи с сервером. Проверьте интернет.";
  if (e.status === "TIMEOUT_ERROR") return "Сервер не отвечает. Попробуйте позже.";
  if (e.status === "PARSING_ERROR") return "Сервер вернул неожиданный ответ.";

  const data = asRecord(e.data);
  if (data) {
    // Штатный формат: {"error": {"code": "...", "message": "..."}}
    const error = asRecord(data.error);
    if (error && typeof error.message === "string") {
      const fields = asRecord(error.fields);
      if (fields) {
        const first = Object.values(fields).find((v) => typeof v === "string");
        if (typeof first === "string") return `${error.message}: ${first}`;
      }
      return error.message;
    }

    // Сырой формат FastAPI: {"detail": [{"loc": [...], "msg": "..."}]}
    if (Array.isArray(data.detail)) {
      const msgs = data.detail
        .map((d) => {
          const item = asRecord(d);
          return item && typeof item.msg === "string" ? item.msg : null;
        })
        .filter((m): m is string => !!m);
      if (msgs.length) return msgs.join("; ");
    }
    if (typeof data.detail === "string") return data.detail;
    if (typeof data.message === "string") return data.message;
  }

  // Осталось хотя бы сообщить код ответа, а не молчать.
  if (typeof e.status === "number") {
    if (e.status === 401) return "Требуется вход в аккаунт.";
    if (e.status === 403) return "Недостаточно прав для этого действия.";
    if (e.status === 404) return "Не найдено.";
    if (e.status === 413) return "Файл слишком большой.";
    if (e.status === 429) return "Слишком много запросов. Подождите немного.";
    if (e.status >= 500) return "Ошибка на сервере. Попробуйте позже.";
    return `${fallback} (код ${e.status})`;
  }

  return fallback;
}
