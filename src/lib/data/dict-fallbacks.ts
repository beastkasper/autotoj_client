/**
 * Локальные запасные справочники.
 *
 * Бэкенд периодически отдаёт `GET /dicts` с пустыми массивами для части
 * справочников (body_types, fuel_types, drive_types, steering_positions).
 * Раньше это делало шаги 5, 6, 7 и 13 визарда легковых непроходимыми: селект
 * показывал «Ничего не найдено», а пропустить обязательный шаг нельзя.
 *
 * `id` здесь — реальные слаги бэкенда (сверено с выдачей GET /ads), поэтому
 * объявление, созданное на фолбэке, ничем не отличается от созданного на
 * серверном справочнике.
 */

export interface DictOption {
  id: string;
  name: string;
}

export const FALLBACK_BODY_TYPES: DictOption[] = [
  { id: "sedan", name: "Седан" },
  { id: "hatchback", name: "Хэтчбек" },
  { id: "wagon", name: "Универсал" },
  { id: "coupe", name: "Купе" },
  { id: "cabriolet", name: "Кабриолет" },
  { id: "suv", name: "Внедорожник" },
  { id: "crossover", name: "Кроссовер" },
  { id: "minivan", name: "Минивэн" },
  { id: "pickup", name: "Пикап" },
  { id: "limousine", name: "Лимузин" },
  { id: "van", name: "Фургон" },
  { id: "roadster", name: "Родстер" },
  { id: "targa", name: "Тарга" },
];

export const FALLBACK_FUEL_TYPES: DictOption[] = [
  { id: "petrol", name: "Бензин" },
  { id: "diesel", name: "Дизель" },
  { id: "hybrid", name: "Гибрид" },
  { id: "electric", name: "Электро" },
  { id: "petrol_turbo", name: "Бензин (турбо)" },
  { id: "diesel_turbo", name: "Дизель (турбо)" },
  { id: "plugin_hybrid", name: "Plug-in гибрид" },
  { id: "gas", name: "Газ" },
  { id: "petrol_gas", name: "Газ-бензин" },
];

export const FALLBACK_DRIVE_TYPES: DictOption[] = [
  { id: "fwd", name: "Передний" },
  { id: "rwd", name: "Задний" },
  { id: "awd", name: "Полный" },
];

export const FALLBACK_STEERING_POSITIONS: DictOption[] = [
  { id: "left", name: "Левый" },
  { id: "right", name: "Правый" },
];

export const FALLBACK_TRANSMISSION_TYPES: DictOption[] = [
  { id: "manual", name: "Механика" },
  { id: "automatic", name: "Автомат" },
  { id: "cvt", name: "Вариатор" },
  { id: "robot", name: "Робот" },
];

export const FALLBACK_CONDITIONS: DictOption[] = [
  { id: "new", name: "Новый" },
  { id: "used", name: "С пробегом" },
];

export const FALLBACK_COLORS: DictOption[] = [
  { id: "white", name: "Белый" },
  { id: "black", name: "Чёрный" },
  { id: "silver", name: "Серебристый" },
  { id: "grey", name: "Серый" },
  { id: "blue", name: "Синий" },
  { id: "red", name: "Красный" },
  { id: "green", name: "Зелёный" },
  { id: "brown", name: "Коричневый" },
  { id: "beige", name: "Бежевый" },
  { id: "yellow", name: "Жёлтый" },
  { id: "orange", name: "Оранжевый" },
  { id: "violet", name: "Фиолетовый" },
];

export const FALLBACK_CITIES: DictOption[] = [
  { id: "dushanbe", name: "Душанбе" },
  { id: "khujand", name: "Худжанд" },
  { id: "kulob", name: "Куляб" },
  { id: "qurghonteppa", name: "Курган-Тюбе" },
  { id: "istaravshan", name: "Истаравшан" },
  { id: "tursunzoda", name: "Турсунзаде" },
  { id: "khorog", name: "Хорог" },
  { id: "isfara", name: "Исфара" },
  { id: "panjakent", name: "Пенджикент" },
  { id: "konibodom", name: "Канибадам" },
];

/**
 * Возвращает серверный справочник, а если он пуст или не пришёл — запасной.
 * Именно так его и надо использовать во всех шагах формы:
 *   const options = withFallback(dicts?.body_types, FALLBACK_BODY_TYPES);
 */
export function withFallback<T extends { id: string; name: string }>(
  fromApi: T[] | undefined | null,
  fallback: DictOption[],
): DictOption[] {
  if (Array.isArray(fromApi) && fromApi.length > 0) return fromApi;
  return fallback;
}
