export interface PartListing {
  id: number;
  image: string;
  title: string;
  condition: "Новый" | "Б/у";
  price: string;
  city: string;
  publishedDate: string;
}

export const mockPartsListings: PartListing[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1580271066857-c2f2f5e4079d?w=400",
    title: "Летние шины Michelin 205/55 R16",
    condition: "Б/у",
    price: "12 000",
    city: "Душанбе",
    publishedDate: "2026-01-18",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400",
    title: "Литые диски R17 5x114.3",
    condition: "Новый",
    price: "25 000",
    city: "Худжанд",
    publishedDate: "2026-01-17",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    title: "Передняя фара Toyota Camry",
    condition: "Б/у",
    price: "8 500",
    city: "Душанбе",
    publishedDate: "2026-01-16",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400",
    title: "Двигатель 1.6 TSI",
    condition: "Б/у",
    price: "95 000",
    city: "Душанбе",
    publishedDate: "2026-01-15",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
    title: "КПП автомат Toyota",
    condition: "Б/у",
    price: "45 000",
    city: "Худжанд",
    publishedDate: "2026-01-14",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400",
    title: "Амортизаторы передние",
    condition: "Новый",
    price: "6 500",
    city: "Душанбе",
    publishedDate: "2026-01-13",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    title: "Зимние шины Nokian 195/65 R15",
    condition: "Б/у",
    price: "15 000",
    city: "Куляб",
    publishedDate: "2026-01-12",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400",
    title: "Тормозные диски передние",
    condition: "Новый",
    price: "3 500",
    city: "Душанбе",
    publishedDate: "2026-01-11",
  },
];

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
