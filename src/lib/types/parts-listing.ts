// Типы для формы добавления запчастей

export type PartsCategory =
  | "tires"
  | "wheels"
  | "steering-wheel"
  | "optics"
  | "suspension"
  | "body-parts"
  | "engine"
  | "transmission"
  | "consumables";

export interface PartsCategoryItem {
  id: PartsCategory;
  label: string;
  icon: string;
}

export const PARTS_CATEGORIES: PartsCategoryItem[] = [
  { id: "tires", label: "Шины", icon: "circle" },
  { id: "wheels", label: "Диски", icon: "disc" },
  { id: "steering-wheel", label: "Руль", icon: "steering" },
  { id: "optics", label: "Оптика", icon: "lightbulb" },
  { id: "suspension", label: "Ходовая часть", icon: "settings" },
  { id: "body-parts", label: "Детали кузова", icon: "car" },
  { id: "engine", label: "Двигатель", icon: "engine" },
  { id: "transmission", label: "КПП", icon: "cog" },
  { id: "consumables", label: "Расходники", icon: "package" },
];

// Общая форма запчасти
export interface PartsFormData {
  // Секция 1: Основная информация (поля зависят от категории)
  fields: Record<string, string>;
  toggles: Record<string, boolean>;

  // Секция 2: Медиа
  photos: File[];
  photoPreviewUrls: string[];

  // Секция 3: Описание
  description: string;

  // Секция 4: Цена
  price: string;

  // Секция 5: Контакты
  name: string;
  phone: string;
  city: string;
}

export const INITIAL_PARTS_FORM: PartsFormData = {
  fields: {},
  toggles: {},
  photos: [],
  photoPreviewUrls: [],
  description: "",
  price: "",
  name: "",
  phone: "",
  city: "",
};

export type PartsValidationErrors = Record<string, string>;
