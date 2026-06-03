// ── Shared API Types based on INTEGRATION.md ──

// ── Pagination ──
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ── Seller ──
export interface Seller {
  id: string;
  name: string;
  phone: string;
  type?: "private" | "business";
  ads_count?: number;
  phone_verified?: boolean;
  rating?: number;
  reviews_count?: number;
  avatar?: string | null;
}

// ── Ad ──
export interface AdListItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  year: number;
  mileage: number;
  location: string;
  photos: string[];
  brand: string;
  model: string;
  generation: string | null;
  fuel: string;
  transmission: string;
  drive: string;
  body: string;
  color: string;
  condition: string;
  engine_volume: number | null;
  power: number | null;
  seller: Seller;
  views: number;
  favorites: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AdDetail extends AdListItem {
  video: string | null;
  panorama: string | null;
  version: string | null;
  vin: string | null;
  description: string | null;
  options: string[];
  negotiable: boolean;
  can_exchange: boolean;
  vehicle_status: "available" | "on_order";
  is_customs_cleared: boolean;
  pts: string | null;
  owners: number;
  is_damaged: boolean;
  published_at: string | null;
}

export interface AdsListResponse {
  ads: AdListItem[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface AdsSearchParams extends PaginationParams {
  q?: string;
  type?: "car" | "moto" | "commercial";
  brand_id?: string;
  model_id?: string;
  generation_id?: string;
  year_from?: number;
  year_to?: number;
  price_from?: number;
  price_to?: number;
  city_id?: string;
  mileage_from?: number;
  mileage_to?: number;
  fuel?: string;
  transmission?: string;
  drive?: string;
  body?: string;
  color?: string;
  condition?: string;
  with_photos?: boolean;
  with_video?: boolean;
  sort?: "date_desc" | "date_asc" | "price_asc" | "price_desc";
}

// ── Parts ──
export interface PartListItem {
  id: string;
  part_type: string;
  title: string;
  condition: "new" | "used";
  brand: string | null;
  model: string | null;
  price: number;
  currency: string;
  photos: string[];
  contact_city: string;
  tire_type?: string;
  tire_width?: number;
  tire_profile?: number;
  tire_diameter?: number;
  views_count: number;
  status: string;
  created_at: string;
}

export interface PartDetail extends PartListItem {
  description: string | null;
  contact_name: string;
  contact_phone: string;
  favorites_count: number;
  published_at: string | null;
  updated_at: string;
  seller: Seller;
  // Tire-specific
  tire_vehicle_type?: string;
  tire_load_index?: string;
  tire_speed_index?: string;
  tire_run_flat?: boolean;
  tire_studded?: boolean;
  tire_reinforced?: boolean;
  tire_quantity?: number;
  tire_country_of_origin?: string;
  // Wheel-specific
  wheel_diameter?: number;
  wheel_width?: number;
  wheel_pcd?: string;
  wheel_offset?: number;
  wheel_dia?: number;
  wheel_type?: string;
  wheel_material?: string;
  wheel_quantity?: number;
  // Engine-specific
  engine_type?: string;
  engine_displacement?: number;
  engine_power?: number;
  engine_cylinder_layout?: string;
  engine_cylinder_count?: number;
  // Body parts
  body_part_category?: string;
  body_part_side?: string;
  body_part_color?: string;
}

export interface PartsListResponse {
  parts: PartListItem[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface PartsSearchParams extends PaginationParams {
  q?: string;
  part_type?: string;
  condition?: "new" | "used";
  price_from?: number;
  price_to?: number;
  city_id?: string;
  brand?: string;
  sort?: "date_desc" | "date_asc" | "price_asc" | "price_desc";
  // Tire filters
  tire_type?: string;
  tire_width?: number;
  tire_profile?: number;
  tire_diameter?: number;
  // Wheel filters
  wheel_diameter?: number;
  wheel_pcd?: string;
  wheel_type?: string;
}

// ── Rental ──
export interface RentalListItem {
  id: string;
  title: string;
  car_class: string;
  year: number;
  transmission: string;
  fuel_type: string;
  price_per_day: number;
  currency: string;
  photos: string[];
  contact_city: string;
  published_at: string;
}

export interface RentalOwner {
  id: string;
  name: string;
  phone: string;
  city: string;
  avatar: string | null;
  rating: number;
  reviews_count: number;
  cars_count: number;
}

export interface RentalDetail extends RentalListItem {
  description: string | null;
  seats: number;
  engine_volume: string | null;
  mileage: string | null;
  owner: RentalOwner;
  views_count: number;
  created_at: string;
}

export interface RentalListResponse {
  cars: RentalListItem[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface RentalSearchParams extends PaginationParams {
  q?: string;
  car_class?: string;
  price_from?: number;
  price_to?: number;
  city?: string;
  sort?: "date_desc" | "price_asc" | "price_desc";
}

// ── Dictionaries ──
export interface VehicleType {
  id: string;
  name: string;
  icon?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string | null;
  vehicle_type: string;
}

export interface Model {
  id: string;
  brand_id: string;
  name: string;
}

export interface Generation {
  id: string;
  model_id: string;
  name: string;
  year_from: number;
  year_to: number | null;
}

export interface City {
  id: string;
  name: string;
}

export interface DictItem {
  id: string;
  name: string;
  hex?: string;
  category?: string;
}

export interface DictsResponse {
  vehicle_types: VehicleType[];
  brands: Brand[];
  models: Model[];
  // Cars / shared
  fuel_types: DictItem[];
  transmission_types: DictItem[];
  drive_types: DictItem[];
  body_types: DictItem[];
  colors: DictItem[];
  cities: City[];
  conditions: DictItem[];
  options: DictItem[];
  pts_options?: DictItem[];
  steering_positions?: DictItem[];
  // Moto
  moto_motorcycle_types?: DictItem[];
  moto_engine_types?: DictItem[];
  moto_drive_types?: DictItem[];
  moto_transmission_types?: DictItem[];
  moto_cylinder_layouts?: DictItem[];
  moto_strokes?: DictItem[];
  // Commercial
  commercial_body_types?: DictItem[];
  commercial_engine_types?: DictItem[];
  commercial_drive_types?: DictItem[];
  commercial_transmission_types?: DictItem[];
  commercial_equipment?: DictItem[];
  commercial_airbags?: DictItem[];
  commercial_windows?: DictItem[];
  commercial_radio?: DictItem[];
}

// ── Auth ──
export interface AuthRequestBody {
  phone: string;
}

export interface AuthRequestResponse {
  success: boolean;
  message: string;
  expires_in: number;
}

export interface AuthVerifyBody {
  phone: string;
  code: string;
}

export interface AuthVerifyResponse {
  token: string;
  user: {
    id: string;
    phone: string;
    name: string | null;
    created_at: string;
  };
}

export interface AuthRefreshResponse {
  token: string;
  expires_at: string;
}

// ── Profile ──
export interface UserProfile {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  city: string | null;
  user_type: "private" | "business";
  phone_verified: boolean;
  rating: number;
  reviews_count: number;
  ads_count: number;
  created_at: string;
}

export interface PublicUser {
  id: string;
  name: string | null;
  city: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  user_type: "private" | "business";
  rating: number;
  reviews_count: number;
  ads_count: number;
  created_at: string;
}

export interface UpdateProfileBody {
  name?: string;
  email?: string;
  bio?: string;
  city_id?: string;
}

// ── Favorites ──
export interface FavoritesListResponse {
  ads: AdListItem[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ── My Ads ──
export interface MyAdSubmitResponse {
  id: string;
  status: string;
  title: string;
  price: number;
  currency: string;
  year: number;
  brand: string;
  model: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAdDraftResponse {
  ad_id: string;
  status: "draft";
}

// ── Photo Upload ──
export interface PhotoUploadResponse {
  id: string;
  url: string;
}

export interface VideoUploadResponse {
  id: string;
  url: string;
}

// ── Ad Update Body (PATCH /my/ads/:id) ──
export interface AdUpdateBody {
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
  contact_additional?: string | null;
  negotiable?: boolean;
  can_exchange?: boolean;
  vehicle_status?: string;
  is_customs_cleared?: boolean;
  pts?: string;
  owners?: number;
  is_damaged?: boolean;
  modification?: string;
  steering_wheel?: string;
}

// ── Reports ──
export interface ReportBody {
  entity: "ad" | "user" | "review" | "logbook_post";
  entity_id: string;
  reason: string;
}

export interface ReportResponse {
  id: string;
  status: "pending";
}

// ── Services ──
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  companies_count: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  category_id: string;
  description: string | null;
  phone: string;
  address: string | null;
  city: string;
  logo_url: string | null;
  rating: number;
  reviews_count: number;
  is_verified: boolean;
  working_hours: Record<string, string | null>;
}

export interface ServiceProviderDetail extends ServiceProvider {
  latitude: number | null;
  longitude: number | null;
  photos: string[];
}

// ── Reviews ──
export interface Review {
  id: string;
  user_name: string;
  user_avatar: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
  average_rating: number;
}

// ── Chats ──
export interface ChatListItem {
  id: string;
  ad: {
    id: string;
    title: string;
    photo: string;
    price: number;
  };
  partner: {
    id: string;
    name: string;
    avatar: string | null;
  };
  last_message: {
    text: string;
    created_at: string;
    is_mine: boolean;
  } | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChatsListResponse {
  chats: ChatListItem[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  text: string | null;
  media_url: string | null;
  media_type: "image" | "video" | null;
  is_mine: boolean;
  is_read: boolean;
  created_at: string;
}

export interface MessagesListResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ── Logbook ──
export interface LogbookAuthor {
  id: string;
  name: string;
  avatar: string | null;
}

export interface LogbookPostListItem {
  id: string;
  author: LogbookAuthor;
  title: string;
  category: string;
  excerpt: string;
  photos: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface LogbookPostDetail {
  id: string;
  author: LogbookAuthor;
  title: string;
  text: string;
  category: string;
  photos: string[];
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface LogbookListResponse {
  posts: LogbookPostListItem[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface LogbookSearchParams extends PaginationParams {
  category?: string;
  author_id?: string;
  q?: string;
  sort?: "date_desc" | "popular";
}

export interface LogbookComment {
  id: string;
  author: LogbookAuthor;
  text: string;
  created_at: string;
}

export interface LogbookCommentsResponse {
  comments: LogbookComment[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ── Notifications ──
export interface Notification {
  id: string;
  type: "new_message" | "ad_status" | "price_change" | "new_review" | "system" | "promo";
  title: string;
  body: string | null;
  data: Record<string, string> | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
  unread_count: number;
}

export interface NotificationsSearchParams extends PaginationParams {
  type?: string;
  is_read?: boolean;
}

// ── Profile Settings ──
export interface ProfileSettings {
  notifications: {
    messages: boolean;
    price_changes: boolean;
    ad_status: boolean;
    new_reviews: boolean;
    system: boolean;
    promo: boolean;
  };
  privacy: {
    hide_name: boolean;
    hide_phone: boolean;
    call_hours_from: string | null;
    call_hours_to: string | null;
  };
  app: {
    language: string;
    theme: string;
  };
}

export type UpdateSettingsBody = {
  notifications?: Partial<ProfileSettings["notifications"]>;
  privacy?: Partial<ProfileSettings["privacy"]>;
  app?: Partial<ProfileSettings["app"]>;
};

// ── Error ──
export interface ApiError {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
    remaining_attempts?: number;
    block_reason?: string;
    blocked_until?: string;
  };
}
