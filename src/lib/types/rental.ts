export interface RentalCar {
  id: string;
  image: string;
  images?: string[];
  title: string;
  transmission: string;
  pricePerDay: string;
  city: string;
  publishedDate: string;
  carClass: "Эконом" | "Комфорт";
  year?: number;
  fuel?: string;
  description?: string;
  sellerName?: string;
  sellerPhone?: string;
}

export const CAR_CLASSES = ["Эконом", "Комфорт"] as const;
export type CarClass = (typeof CAR_CLASSES)[number];

export const RENTAL_CITIES = [
  "Душанбе",
  "Худжанд",
  "Бохтар",
  "Куляб",
  "Истаравшан",
] as const;
export type RentalCity = (typeof RENTAL_CITIES)[number];
