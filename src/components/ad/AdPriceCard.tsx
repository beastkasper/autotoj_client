"use client";

import { Heart, MapPin, Calendar, Gauge, Fuel } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/formatPrice";

interface AdPriceCardProps {
  price: number;
  title: string;
  location: string;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  quickStats: string[];
}

export function AdPriceCard({
  price,
  title,
  location,
  isFavorite,
  onFavoriteToggle,
  quickStats,
}: AdPriceCardProps) {
  return (
    <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <p className="text-[28px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
            {formatPrice(price)}{" "}
            <span className="text-[16px] font-medium text-[#8E8E93]">сомони</span>
          </p>
          <button onClick={onFavoriteToggle} className="mt-1">
            <Heart
              className={`w-6 h-6 transition-colors ${
                isFavorite
                  ? "fill-[#E53935] text-[#E53935]"
                  : "text-[#C7C7CC] hover:text-[#8E8E93]"
              }`}
            />
          </button>
        </div>

        <h1 className="text-[16px] font-semibold text-[#111111] mt-3 font-[family-name:var(--font-manrope)]">
          {title}
        </h1>

        {quickStats.length > 0 && (
          <div className="flex items-center gap-2 mt-2 text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
            {quickStats.map((stat, i) => (
              <span key={i} className="flex items-center gap-1">
                {i === 0 && <Calendar className="w-3.5 h-3.5" />}
                {i === 1 && <Gauge className="w-3.5 h-3.5" />}
                {i === 2 && <Fuel className="w-3.5 h-3.5" />}
                {stat}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5 mt-2 text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location}</span>
        </div>
      </CardContent>
    </Card>
  );
}
