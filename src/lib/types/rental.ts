export interface RentalCar {
  id: string;
  image: string;
  images?: string[];
  title: string;
  transmission: string;
  pricePerDay: string;
  city: string;
  publishedDate: string;
  carClass: string;
  year?: number;
  fuel?: string;
  description?: string;
  sellerName?: string;
  sellerPhone?: string;
}

/** Car-class options. `id` is the backend slug; `label` is the Russian display name. */
export interface CarClassOption {
  id: string;
  label: string;
}

export const CAR_CLASSES: CarClassOption[] = [
  { id: "economy", label: "Эконом" },
  { id: "comfort", label: "Комфорт" },
  { id: "business", label: "Бизнес" },
  { id: "premium", label: "Премиум" },
  { id: "suv", label: "Внедорожник" },
  { id: "minivan", label: "Минивэн" },
];

/** Backend car-class slug → Russian label. */
export const CAR_CLASS_LABELS: Record<string, string> = Object.fromEntries(
  CAR_CLASSES.map((c) => [c.id, c.label]),
);

/** A backend car-class slug. */
export type CarClass = string;

export const RENTAL_CITIES = [
  "Душанбе",
  "Худжанд",
  "Бохтар",
  "Куляб",
  "Истаравшан",
] as const;
export type RentalCity = (typeof RENTAL_CITIES)[number];
