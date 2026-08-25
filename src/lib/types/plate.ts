import type { PaginationParams, Seller } from "./api";

// ── License plate category ──
export type PlateCategory = "beautiful" | "lucky" | "standard";

// ── API types (snake_case, as returned by the backend) ──
export interface LicensePlate {
  id: string;
  plate_number: string;
  region_code: string;
  region: string;
  category: PlateCategory;
  price: number;
  currency: string;
  negotiable: boolean;
  photos: string[];
  is_vip: boolean;
  is_featured: boolean;
  contact_city: string;
  views_count: number;
  status: string;
  created_at: string;
}

export interface LicensePlateDetail extends LicensePlate {
  description: string | null;
  contact_name: string;
  contact_phone: string;
  favorites_count: number;
  published_at: string | null;
  updated_at: string;
  seller: Seller;
}

export interface PlatesListResponse {
  plates: LicensePlate[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface PlatesSearchParams extends PaginationParams {
  q?: string;
  category?: PlateCategory;
  region?: string;
  region_code?: string;
  price_from?: number;
  price_to?: number;
  is_vip?: boolean;
  sort?: "date_desc" | "date_asc" | "price_asc" | "price_desc";
}

export interface CreatePlateInput {
  plate_number: string;
  region_code: string;
  region: string;
  category: PlateCategory;
  price: number;
  negotiable: boolean;
  description?: string;
  contact_name: string;
  contact_phone: string;
  contact_city: string;
}

// ── UI list model (camelCase, mapped in the page) ──
export interface PlateListing {
  id: string;
  plateNumber: string;
  region: string;
  regionCode: string;
  category: PlateCategory;
  price: number;
  isVip: boolean;
  views: number;
  publishedDate: string;
}

// ── Category options. `id` is the backend slug; `label` is the Russian name. ──
export interface PlateCategoryOption {
  id: PlateCategory;
  label: string;
}

export const PLATE_CATEGORIES: PlateCategoryOption[] = [
  { id: "beautiful", label: "Красивые" },
  { id: "lucky", label: "Счастливые" },
  { id: "standard", label: "Стандартные" },
];

/** Backend category slug → Russian label. */
export const PLATE_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  PLATE_CATEGORIES.map((c) => [c.id, c.label]),
);

// ── Tajik plate region codes (last two digits of the plate). ──
export interface PlateRegion {
  code: string;
  name: string;
}

export const PLATE_REGIONS: PlateRegion[] = [
  { code: "01", name: "Душанбе" },
  { code: "02", name: "Согд" },
  { code: "03", name: "Хатлон" },
  { code: "04", name: "ГБАО" },
  { code: "05", name: "РРП" },
];

/** Region code → Russian region name. */
export const PLATE_REGION_LABELS: Record<string, string> = Object.fromEntries(
  PLATE_REGIONS.map((r) => [r.code, r.name]),
);

export const PLATE_CITIES = [
  "Душанбе",
  "Худжанд",
  "Бохтар",
  "Куляб",
  "Истаравшан",
] as const;
export type PlateCity = (typeof PLATE_CITIES)[number];
