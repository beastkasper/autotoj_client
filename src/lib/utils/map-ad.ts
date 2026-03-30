"use client";

import type { Ad } from "@/lib/types/ad";
import type { AdListItem } from "@/lib/types/api";

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
    engineType: item.fuel,
    transmission: item.transmission,
    driveType: item.drive,
    location: item.location,
    publishedDate: item.created_at,
    image: item.photos[0] ?? "",
    hasVideo: false,
    condition: item.condition,
    color: item.color,
    bodyType: item.body,
    statusNew: item.condition === "new",
    statusOnOrder: item.status === "on_order",
    sellerName: item.seller?.name,
    sellerPhone: item.seller?.phone,
    sellerType: item.seller?.type === "business" ? "dealer" : "private",
    sellerAdsCount: item.seller?.ads_count,
    sellerPhoneVerified: item.seller?.phone_verified,
  };
}
