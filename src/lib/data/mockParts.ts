export interface PartListing {
  id: number;
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

export const mockPartsListings: PartListing[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=60",
    ],
    title: "Летние шины Michelin 205/55 R16",
    condition: "Б/у",
    price: "12 000",
    city: "Душанбе",
    publishedDate: "2026-01-18",
    category: "Шины и диски",
    compatibility: "Универсальные",
    manufacturer: "Michelin",
    description:
      "Комплект из 4 летних шин Michelin в хорошем состоянии. Остаток протектора — 70%. Без грыж и порезов. Подходят для большинства седанов.",
    sellerName: "Фаррух Зоиров",
    sellerPhone: "+992 90 111 22 33",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400",
    images: [
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800",
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80",
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=60",
    ],
    title: "Литые диски R17 5x114.3",
    condition: "Новый",
    price: "25 000",
    city: "Худжанд",
    publishedDate: "2026-01-17",
    category: "Шины и диски",
    compatibility: "Toyota, Hyundai, Kia",
    manufacturer: "OZ Racing",
    description:
      "Новые литые диски OZ Racing, 4 шт. Размер R17, разболтовка 5x114.3, вылет ET45. Отлично подойдут для Toyota Camry, Hyundai Sonata, Kia Optima.",
    sellerName: "Шерзод Одинаев",
    sellerPhone: "+992 91 222 33 44",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    images: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800",
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80",
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=60",
    ],
    title: "Передняя фара Toyota Camry",
    condition: "Б/у",
    price: "8 500",
    city: "Душанбе",
    publishedDate: "2026-01-16",
    category: "Оптика",
    compatibility: "Toyota Camry (2018-2022)",
    manufacturer: "Toyota",
    partNumber: "81150-06E70",
    description:
      "Оригинальная левая фара Toyota Camry 70 в хорошем состоянии. Без трещин, стекло без помутнения. Все крепления целые.",
    sellerName: "Бахтиёр Холов",
    sellerPhone: "+992 92 333 44 55",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400",
    images: [
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800",
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=60",
    ],
    title: "Двигатель 1.6 TSI",
    condition: "Б/у",
    price: "95 000",
    city: "Душанбе",
    publishedDate: "2026-01-15",
    category: "Двигатель",
    compatibility: "VW, Skoda, Audi",
    manufacturer: "Volkswagen",
    partNumber: "CAXA",
    description:
      "Контрактный двигатель 1.6 TSI (CAXA). Пробег 85 000 км. В комплекте с навесным оборудованием. Гарантия 30 дней.",
    sellerName: "Насим Аброров",
    sellerPhone: "+992 93 444 55 66",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
    images: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=60",
    ],
    title: "КПП автомат Toyota",
    condition: "Б/у",
    price: "45 000",
    city: "Худжанд",
    publishedDate: "2026-01-14",
    category: "Трансмиссия",
    compatibility: "Toyota Camry (2015-2020)",
    manufacturer: "Toyota",
    description:
      "Контрактная АКПП для Toyota Camry. Пробег 90 000 км. Исправна, проверена. Установка возможна на месте.",
    sellerName: "Хусрав Бобоев",
    sellerPhone: "+992 94 555 66 77",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=60",
    ],
    title: "Амортизаторы передние",
    condition: "Новый",
    price: "6 500",
    city: "Душанбе",
    publishedDate: "2026-01-13",
    category: "Подвеска",
    compatibility: "Toyota Camry (2018-2024)",
    manufacturer: "KYB",
    partNumber: "339362",
    description:
      "Новые передние амортизаторы KYB Excel-G для Toyota Camry 70. Оригинальное качество, газовые. Комплект 2 шт.",
    sellerName: "Рустам Джураев",
    sellerPhone: "+992 95 666 77 88",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=60",
    ],
    title: "Зимние шины Nokian 195/65 R15",
    condition: "Б/у",
    price: "15 000",
    city: "Куляб",
    publishedDate: "2026-01-12",
    category: "Шины и диски",
    compatibility: "Универсальные",
    manufacturer: "Nokian",
    description:
      "Комплект зимних шипованных шин Nokian Hakkapeliitta. Остаток шипов — 80%. Отличное состояние для зимнего сезона.",
    sellerName: "Зафар Курбонов",
    sellerPhone: "+992 90 777 88 99",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400",
    images: [
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800",
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=60",
    ],
    title: "Тормозные диски передние",
    condition: "Новый",
    price: "3 500",
    city: "Душанбе",
    publishedDate: "2026-01-11",
    category: "Расходники",
    compatibility: "Hyundai/Kia",
    manufacturer: "Brembo",
    partNumber: "09.A820.14",
    description:
      "Новые тормозные диски Brembo для Hyundai/Kia. Диаметр 280мм. Вентилируемые. Комплект 2 шт.",
    sellerName: "Абдулло Ёров",
    sellerPhone: "+992 91 888 99 00",
  },
];

export function getPartById(id: number): PartListing | undefined {
  return mockPartsListings.find((p) => p.id === id);
}

export function getSimilarParts(id: number, limit = 4): PartListing[] {
  const current = mockPartsListings.find((p) => p.id === id);
  if (!current) return mockPartsListings.slice(0, limit);
  // Prefer same category
  const sameCategory = mockPartsListings.filter(
    (p) => p.id !== id && p.category === current.category
  );
  const others = mockPartsListings.filter(
    (p) => p.id !== id && p.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export const PART_CATEGORIES = [
  "Все категории",
  "Шины и диски",
  "Оптика",
  "Двигатель",
  "Кузов",
  "Подвеска",
  "Трансмиссия",
  "Расходники",
] as const;

export type PartCondition = "Все" | "Новый" | "Б/у";
export const CONDITION_OPTIONS: PartCondition[] = ["Все", "Новый", "Б/у"];
