// Только те быстрые фильтры, под которые у API есть параметры
// (INTEGRATION.md §5.1). «Не битый» и «От собственника» были мёртвыми
// кнопками: они не давали ни одного query-параметра и не меняли выдачу.
export const QUICK_FILTERS = [
  { id: "priceUnder100k", label: "До 100 000 сомони" },
  { id: "automatic", label: "Автомат" },
  { id: "withPhoto", label: "С фото" },
  { id: "withVideo", label: "С видео" },
] as const;

export const BRANDS = [
  "Toyota",
  "Honda",
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Lexus",
  "Hyundai",
  "Kia",
] as const;

export const MODELS: Record<string, string[]> = {
  Toyota: ["Camry", "Corolla", "Land Cruiser", "RAV4", "Highlander"],
  Honda: ["Accord", "Civic", "CR-V", "Pilot"],
  "Mercedes-Benz": ["E-Class", "C-Class", "S-Class", "GLE", "GLC"],
  BMW: ["3 Series", "5 Series", "7 Series", "X5", "X3"],
  Audi: ["A4", "A6", "Q5", "Q7"],
  Lexus: ["RX", "ES", "NX", "LX"],
  Hyundai: ["Sonata", "Elantra", "Tucson", "Santa Fe"],
  Kia: ["Optima", "Sportage", "Sorento"],
};

export const FUEL_TYPES = ["Бензин", "Дизель", "Гибрид", "Электро"] as const;

export const TRANSMISSION_TYPES = [
  "Механика",
  "Автомат",
  "Вариатор",
  "Робот",
] as const;

export const DRIVE_TYPES = ["Передний", "Задний", "Полный"] as const;

export const BODY_TYPES = [
  "Седан",
  "Хэтчбек",
  "Универсал",
  "Внедорожник",
  "Купе",
  "Минивэн",
] as const;

export const COLORS = [
  "Белый",
  "Черный",
  "Серый",
  "Серебристый",
  "Красный",
  "Синий",
  "Зеленый",
  "Коричневый",
] as const;
