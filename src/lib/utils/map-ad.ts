"use client";

import type { Ad } from "@/lib/types/ad";
import type { AdListItem } from "@/lib/types/api";
import {
  label,
  FUEL_LABELS,
  TRANSMISSION_LABELS,
  DRIVE_LABELS,
  BODY_LABELS,
  COLOR_LABELS,
  CITY_LABELS,
  CONDITION_LABELS,
} from "@/lib/utils/dict-labels";

export function mapAdListItemToAd(item: AdListItem): Ad {
  return {
    id: item.id,
    brand: item.brand,
    model: item.model,
    version: item.generation ?? undefined,
    price: item.price,
    category: "cars",
    year: item.year,
    mileage: item.mileage,
    // Бэкенд отдаёт слаги (petrol, automatic, fwd, sedan, dushanbe) —
    // без перевода они так и выводились в характеристиках объявления.
    engineType: label(item.fuel, FUEL_LABELS),
    transmission: label(item.transmission, TRANSMISSION_LABELS),
    driveType: label(item.drive, DRIVE_LABELS),
    location: label(item.location, CITY_LABELS),
    publishedDate: item.created_at,
    image: item.photos[0] ?? "",
    hasVideo: false,
    condition: label(item.condition, CONDITION_LABELS),
    color: label(item.color, COLOR_LABELS),
    bodyType: label(item.body, BODY_LABELS),
    statusNew: item.condition === "new",
    statusOnOrder: item.status === "on_order",
    sellerName: item.seller?.name,
    sellerPhone: item.seller?.phone,
    sellerType: item.seller?.type === "business" ? "dealer" : "private",
    sellerAdsCount: item.seller?.ads_count,
    sellerPhoneVerified: item.seller?.phone_verified,
  };
}
