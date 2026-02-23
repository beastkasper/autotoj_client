export interface RentalCar {
  id: number;
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

export const mockRentals: RentalCar[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600",
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=60",
    ],
    title: "Toyota Camry",
    transmission: "Автомат",
    pricePerDay: "1500",
    city: "Душанбе",
    publishedDate: "2026-01-18",
    carClass: "Комфорт",
    year: 2023,
    fuel: "Бензин",
    description:
      "Новый автомобиль в отличном состоянии. Идеально подходит для комфортных поездок по городу и за его пределами. Автомобиль регулярно проходит техническое обслуживание.",
    sellerName: "Алишер Рахимов",
    sellerPhone: "+992 90 123 45 67",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=60",
    ],
    title: "Hyundai Sonata",
    transmission: "Автомат",
    pricePerDay: "1200",
    city: "Душанбе",
    publishedDate: "2026-01-17",
    carClass: "Комфорт",
    year: 2022,
    fuel: "Бензин",
    description:
      "Комфортный седан для деловых поездок и путешествий. Полный комплект документов. Страховка включена в стоимость аренды.",
    sellerName: "Фирдавс Каримов",
    sellerPhone: "+992 91 234 56 78",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600",
    images: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=60",
    ],
    title: "BMW X5",
    transmission: "Автомат",
    pricePerDay: "3000",
    city: "Худжанд",
    publishedDate: "2026-01-16",
    carClass: "Комфорт",
    year: 2023,
    fuel: "Дизель",
    description:
      "Премиальный внедорожник для комфортных поездок. Полный привод, кожаный салон, панорамная крыша. Идеален для семейных поездок.",
    sellerName: "Давлат Ахмедов",
    sellerPhone: "+992 92 345 67 89",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=60",
    ],
    title: "Mercedes-Benz E-Class",
    transmission: "Автомат",
    pricePerDay: "3500",
    city: "Душанбе",
    publishedDate: "2026-01-15",
    carClass: "Комфорт",
    year: 2024,
    fuel: "Бензин",
    description:
      "Представительский седан бизнес-класса. Максимальная комплектация, кожаный салон, климат-контроль. Подходит для деловых встреч и VIP-перевозок.",
    sellerName: "Рустам Сафаров",
    sellerPhone: "+992 93 456 78 90",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600",
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=60",
    ],
    title: "Lexus RX 350",
    transmission: "Автомат",
    pricePerDay: "2800",
    city: "Душанбе",
    publishedDate: "2026-01-14",
    carClass: "Комфорт",
    year: 2022,
    fuel: "Бензин",
    description:
      "Кроссовер премиум-класса с полным приводом. Идеально подходит для загородных поездок. Просторный салон, большой багажник.",
    sellerName: "Бахром Назаров",
    sellerPhone: "+992 94 567 89 01",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=600",
    images: [
      "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800",
      "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80",
      "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=60",
    ],
    title: "Honda Accord",
    transmission: "Автомат",
    pricePerDay: "1300",
    city: "Худжанд",
    publishedDate: "2026-01-13",
    carClass: "Комфорт",
    year: 2021,
    fuel: "Бензин",
    description:
      "Надёжный и экономичный седан. Низкий расход топлива, просторный салон. Отличный выбор для длительной аренды.",
    sellerName: "Тимур Исмаилов",
    sellerPhone: "+992 95 678 90 12",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600",
    images: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=60",
    ],
    title: "Audi A6",
    transmission: "Автомат",
    pricePerDay: "2500",
    city: "Душанбе",
    publishedDate: "2026-01-12",
    carClass: "Комфорт",
    year: 2023,
    fuel: "Бензин",
    description:
      "Стильный седан бизнес-класса с полным приводом Quattro. Кожаный салон, навигация, камера заднего вида.",
    sellerName: "Шухрат Мирзоев",
    sellerPhone: "+992 90 789 01 23",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=60",
    ],
    title: "Kia Optima",
    transmission: "Автомат",
    pricePerDay: "1000",
    city: "Куляб",
    publishedDate: "2026-01-11",
    carClass: "Эконом",
    year: 2020,
    fuel: "Бензин",
    description:
      "Экономичный и комфортный автомобиль для повседневных поездок. Отлично подходит для аренды на длительный срок.",
    sellerName: "Акбар Шарипов",
    sellerPhone: "+992 91 890 12 34",
  },
];

export function getRentalById(id: number): RentalCar | undefined {
  return mockRentals.find((r) => r.id === id);
}

export function getSimilarRentals(id: number, limit = 4): RentalCar[] {
  return mockRentals.filter((r) => r.id !== id).slice(0, limit);
}

export const CAR_CLASSES = ["Эконом", "Комфорт"] as const;
export type CarClass = (typeof CAR_CLASSES)[number];

export const RENTAL_CITIES = [
  "Душанбе",
  "Худжанд",
  "Куляб",
  "Курган-Тюбе",
  "Хорог",
] as const;
export type RentalCity = (typeof RENTAL_CITIES)[number];
