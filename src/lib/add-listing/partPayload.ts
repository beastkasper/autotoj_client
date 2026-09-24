import type { Part, PartType } from './types';

/**
 * Преобразует состояние форм подачи запчастей (camelCase + русские подписи)
 * в тело запроса POST /my/parts (см. backend app/schemas/part.py, CreatePartInput).
 *
 * Атрибуты, для которых на бэкенде нет колонки, дописываются в `description`
 * читаемыми строками через withSpecs(). `photos` остаются локальными URI —
 * PostAdPage отделяет их и грузит отдельным multipart-запросом.
 */

export type PartPayload = Partial<Part> & { photos: string[] };

const DESCRIPTION_MAX = 1000;

// ---------------------------------------------------------------------------
// Label → enum maps (must match option constants in each *ListingForm.tsx)
// ---------------------------------------------------------------------------

const CONDITION_MAP: Record<string, Part['condition']> = {
  'Новые': 'new',
  'Новый': 'new',
  'Новая': 'new',
  'Новое': 'new',
  'Б/у': 'used',
};

const TIRE_TYPE_MAP: Record<string, NonNullable<Part['tire_type']>> = {
  'Летние': 'summer',
  'Зимние': 'winter',
  'Всесезонные': 'all_season',
};

const TIRE_VEHICLE_TYPE_MAP: Record<string, NonNullable<Part['tire_vehicle_type']>> = {
  'Легковые': 'cars',
  'Мото': 'moto',
  'Коммерческие': 'commercial',
};

const WHEEL_TYPE_MAP: Record<string, NonNullable<Part['wheel_type']>> = {
  'Литые': 'alloy',
  'Кованые': 'forged',
  'Штампованные': 'steel',
};

const WHEEL_MATERIAL_MAP: Record<string, NonNullable<Part['wheel_material']>> = {
  'Алюминиевые': 'aluminum',
  'Стальные': 'steel',
};

const ENGINE_TYPE_MAP: Record<string, string> = {
  'Бензин': 'petrol',
  'Дизель': 'diesel',
  'Гибрид': 'hybrid',
  'Электрический': 'electric',
};

const CYLINDER_LAYOUT_MAP: Record<string, NonNullable<Part['engine_cylinder_layout']>> = {
  'Рядный': 'inline',
  'V-образный': 'v',
  'Оппозитный': 'opposed',
  'Роторный': 'rotary',
};

const BODY_PART_SIDE_MAP: Record<string, NonNullable<Part['body_part_side']>> = {
  'Левая': 'left',
  'Правая': 'right',
  'Передняя': 'front',
  'Задняя': 'rear',
  'Не имеет значения': 'any',
};

// body_part_category на бэкенде — свободная строка (≤30), enum не задан.
// Отправляем стабильные slug'и, чтобы фильтры не зависели от русских подписей.
const BODY_PART_CATEGORY_MAP: Record<string, string> = {
  'Бампер': 'bumper',
  'Капот': 'hood',
  'Крыло': 'fender',
  'Дверь': 'door',
  'Крышка багажника': 'trunk_lid',
  'Крыша': 'roof',
  'Порог': 'sill',
  'Панель кузова': 'body_panel',
  'Лонжерон': 'side_member',
  'Решётка радиатора': 'radiator_grille',
  'Зеркало': 'mirror',
  'Стекло': 'glass',
  'Фара': 'headlight',
  'Фонарь': 'taillight',
  'Молдинг': 'molding',
  'Усилитель бампера': 'bumper_reinforcement',
  'Подкрылок': 'fender_liner',
  'Защита двигателя': 'engine_guard',
};

/** Подписи-заглушки, которые означают «не выбрано». */
const EMPTY_LABELS = new Set(['', 'Не указано', 'Другой']);

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function lookup<T>(map: Record<string, T>, label: unknown): T | undefined {
  if (typeof label !== 'string') return undefined;
  const key = label.trim();
  if (EMPTY_LABELS.has(key)) return undefined;
  return map[key];
}

function toCondition(label: unknown): Part['condition'] | undefined {
  const mapped = lookup(CONDITION_MAP, label);
  if (mapped) return mapped;
  // Fallback для подписей вне карты (например, введённых вручную)
  if (typeof label !== 'string') return undefined;
  const lower = label.trim().toLowerCase();
  if (!lower) return undefined;
  if (lower.includes('б/у') || lower.includes('used')) return 'used';
  if (lower.startsWith('нов') || lower.includes('new')) return 'new';
  return undefined;
}

/** Обрезанная непустая строка либо undefined. */
function str(value: unknown, maxLength?: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed || EMPTY_LABELS.has(trimmed)) return undefined;
  return maxLength ? trimmed.slice(0, maxLength) : trimmed;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value !== 'string') return undefined;
  const cleaned = value.replace(/\s+/g, '').replace(',', '.');
  if (!cleaned) return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

/** Целое число (округляется) либо undefined при пустом/некорректном вводе. */
function int(value: unknown): number | undefined {
  const n = toNumber(value);
  return n === undefined ? undefined : Math.round(n);
}

/** Дробное число либо undefined. */
function float(value: unknown): number | undefined {
  return toNumber(value);
}

/**
 * Телефон в формате +992XXXXXXXXX.
 * Формы хранят 9 цифр без кода страны; на всякий случай принимаем
 * и полные варианты (+992..., 992..., 8/0 + 9 цифр).
 */
export function normalizePhone(value: unknown): string {
  if (typeof value !== 'string') return '';
  let digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 12 && digits.startsWith('992')) digits = digits.slice(3);
  else if (digits.length === 10 && (digits.startsWith('0') || digits.startsWith('8'))) digits = digits.slice(1);
  if (digits.length === 9) return `+992${digits}`;
  // Неожиданный формат: отдаём как есть с плюсом, бэкенд ограничит длину 20
  return `+${digits}`.slice(0, 20);
}

type SpecValue = string | number | boolean | null | undefined;
export type Spec = [label: string, value: SpecValue];

function formatSpecValue(value: SpecValue): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'boolean') return value ? 'Да' : undefined;
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : undefined;
  return str(value);
}

/**
 * Дописывает к описанию характеристики, для которых нет колонки в БД,
 * строками вида «Тип: Летние». Итог не длиннее 1000 символов;
 * при нехватке места усекается описание, а не характеристики.
 */
export function withSpecs(description: unknown, specs: Spec[]): string | undefined {
  const lines: string[] = [];
  for (const [label, value] of specs) {
    const formatted = formatSpecValue(value);
    if (formatted) lines.push(`${label}: ${formatted}`);
  }
  const specsBlock = lines.join('\n');
  const text = str(description) ?? '';

  if (!specsBlock) return text ? text.slice(0, DESCRIPTION_MAX) : undefined;
  if (!text) return specsBlock.slice(0, DESCRIPTION_MAX);

  const separator = '\n\n';
  const available = DESCRIPTION_MAX - specsBlock.length - separator.length;
  if (available <= 0) return specsBlock.slice(0, DESCRIPTION_MAX);
  const body = text.length > available ? `${text.slice(0, Math.max(0, available - 1))}…` : text;
  return `${body}${separator}${specsBlock}`.slice(0, DESCRIPTION_MAX);
}

interface CommonFields {
  condition?: unknown;
  price?: unknown;
  name?: unknown;
  phone?: unknown;
  city?: unknown;
  photos?: unknown;
}

/** Общие для всех форм поля: тип, состояние, цена, контакты, фото. */
function basePayload(partType: PartType, form: CommonFields): PartPayload {
  const photos = Array.isArray(form.photos)
    ? form.photos.filter((p): p is string => typeof p === 'string' && p.length > 0).slice(0, 10)
    : [];
  const payload: PartPayload = {
    part_type: partType,
    condition: toCondition(form.condition),
    price: int(form.price),
    contact_phone: normalizePhone(form.phone),
    contact_name: str(form.name, 100),
    contact_city: str(form.city, 100),
    photos,
  };
  return payload;
}

/** Убирает undefined-поля, чтобы бэкенд получил только заполненное (exclude_unset). */
function compact<T extends object>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) out[key] = value;
  }
  return out as T;
}

// ---------------------------------------------------------------------------
// Per-form builders
// ---------------------------------------------------------------------------

export interface TiresFormData extends CommonFields {
  vehicleType: string;
  tireType: string;
  width: string;
  profile: string;
  diameter: string;
  loadIndex: string;
  speedIndex: string;
  runFlat: boolean;
  studded: boolean;
  reinforced: boolean;
  brand: string;
  model: string;
  countryOfOrigin: string;
  description: string;
  quantity: string;
}

export function buildTiresPayload(form: TiresFormData): PartPayload {
  return compact({
    ...basePayload('tires', form),
    brand: str(form.brand, 100),
    model: str(form.model, 100),
    description: withSpecs(form.description, []),
    tire_type: lookup(TIRE_TYPE_MAP, form.tireType),
    tire_vehicle_type: lookup(TIRE_VEHICLE_TYPE_MAP, form.vehicleType),
    tire_width: int(form.width),
    tire_profile: int(form.profile),
    tire_diameter: int(form.diameter),
    tire_load_index: str(form.loadIndex, 10),
    tire_speed_index: str(form.speedIndex, 5),
    tire_run_flat: Boolean(form.runFlat),
    tire_studded: Boolean(form.studded),
    tire_reinforced: Boolean(form.reinforced),
    tire_quantity: int(form.quantity),
    tire_country_of_origin: str(form.countryOfOrigin, 100),
  });
}

export interface WheelsFormData extends CommonFields {
  vehicleType: string;
  diameter: string;
  width: string;
  pcd: string;
  offset: string;
  dia: string;
  wheelType: string;
  material: string;
  brand: string;
  model: string;
  quantity: string;
  description: string;
}

export function buildWheelsPayload(form: WheelsFormData): PartPayload {
  return compact({
    ...basePayload('wheels', form),
    brand: str(form.brand, 100),
    model: str(form.model, 100),
    // Нет колонки для типа ТС у дисков
    description: withSpecs(form.description, [['Тип транспорта', form.vehicleType]]),
    wheel_diameter: int(form.diameter),
    wheel_width: float(form.width),
    wheel_pcd: str(form.pcd, 20),
    wheel_offset: int(form.offset),
    wheel_dia: float(form.dia),
    wheel_type: lookup(WHEEL_TYPE_MAP, form.wheelType),
    wheel_material: lookup(WHEEL_MATERIAL_MAP, form.material),
    wheel_quantity: int(form.quantity),
  });
}

export interface EngineFormData extends CommonFields {
  brand: string;
  model: string;
  engineType: string;
  displacement: string;
  power: string;
  cylinderLayout: string;
  cylinderCount: string;
  description: string;
}

export function buildEnginePayload(form: EngineFormData): PartPayload {
  return compact({
    ...basePayload('engine', form),
    brand: str(form.brand, 100),
    model: str(form.model, 100),
    description: withSpecs(form.description, []),
    engine_type: lookup(ENGINE_TYPE_MAP, form.engineType),
    engine_displacement: int(form.displacement),
    engine_power: int(form.power),
    engine_cylinder_layout: lookup(CYLINDER_LAYOUT_MAP, form.cylinderLayout),
    engine_cylinder_count: int(form.cylinderCount),
  });
}

export interface BodyPartsFormData extends CommonFields {
  partCategory: string;
  side: string;
  color: string;
  description: string;
}

export function buildBodyPartsPayload(form: BodyPartsFormData): PartPayload {
  const category = lookup(BODY_PART_CATEGORY_MAP, form.partCategory);
  return compact({
    ...basePayload('body_parts', form),
    // Категория вне справочника (введена вручную) уйдёт в описание, чтобы не терять данные
    description: withSpecs(form.description, [
      ['Деталь', category ? undefined : form.partCategory],
    ]),
    body_part_category: category ?? str(form.partCategory, 30),
    body_part_side: lookup(BODY_PART_SIDE_MAP, form.side),
    body_part_color: str(form.color, 50),
  });
}

export interface TransmissionFormData extends CommonFields {
  brand: string;
  model: string;
  transmissionType: string;
  gearCount: string;
  driveType: string;
  description: string;
}

export function buildTransmissionPayload(form: TransmissionFormData): PartPayload {
  return compact({
    ...basePayload('transmission', form),
    brand: str(form.brand, 100),
    model: str(form.model, 100),
    // Нет колонок transmission_*
    description: withSpecs(form.description, [
      ['Тип КПП', form.transmissionType],
      ['Количество передач', form.gearCount],
      ['Привод', form.driveType],
    ]),
  });
}

export interface SuspensionFormData extends CommonFields {
  partType: string;
  axle: string;
  side: string;
  quantity: string;
  carBrand: string;
  carModel: string;
  carYear: string;
  bodyType: string;
  description: string;
}

export function buildSuspensionPayload(form: SuspensionFormData): PartPayload {
  return compact({
    ...basePayload('suspension', form),
    // Марка/модель автомобиля-донора — единственная марка у детали подвески
    brand: str(form.carBrand, 100),
    model: str(form.carModel, 100),
    // Нет колонок suspension_*
    description: withSpecs(form.description, [
      ['Деталь', form.partType],
      ['Ось', form.axle],
      ['Сторона', form.side],
      ['Количество', form.quantity],
      ['Год автомобиля', form.carYear],
      ['Кузов', form.bodyType],
    ]),
  });
}

export interface OpticsFormData extends CommonFields {
  opticsType: string;
  side: string;
  lampType: string;
  originalOrAnalog: string;
  quantity: string;
  carBrand: string;
  carModel: string;
  carYear: string;
  description: string;
}

export function buildOpticsPayload(form: OpticsFormData): PartPayload {
  return compact({
    ...basePayload('optics', form),
    brand: str(form.carBrand, 100),
    model: str(form.carModel, 100),
    // Нет колонок optics_*
    description: withSpecs(form.description, [
      ['Тип', form.opticsType],
      ['Сторона', form.side],
      ['Тип лампы', form.lampType],
      ['Оригинал/аналог', form.originalOrAnalog],
      ['Количество', form.quantity],
      ['Год автомобиля', form.carYear],
    ]),
  });
}

export interface SteeringWheelFormData extends CommonFields {
  vehicleType: string;
  wheelType: string;
  diameter: string;
  material: string;
  carBrand: string;
  carModel: string;
  carYear: string;
  description: string;
}

export function buildSteeringWheelPayload(form: SteeringWheelFormData): PartPayload {
  return compact({
    ...basePayload('steering_wheel', form),
    brand: str(form.carBrand, 100),
    model: str(form.carModel, 100),
    // Нет колонок steering_wheel_*; wheel_* относятся к колёсным дискам — не используем
    description: withSpecs(form.description, [
      ['Тип транспорта', form.vehicleType],
      ['Тип руля', form.wheelType],
      ['Диаметр, мм', form.diameter],
      ['Материал', form.material],
      ['Год автомобиля', form.carYear],
    ]),
  });
}

export interface ConsumablesFormData extends CommonFields {
  consumableType: string;
  volume: string;
  viscosity: string;
  articleNumber: string;
  manufacturer: string;
  compatibility: string;
  quantity: string;
  description: string;
}

export function buildConsumablesPayload(form: ConsumablesFormData): PartPayload {
  return compact({
    ...basePayload('consumables', form),
    brand: str(form.manufacturer, 100),
    // Нет колонок consumable_*
    description: withSpecs(form.description, [
      ['Тип', form.consumableType],
      ['Объём', form.volume],
      ['Вязкость', form.viscosity],
      ['Артикул', form.articleNumber],
      ['Совместимость', form.compatibility],
      ['Количество', form.quantity],
    ]),
  });
}
