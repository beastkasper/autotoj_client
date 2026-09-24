/**
 * Преобразование формы запчасти в тело POST /my/parts.
 *
 * Раньше handlePartsPublish отправлял только 7 общих полей, а все введённые
 * характеристики (типоразмер шин, PCD дисков, объём двигателя, сторона кузовной
 * детали) молча выбрасывались во всех девяти подкатегориях — в коде на этом
 * месте стояло «(Type-specific spec fields aren't mapped here yet.)».
 *
 * Значения в формах — русские подписи, бэкенд ждёт слаги, поэтому здесь же
 * лежат словари перевода. Набор принимаемых бэкендом полей сверен запросом:
 * колонки есть у шин, дисков, двигателя и кузовных деталей; для оптики,
 * ходовой, КПП, расходников и руля их пока нет — характеристики таких
 * объявлений дописываются в описание, чтобы не потерять их совсем.
 */

import type { PartsCategory, PartsFormData } from "@/lib/types/parts-listing";

const CONDITION: Record<string, string> = {
  "Новые": "new", "Новый": "new", "Новая": "new", "Новое": "new",
  "Б/у": "used", "Бу": "used",
};

const TIRE_TYPE: Record<string, string> = {
  "Летние": "summer", "Зимние": "winter", "Всесезонные": "all_season",
};

const VEHICLE_TYPE: Record<string, string> = {
  "Легковые": "cars", "Мото": "moto", "Коммерческие": "commercial",
};

const WHEEL_TYPE: Record<string, string> = {
  "Литые": "alloy", "Кованые": "forged", "Штампованные": "steel",
};

const WHEEL_MATERIAL: Record<string, string> = {
  "Алюминиевые": "aluminum", "Стальные": "steel",
};

const ENGINE_TYPE: Record<string, string> = {
  "Бензин": "petrol", "Дизель": "diesel", "Гибрид": "hybrid",
  "Электрический": "electric",
};

const CYLINDER_LAYOUT: Record<string, string> = {
  "Рядный": "inline", "V-образный": "v_type",
  "Оппозитный": "opposite", "Роторный": "rotary",
};

const BODY_PART_CATEGORY: Record<string, string> = {
  "Бампер": "bumper", "Капот": "hood", "Крыло": "fender", "Дверь": "door",
  "Крышка багажника": "trunk_lid", "Крыша": "roof", "Порог": "sill",
  "Панель кузова": "body_panel", "Лонжерон": "longerone",
  "Решётка радиатора": "grille", "Зеркало": "mirror", "Стекло": "glass",
  "Фара": "headlight", "Фонарь": "taillight", "Молдинг": "molding",
  "Усилитель бампера": "bumper_reinforcement", "Подкрылок": "fender_liner",
  "Защита двигателя": "engine_guard",
};

const SIDE: Record<string, string> = {
  "Левая": "left", "Правая": "right",
  "Передняя": "front", "Задняя": "rear",
  "Комплект": "set",
};

const COLOR: Record<string, string> = {
  "Белый": "white", "Чёрный": "black", "Серый": "grey",
  "Серебристый": "silver", "Синий": "blue", "Красный": "red",
  "Зелёный": "green", "Жёлтый": "yellow", "Другой": "other",
};

/** Русская подпись формы → слаг. Пустое и «Не указано» дают undefined. */
function slug(dict: Record<string, string>, value?: string): string | undefined {
  if (!value || value === "Не указано" || value === "Не имеет значения") return undefined;
  return dict[value] ?? undefined;
}

function num(value?: string): number | undefined {
  if (!value) return undefined;
  const n = Number(String(value).replace(",", ".").replace(/[^\d.\-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function int(value?: string): number | undefined {
  const n = num(value);
  return n === undefined ? undefined : Math.trunc(n);
}

function put(body: Record<string, unknown>, key: string, value: unknown) {
  if (value !== undefined && value !== null && value !== "") body[key] = value;
}

/** Подкатегория формы (с дефисами) → part_type бэкенда (с подчёркиваниями). */
export function toPartType(category: PartsCategory): string {
  return category.replace(/-/g, "_");
}

/**
 * Подкатегории, под которые у бэкенда нет отдельных колонок.
 * Их характеристики уходят текстом в description.
 */
const TEXT_ONLY: Record<string, Record<string, string>> = {
  "steering-wheel": {
    wheelType: "Тип руля", material: "Материал", diameter: "Диаметр, см",
    vehicleType: "Тип ТС", carBrand: "Марка авто", carModel: "Модель авто",
    carYear: "Год авто",
  },
  optics: {
    opticsType: "Тип оптики", side: "Сторона", lampType: "Тип лампы",
    originalOrAnalog: "Оригинальность", quantity: "Количество",
    carBrand: "Марка авто", carModel: "Модель авто", carYear: "Год авто",
  },
  suspension: {
    partType: "Тип детали", axle: "Ось", side: "Сторона",
    quantity: "Количество", bodyType: "Тип кузова",
    carBrand: "Марка авто", carModel: "Модель авто", carYear: "Год авто",
  },
  transmission: {
    transmissionType: "Тип КПП", driveType: "Привод",
  },
  consumables: {
    consumableType: "Тип расходника", manufacturer: "Производитель",
    volume: "Объём", viscosity: "Вязкость", articleNumber: "Артикул",
    quantity: "Количество", compatibility: "Совместимость",
  },
};

function buildSpecText(category: PartsCategory, fields: Record<string, string>): string {
  const map = TEXT_ONLY[category];
  if (!map) return "";
  const lines = Object.entries(map)
    .map(([key, ru]) => (fields[key] ? `${ru}: ${fields[key]}` : null))
    .filter((l): l is string => !!l);
  return lines.length ? `Характеристики:\n${lines.join("\n")}` : "";
}

/** Собирает тело запроса POST /my/parts из данных формы. */
export function buildPartBody(
  category: PartsCategory,
  data: PartsFormData,
): Record<string, unknown> {
  const f = data.fields;
  const t = data.toggles;
  const body: Record<string, unknown> = {
    part_type: toPartType(category),
    condition: slug(CONDITION, f.condition) ?? "used",
  };

  put(body, "price", num(data.price));
  put(body, "contact_name", data.name);
  put(body, "contact_phone", data.phone ? `+992${data.phone.replace(/\D/g, "")}` : undefined);
  put(body, "contact_city", data.city);

  // Марка и модель есть у большинства форм — раньше терялись даже они.
  put(body, "brand", f.brand || f.manufacturer || f.carBrand);
  put(body, "model", f.model || f.carModel);

  switch (category) {
    case "tires":
      put(body, "tire_type", slug(TIRE_TYPE, f.tireType));
      put(body, "tire_vehicle_type", slug(VEHICLE_TYPE, f.vehicleType));
      put(body, "tire_width", int(f.width));
      put(body, "tire_profile", int(f.profile));
      put(body, "tire_diameter", int(f.diameter));
      put(body, "tire_load_index", f.loadIndex);
      put(body, "tire_speed_index", f.speedIndex);
      put(body, "tire_quantity", int(f.quantity));
      put(body, "tire_country_of_origin", f.countryOfOrigin);
      body.tire_run_flat = !!t.runFlat;
      body.tire_studded = !!t.studded;
      body.tire_reinforced = !!t.reinforced;
      break;

    case "wheels":
      put(body, "wheel_diameter", num(f.diameter));
      put(body, "wheel_width", num(f.width));
      put(body, "wheel_pcd", f.pcd);
      put(body, "wheel_offset", num(f.offset));
      put(body, "wheel_dia", num(f.dia));
      put(body, "wheel_type", slug(WHEEL_TYPE, f.wheelType));
      put(body, "wheel_material", slug(WHEEL_MATERIAL, f.material));
      put(body, "wheel_quantity", int(f.quantity));
      break;

    case "engine":
      put(body, "engine_type", slug(ENGINE_TYPE, f.engineType));
      put(body, "engine_displacement", int(f.displacement));
      put(body, "engine_power", int(f.power));
      put(body, "engine_cylinder_layout", slug(CYLINDER_LAYOUT, f.cylinderLayout));
      put(body, "engine_cylinder_count", int(f.cylinderCount));
      break;

    case "body-parts":
      put(body, "body_part_category", slug(BODY_PART_CATEGORY, f.partCategory));
      put(body, "body_part_side", slug(SIDE, f.side));
      put(body, "body_part_color", slug(COLOR, f.color));
      break;

    default:
      break;
  }

  // Описание + характеристики подкатегорий без колонок на бэкенде.
  const spec = buildSpecText(category, f);
  const description = [data.description?.trim(), spec].filter(Boolean).join("\n\n");
  put(body, "description", description);

  return body;
}
