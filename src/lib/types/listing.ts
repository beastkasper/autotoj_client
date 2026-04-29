// Типы для формы "Добавить объявление"

// ── Категория транспорта ──
export type ListingCategory = "cars" | "moto" | "commercial" | "parts";

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

// ── Форма легковых (21 шаг — flow выровнен с мобильным) ──
export interface CarListingForm {
  // 1. Brand
  brand: string;
  model: string;
  customBrand: string;
  customModel: string;

  // 3-4. Year / Generation
  year: number | null;
  generation: string;

  // 5-7. Body / Engine (fuel) / Drive
  bodyType: string;
  engineType: string;
  driveType: string;

  // 8. Transmission
  transmission: string;

  // 9-10. Engine volume / Power
  engineVolume: string;
  enginePower: string;

  // 11-13. Color / Condition / Steering
  color: string;
  condition: string;
  steeringWheel: string;

  // 14. Photos / Video
  media: MediaData;

  // 15. Equipment
  equipment: string[];

  // 16. History
  mileage: string;
  pts: string;
  owners: string;
  hasAccident: boolean;

  // 17. VIN (optional, late)
  vin: string;

  // 18. Description
  description: string;

  // 19. Price
  price: string;
  exchangePossible: boolean;
  negotiable: boolean;

  // 20. Contacts
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
  brand: "",
  model: "",
  customBrand: "",
  customModel: "",
  year: null,
  generation: "",
  bodyType: "",
  engineType: "",
  driveType: "",
  transmission: "",
  engineVolume: "",
  enginePower: "",
  color: "",
  condition: "",
  steeringWheel: "",
  media: { ...INITIAL_MEDIA },
  equipment: [],
  mileage: "",
  pts: "",
  owners: "",
  hasAccident: false,
  vin: "",
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
