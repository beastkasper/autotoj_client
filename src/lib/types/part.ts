export interface PartListing {
  id: string;
  image: string;
  images?: string[];
  title: string;
  condition: "Новый" | "Б/у";
  price: string;
  city: string;
  publishedDate: string;
  category?: string;
  compatibility?: string;
  manufacturer?: string;
  partNumber?: string;
  description?: string;
  sellerName?: string;
  sellerPhone?: string;
}

export const PART_CATEGORIES = [
  "Все категории",
  "Шины и диски",
  "Двигатель",
  "Кузов",
  "Подвеска",
  "Электрика",
  "Салон",
  "Трансмиссия",
  "Тормозная система",
  "Оптика",
] as const;

export type PartCondition = "Все" | "Новый" | "Б/у";
export const CONDITION_OPTIONS: PartCondition[] = ["Все", "Новый", "Б/у"];
