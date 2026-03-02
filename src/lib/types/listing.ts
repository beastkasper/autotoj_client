// Типы для формы "Добавить объявление"

// ── Категория транспорта ──
export type ListingCategory = "cars" | "moto" | "commercial";

// ── Контактная информация ──
export interface ContactInfo {
  name: string;
  phone: string;
  city: string;
  customCity?: string;
  onlineShowing: boolean;
}

// ── Медиа ──
export interface MediaData {
  photos: File[];
  photoPreviewUrls: string[];
  video: File | null;
  videoPreviewUrl: string | null;
}

// ── Форма легковых (18 шагов) ──
export interface CarListingForm {
  // Шаг 1: Статус
  status: string;
  isNotCustomsCleared: boolean;
  supplyCountry: string;

  // Шаг 2: VIN
  vin: string;

  // Шаг 3-4: Марка / Модель
  brand: string;
  model: string;
  customBrand: string;
  customModel: string;

  // Шаг 5-6: Год / Поколение
  year: number | null;
  generation: string;

  // Шаг 7-9: Кузов / Двигатель / Привод
  bodyType: string;
  engineType: string;
  driveType: string;

  // Шаг 10: Модификация
  modification: string;

  // Шаг 11: Цвет
  color: string;

  // Шаг 12: Медиа
  media: MediaData;

  // Шаг 13: Комплектация
  equipment: string[];

  // Шаг 14: История
  mileage: string;
  pts: string;
  owners: string;
  hasAccident: boolean;

  // Шаг 15: Описание
  description: string;

  // Шаг 16: Цена
  price: string;
  exchangePossible: boolean;
  negotiable: boolean;

  // Шаг 17: Контакты
  contacts: ContactInfo;
}

// ── Форма мото ──
export interface MotoListingForm {
  // Основная
  brand: string;
  model: string;
  customBrand: string;
  customModel: string;
  motoType: string;

  // Характеристики
  year: number | null;
  mileage: string;
  engineVolume: string;
  engineType: string;
  cylinderLayout: string;
  cylinderCount: string;
  power: string;
  driveType: string;
  transmission: string;
  strokes: string;

  // Внешний вид
  color: string;

  // Оборудование
  hasElectricStarter: boolean;
  hasAbs: boolean;

  // Статус
  status: string;
  isNotCustomsCleared: boolean;
  supplyCountry: string;

  // Документы
  pts: string;
  owners: string;
  hasAccident: boolean;

  // Медиа
  media: MediaData;

  // Описание / Цена / Контакты
  description: string;
  price: string;
  contacts: ContactInfo;
}

// ── Форма комтранс ──
export interface CommercialListingForm {
  // Основная
  brand: string;
  model: string;
  customBrand: string;
  customModel: string;
  subcategory: string;
  loadCapacity: string;
  year: number | null;
  mileage: string;

  // Кузов
  bodyType: string;

  // Технические
  driveType: string;
  engineType: string;
  transmission: string;
  seats: string;
  engineVolume: string;
  power: string;
  steering: string;

  // Цвет
  colors: string[];

  // Документы
  pts: string;
  owners: string;
  isNotCustomsCleared: boolean;
  hasAccident: boolean;

  // Оборудование
  equipment: string[];
  airbags: string;
  windows: string;
  radio: string;

  // Статус
  status: string;
  supplyCountry: string;

  // Медиа
  media: MediaData;

  // Описание / Цена / Контакты
  description: string;
  price: string;
  contacts: ContactInfo;
}

// ── Ошибки валидации ──
export type ValidationErrors = Record<string, string>;

// ── Состояние формы ──
export interface ListingFormState {
  category: ListingCategory | null;
  subcategory: string;
  currentStep: number;
  carForm: CarListingForm;
  motoForm: MotoListingForm;
  commercialForm: CommercialListingForm;
  errors: ValidationErrors;
  isPublished: boolean;
}

// ── Начальные значения ──
export const INITIAL_MEDIA: MediaData = {
  photos: [],
  photoPreviewUrls: [],
  video: null,
  videoPreviewUrl: null,
};

export const INITIAL_CONTACTS: ContactInfo = {
  name: "",
  phone: "",
  city: "",
  customCity: "",
  onlineShowing: false,
};

export const INITIAL_CAR_FORM: CarListingForm = {
  status: "",
  isNotCustomsCleared: false,
  supplyCountry: "",
  vin: "",
  brand: "",
  model: "",
  customBrand: "",
  customModel: "",
  year: null,
  generation: "",
  bodyType: "",
  engineType: "",
  driveType: "",
  modification: "",
  color: "",
  media: { ...INITIAL_MEDIA },
  equipment: [],
  mileage: "",
  pts: "",
  owners: "",
  hasAccident: false,
  description: "",
  price: "",
  exchangePossible: false,
  negotiable: false,
  contacts: { ...INITIAL_CONTACTS },
};

export const INITIAL_MOTO_FORM: MotoListingForm = {
  brand: "",
  model: "",
  customBrand: "",
  customModel: "",
  motoType: "",
  year: null,
  mileage: "",
  engineVolume: "",
  engineType: "",
  cylinderLayout: "",
  cylinderCount: "",
  power: "",
  driveType: "",
  transmission: "",
  strokes: "",
  color: "",
  hasElectricStarter: false,
  hasAbs: false,
  status: "",
  isNotCustomsCleared: false,
  supplyCountry: "",
  pts: "",
  owners: "",
  hasAccident: false,
  media: { ...INITIAL_MEDIA },
  description: "",
  price: "",
  contacts: { ...INITIAL_CONTACTS },
};

export const INITIAL_COMMERCIAL_FORM: CommercialListingForm = {
  brand: "",
  model: "",
  customBrand: "",
  customModel: "",
  subcategory: "",
  loadCapacity: "",
  year: null,
  mileage: "",
  bodyType: "",
  driveType: "",
  engineType: "",
  transmission: "",
  seats: "",
  engineVolume: "",
  power: "",
  steering: "",
  colors: [],
  pts: "",
  owners: "",
  isNotCustomsCleared: false,
  hasAccident: false,
  equipment: [],
  airbags: "",
  windows: "",
  radio: "",
  status: "",
  supplyCountry: "",
  media: { ...INITIAL_MEDIA },
  description: "",
  price: "",
  contacts: { ...INITIAL_CONTACTS },
};
