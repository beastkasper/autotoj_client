import type { AdFormData } from './types';

/**
 * Чистые мапперы «состояние формы → тело PATCH /my/ads/:id».
 *
 * Бэкенд (autoToj-backend/app/schemas/ad.py UpdateAdInput) молча отбрасывает
 * неизвестные ключи, поэтому camelCase-поля форм сюда приходят и уходят уже
 * под именами контракта. Всё, что не имеет колонки в таблице ads, либо
 * складывается в description (коммерческий транспорт), либо выбрасывается.
 *
 * Соглашения:
 *  - числа парсятся parseInt/parseFloat и опускаются при NaN/пустой строке;
 *  - пустые строки не отправляются (undefined, не '');
 *  - телефон нормализуется к +992XXXXXXXXX;
 *  - фото/видео возвращаются отдельными полями — PostAdPage вырезает их
 *    перед PATCH и грузит multipart'ом.
 */

/** То, что формы отдают в onPublish: поля объявления + локальные медиа-URI. */
export type VehiclePublishData = AdFormData & {
  photos?: string[];
  video?: string;
};

// ─── Общие хелперы ──────────────────────────────────────────────────────────

const str = (v: unknown): string | undefined => {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t ? t : undefined;
};

const int = (v: unknown): number | undefined => {
  const s = str(v);
  if (!s) return undefined;
  const n = parseInt(s.replace(/[^\d-]/g, ''), 10);
  return Number.isNaN(n) ? undefined : n;
};

const float = (v: unknown): number | undefined => {
  const s = str(v);
  if (!s) return undefined;
  const n = parseFloat(s.replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isNaN(n) ? undefined : n;
};

const bool = (v: unknown): boolean | undefined => (typeof v === 'boolean' ? v : undefined);

/** Формы хранят 9 цифр; профиль может уже содержать +992. Итог: +992XXXXXXXXX. */
export function normalizePhone(v: unknown): string | undefined {
  const digits = (str(v) ?? '').replace(/\D/g, '');
  if (!digits) return undefined;
  if (digits.length === 9) return `+992${digits}`;
  if (digits.length === 12 && digits.startsWith('992')) return `+${digits}`;
  return `+${digits}`;
}

/** '1' | '2' | '3' | '4+' → 0..4 (бэкенд: owners int ge=0 le=4). */
export function normalizeOwners(v: unknown): number | undefined {
  const s = str(v);
  if (!s) return undefined;
  if (s.startsWith('4')) return 4;
  const n = int(s);
  if (n === undefined) return undefined;
  return Math.max(0, Math.min(4, n));
}

/** 'В наличии' | 'На заказ' | 'available' | 'on_order' → enum бэкенда. */
export function normalizeVehicleStatus(v: unknown): AdFormData['vehicle_status'] {
  const s = str(v);
  if (!s) return undefined;
  if (s === 'available' || s === 'В наличии') return 'available';
  if (s === 'on_order' || s === 'На заказ') return 'on_order';
  return undefined;
}

/** moto_strokes из /dicts — 'two' | 'four' | 'unspecified'; колонка strokes — int. */
function normalizeStrokes(v: unknown): number | undefined {
  const s = str(v);
  if (!s) return undefined;
  if (s === 'two') return 2;
  if (s === 'four') return 4;
  return int(s);
}

/** Убирает ключи со значением undefined, чтобы PATCH не трогал незаполненные поля. */
function compact<T extends object>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out as T;
}

const DESCRIPTION_MAX = 3000; // UpdateAdInput.description max_length

function joinDescription(main: unknown, extraLines: string[]): string | undefined {
  const parts = [str(main), extraLines.length ? extraLines.join('\n') : undefined].filter(
    (p): p is string => !!p,
  );
  if (parts.length === 0) return undefined;
  return parts.join('\n\n').slice(0, DESCRIPTION_MAX);
}

// ─── Легковые (CarListingForm) ──────────────────────────────────────────────

export interface CarFormInput {
  brand: string;
  model: string;
  year: string;
  generation: string;
  bodyType: string;
  engineType: string;
  driveType: string;
  transmission: string;
  engineVolume: string;
  power: string;
  color: string;
  condition: string;
  steeringWheel: string;
  photos: string[];
  video: string;
  equipment: Set<string> | string[];
  mileage: string;
  pts: string;
  owners: string;
  isDamaged: boolean;
  vin: string;
  description: string;
  price: string;
  canExchange: boolean;
  canNegotiate: boolean;
  vehicleStatus: string;
  isCustomsCleared: boolean;
  originCountry: string;
  name: string;
  phone: string;
  city: string;
  contactAdditional: string;
  readyForOnlineViewing: boolean;
}

export function buildCarPayload(f: CarFormInput): VehiclePublishData {
  const options = Array.from(f.equipment ?? []).filter(Boolean);
  return compact<VehiclePublishData>({
    category: 'cars',
    brand_id: str(f.brand),
    model_id: str(f.model),
    generation_id: str(f.generation),
    year: int(f.year),
    body: str(f.bodyType),
    fuel: str(f.engineType),
    drive: str(f.driveType),
    transmission: str(f.transmission),
    engine_volume: float(f.engineVolume),
    power: int(f.power),
    color: str(f.color),
    condition: str(f.condition),
    steering_wheel: str(f.steeringWheel),
    mileage: int(f.mileage),
    pts: str(f.pts),
    owners: normalizeOwners(f.owners),
    is_damaged: bool(f.isDamaged),
    vin: str(f.vin)?.toUpperCase().slice(0, 17),
    description: str(f.description)?.slice(0, DESCRIPTION_MAX),
    price: int(f.price),
    negotiable: bool(f.canNegotiate),
    can_exchange: bool(f.canExchange),
    vehicle_status: normalizeVehicleStatus(f.vehicleStatus),
    is_customs_cleared: bool(f.isCustomsCleared),
    origin_country: str(f.originCountry),
    options: options.length ? options : undefined,
    contact_name: str(f.name),
    contact_phone: normalizePhone(f.phone),
    contact_additional: str(f.contactAdditional),
    city_id: str(f.city),
    ready_for_online_viewing: bool(f.readyForOnlineViewing),
    photos: f.photos?.length ? [...f.photos] : undefined,
    video: str(f.video),
  });
}

// ─── Мото (MotoForm) ────────────────────────────────────────────────────────

export interface MotoFormInput {
  brand: string;
  model: string;
  motorcycleType: string;
  year: string;
  mileage: string;
  engineVolume: string;
  engineType: string;
  cylinderLayout: string;
  cylinderCount: string;
  power: string;
  drive: string;
  gearbox: string;
  strokes: string;
  color: string;
  hasElectricStarter: boolean;
  hasABS: boolean;
  vehicleStatus: string;
  isCustomsCleared: boolean;
  originCountry: string;
  pts: string;
  owners: string;
  isDamaged: boolean;
  photos: string[];
  video: string;
  description: string;
  price: string;
  name: string;
  phone: string;
  city: string;
}

/**
 * @param subcategory Русская подпись подкатегории ('Мотоциклы', 'Скутеры', ...) —
 *   уходит в колонку subcategory как есть (у бэкенда она общая для всех категорий).
 */
export function buildMotoPayload(f: MotoFormInput, subcategory?: string): VehiclePublishData {
  const options: string[] = [];
  if (f.hasABS) options.push('abs');
  if (f.hasElectricStarter) options.push('electric_starter');

  return compact<VehiclePublishData>({
    category: 'moto',
    subcategory: str(subcategory),
    brand_id: str(f.brand),
    model_id: str(f.model),
    motorcycle_type: str(f.motorcycleType),
    year: int(f.year),
    mileage: int(f.mileage),
    engine_volume: float(f.engineVolume),
    fuel: str(f.engineType),
    cylinder_layout: str(f.cylinderLayout),
    cylinder_count: int(f.cylinderCount),
    power: int(f.power),
    drive: str(f.drive),
    transmission: str(f.gearbox),
    strokes: normalizeStrokes(f.strokes),
    color: str(f.color),
    options: options.length ? options : undefined,
    vehicle_status: normalizeVehicleStatus(f.vehicleStatus),
    is_customs_cleared: bool(f.isCustomsCleared),
    origin_country: str(f.originCountry),
    pts: str(f.pts),
    owners: normalizeOwners(f.owners),
    is_damaged: bool(f.isDamaged),
    description: str(f.description)?.slice(0, DESCRIPTION_MAX),
    price: int(f.price),
    contact_name: str(f.name),
    contact_phone: normalizePhone(f.phone),
    city_id: str(f.city),
    photos: f.photos?.length ? [...f.photos] : undefined,
    video: str(f.video),
  });
}

// ─── Коммерческий транспорт (CommercialForm) ────────────────────────────────

export interface CommercialFormInput {
  brand: string;
  model: string;
  loadCapacity: string;
  year: string;
  mileage: string;
  bodyType: string;
  cabinType: string;
  engineType: string;
  transmission: string;
  wheelFormula: string;
  chassisSuspension: string;
  engineVolume: string;
  power: string;
  cabinSuspension: string;
  euroClass: string;
  hasGreenCertificate: boolean;
  steeringWheel: string;
  /** Ids справочника colors (или произвольные имена из «Добавить цвет»). */
  selectedColors: string[];
  pts: string;
  owners: string;
  isCustomsCleared: boolean;
  isDamaged: boolean;
  equipment: string[];
  mountainBrake: string;
  climate: string;
  seatHeating: string;
  /** Уже человекочитаемая подпись (форма резолвит id → name перед вызовом). */
  powerWindows: string;
  /** Уже человекочитаемая подпись (форма резолвит id → name перед вызовом). */
  radio: string;
  vehicleStatus: string;
  orderCountry: string;
  photos: string[];
  video: string;
  description: string;
  price: string;
  name: string;
  phone: string;
  city: string;
  /** Есть только у автобусных форм; сейчас CommercialForm их не собирает. */
  busType?: string;
  seatsCount?: string;
}

/**
 * @param subcategory Русская подпись подкатегории ('Грузовики', 'Автобусы', ...) —
 *   уходит в колонку subcategory как есть.
 */
export function buildCommercialPayload(
  f: CommercialFormInput,
  subcategory: string,
): VehiclePublishData {
  // Поля без колонки в ads — сохраняем текстом, чтобы не потерять.
  const extra: string[] = [];
  const line = (label: string, value: unknown) => {
    const s = str(value);
    if (s) extra.push(`${label}: ${s}`);
  };
  line('Кабина', f.cabinType);
  line('Подвеска шасси', f.chassisSuspension);
  line('Подвеска кабины', f.cabinSuspension);
  if (str(f.euroClass)) line('Экокласс', `Евро ${f.euroClass.trim()}`);
  if (f.hasGreenCertificate) extra.push('Зелёный сертификат: есть');
  line('Горный тормоз', f.mountainBrake);
  line('Климат', f.climate);
  line('Подогрев сидений', f.seatHeating);
  line('Стеклоподъёмники', f.powerWindows);
  line('Аудиосистема', f.radio);

  const options = (f.equipment ?? []).filter(Boolean);

  return compact<VehiclePublishData>({
    category: 'commercial',
    subcategory: str(subcategory),
    brand_id: str(f.brand),
    model_id: str(f.model),
    load_capacity: int(f.loadCapacity),
    year: int(f.year),
    mileage: int(f.mileage),
    body: str(f.bodyType),
    fuel: str(f.engineType),
    transmission: str(f.transmission),
    wheel_formula: str(f.wheelFormula)?.slice(0, 10),
    engine_volume: float(f.engineVolume),
    power: int(f.power),
    steering_wheel: str(f.steeringWheel)?.slice(0, 10),
    color: str(f.selectedColors?.[0]),
    pts: str(f.pts),
    owners: normalizeOwners(f.owners),
    is_customs_cleared: bool(f.isCustomsCleared),
    is_damaged: bool(f.isDamaged),
    options: options.length ? options : undefined,
    vehicle_status: normalizeVehicleStatus(f.vehicleStatus),
    origin_country: str(f.orderCountry),
    bus_type: str(f.busType),
    seats_count: int(f.seatsCount),
    description: joinDescription(f.description, extra),
    price: int(f.price),
    contact_name: str(f.name),
    contact_phone: normalizePhone(f.phone),
    city_id: str(f.city),
    photos: f.photos?.length ? [...f.photos] : undefined,
    video: str(f.video),
  });
}
