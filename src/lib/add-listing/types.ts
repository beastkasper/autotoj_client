/**
 * Типы контрактов для форм подачи объявлений — перенесены 1:1 из мобильного
 * приложения (autoToj-app/src/services/api/myads.ts, parts.ts).
 */

export interface AdFormData {
  /** 'cars' | 'moto' | 'commercial' — без него объявление попадает в «Легковые». */
  category?: 'cars' | 'moto' | 'commercial';
  subcategory?: string;
  vehicle_type?: string;
  brand_id?: string;
  model_id?: string;
  generation_id?: string;
  year?: number;
  body?: string;
  condition?: string;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  drive?: string;
  engine_volume?: number;
  power?: number;
  price?: number;
  city_id?: string;
  color?: string;
  vin?: string;
  options?: string[];
  description?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_additional?: string;
  negotiable?: boolean;
  can_exchange?: boolean;
  vehicle_status?: 'available' | 'on_order';
  is_customs_cleared?: boolean;
  origin_country?: string;
  is_damaged?: boolean;
  pts?: string;
  owners?: number;
  modification?: string;
  version?: string;
  ready_for_online_viewing?: boolean;
  steering_wheel?: string;
  // Мото
  motorcycle_type?: string;
  cylinder_layout?: string;
  cylinder_count?: number;
  strokes?: number;
  // Коммерческий транспорт
  bus_type?: string;
  load_capacity?: number;
  seats_count?: number;
  wheel_formula?: string;
}

export interface Part {
  id: string;
  part_type: PartType;
  title?: string;
  condition: 'new' | 'used';
  brand?: string;
  model?: string;
  description?: string;
  price: number;
  currency: string;
  photos: string[];
  contact_name?: string;
  contact_phone: string;
  contact_city?: string;
  // Tires
  tire_type?: 'summer' | 'winter' | 'all_season';
  tire_vehicle_type?: 'cars' | 'moto' | 'commercial';
  tire_width?: number;
  tire_profile?: number;
  tire_diameter?: number;
  tire_load_index?: string;
  tire_speed_index?: string;
  tire_run_flat?: boolean;
  tire_studded?: boolean;
  tire_reinforced?: boolean;
  tire_quantity?: number;
  tire_country_of_origin?: string;
  // Wheels
  wheel_diameter?: number;
  wheel_width?: number;
  wheel_pcd?: string;
  wheel_offset?: number;
  wheel_dia?: number;
  wheel_type?: 'alloy' | 'forged' | 'steel';
  wheel_material?: 'aluminum' | 'steel';
  wheel_quantity?: number;
  // Engine
  engine_type?: string;
  engine_displacement?: number;
  engine_power?: number;
  engine_cylinder_layout?: 'inline' | 'v' | 'opposed' | 'rotary';
  engine_cylinder_count?: number;
  // Body parts
  body_part_category?: string;
  body_part_side?: 'left' | 'right' | 'front' | 'rear' | 'any';
  body_part_color?: string;
  // Metrics
  views_count: number;
  favorites_count: number;
  status: 'draft' | 'moderation' | 'active' | 'rejected' | 'archived';
  seller?: {
    id: string;
    name: string;
    phone: string;
    rating?: number;
    ads_count?: number;
  };
  published_at?: string;
  created_at: string;
  updated_at: string;
}
export type PartType =
  | 'tires' | 'wheels' | 'engine' | 'body_parts' | 'transmission'
  | 'suspension' | 'optics' | 'steering_wheel' | 'consumables';
