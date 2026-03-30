export interface Ad {
  id: string;
  brand: string;
  model: string;
  version?: string;
  price: number;
  category: 'cars' | 'moto' | 'commercial';
  year: number;
  mileage: number;
  engineType: string;
  transmission: string;
  driveType: string;
  location: string;
  publishedDate: string;
  image: string;
  hasVideo?: boolean;
  isCustomsCleared?: boolean;

  // Детальная информация
  engineVolume?: string;
  bodyType?: string;
  color?: string;
  condition?: string;
  owners?: number;
  pts?: string;
  description?: string;
  equipment?: string[];
  vehicleStatus?: 'В наличии' | 'На заказ';
  negotiable?: boolean;

  // Статусы для отображения
  statusNew?: boolean;
  statusCustomsCleared?: boolean;
  statusAvailable?: boolean;
  statusOnOrder?: boolean;

  // Продавец
  sellerName?: string;
  sellerPhone?: string;
  sellerType?: 'private' | 'dealer';
  sellerAdsCount?: number;
  sellerPhoneVerified?: boolean;
}
