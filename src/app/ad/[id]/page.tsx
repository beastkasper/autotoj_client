"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Settings2,
  Video,
  Phone,
  MessageCircle,
  ChevronRight,
  Shield,
  Clock,
} from "lucide-react";
import { getAdById } from "@/lib/data/mockAds";
import type { Ad } from "@/components/cards/AdCard";
import { ImageWithFallback } from "@/components/cards/ImageWithFallback";

const formatPrice = (price: number) =>
  price.toLocaleString("ru-RU").replace(/,/g, " ");

export default function AdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const ad = getAdById(id);
  const [isFavorite, setIsFavorite] = useState(ad?.isFavorite ?? false);

  if (!ad) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[18px] font-semibold text-[#111111] mb-2 font-[family-name:var(--font-manrope)]">
            Объявление не найдено
          </p>
          <p className="text-[14px] text-[#8E8E93] mb-6 font-[family-name:var(--font-manrope)]">
            Возможно, оно было удалено или ссылка устарела.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-[#111111] text-white rounded-2xl text-[14px] font-medium font-[family-name:var(--font-manrope)] hover:bg-[#333] transition-colors"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  const title =
    ad.category === "parts"
      ? ad.title || "Запчасть"
      : `${ad.brand} ${ad.model}`;

  // Build spec rows
  const specs: { icon: typeof Gauge; label: string; value: string }[] = [];

  if (ad.year) specs.push({ icon: Calendar, label: "Год выпуска", value: `${ad.year} г.` });
  if (ad.mileage !== undefined) specs.push({ icon: Gauge, label: "Пробег", value: `${ad.mileage.toLocaleString("ru-RU")} км` });
  if (ad.engineType) specs.push({ icon: Fuel, label: "Топливо", value: ad.engineType });
  if (ad.engineVolume) specs.push({ icon: Settings2, label: "Объём двигателя", value: `${ad.engineVolume} л` });
  if (ad.transmission) specs.push({ icon: Settings2, label: "КПП", value: ad.transmission });
  if (ad.driveType) specs.push({ icon: Settings2, label: "Привод", value: ad.driveType });
  if (ad.motorcycleType) specs.push({ icon: Settings2, label: "Тип мото", value: ad.motorcycleType });
  if (ad.motorHours) specs.push({ icon: Clock, label: "Моточасы", value: `${ad.motorHours} ч` });
  if (ad.bodyType) specs.push({ icon: Settings2, label: "Кузов", value: ad.bodyType });
  if (ad.condition) specs.push({ icon: Shield, label: "Состояние", value: ad.condition });
  if (ad.partCategory) specs.push({ icon: Settings2, label: "Категория", value: ad.partCategory });

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* ──── Mobile Header ──── */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E7]">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center -ml-2 hover:bg-[#F2F2F7] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#111111]" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title, url: window.location.href });
                }
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F2F2F7] transition-colors"
            >
              <Share2 className="w-5 h-5 text-[#111111]" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F2F2F7] transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-[#E53935] text-[#E53935]" : "text-[#111111]"}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto lg:py-8">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
          {/* ──── Left Column ──── */}
          <div>
            {/* Desktop back button */}
            <button
              onClick={() => router.back()}
              className="hidden lg:flex items-center gap-2 text-[14px] text-[#8E8E93] hover:text-[#111111] transition-colors mb-4 font-[family-name:var(--font-manrope)]"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к результатам
            </button>

            {/* Image */}
            <div className="relative aspect-[16/10] lg:rounded-2xl overflow-hidden bg-[#E5E5E7]">
              <ImageWithFallback
                src={ad.image}
                alt={title}
                className="w-full h-full object-cover"
              />

              {/* Status badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {ad.statusNew && (
                  <span className="bg-[#4CAF50] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg font-[family-name:var(--font-manrope)]">
                    Новый
                  </span>
                )}
                {ad.statusOnOrder && (
                  <span className="bg-[#111111] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg font-[family-name:var(--font-manrope)]">
                    На заказ
                  </span>
                )}
              </div>

              {/* Video badge */}
              {ad.hasVideo && (
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-white" />
                  <span className="text-white text-[12px] font-medium font-[family-name:var(--font-manrope)]">
                    Видео
                  </span>
                </div>
              )}

              {/* Desktop fav + share */}
              <div className="hidden lg:flex absolute top-4 right-4 gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                >
                  <Heart
                    className={`w-5 h-5 ${isFavorite ? "fill-[#E53935] text-[#E53935]" : "text-[#111111]"}`}
                  />
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title, url: window.location.href });
                    }
                  }}
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                >
                  <Share2 className="w-5 h-5 text-[#111111]" />
                </button>
              </div>
            </div>

            {/* ──── Content (mobile: below image, desktop: left col) ──── */}
            <div className="px-4 lg:px-0 mt-6">
              {/* Title + Price */}
              <div className="mb-6">
                <h1 className="text-[22px] lg:text-[28px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
                  {title}
                </h1>
                {ad.version && (
                  <p className="text-[14px] text-[#8E8E93] mt-1 font-[family-name:var(--font-manrope)]">
                    {ad.version}
                  </p>
                )}
                <p className="text-[24px] lg:text-[30px] font-bold text-[#111111] mt-3 font-[family-name:var(--font-manrope)]">
                  {formatPrice(ad.price)}{" "}
                  <span className="text-[16px] font-medium text-[#8E8E93]">
                    {ad.currency || "сомони"}
                  </span>
                </p>
              </div>

              {/* Specs */}
              {specs.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E5E5E7] overflow-hidden mb-6">
                  <h2 className="text-[16px] font-semibold text-[#111111] px-4 pt-4 pb-2 font-[family-name:var(--font-manrope)]">
                    Характеристики
                  </h2>
                  <div className="divide-y divide-[#F2F2F7]">
                    {specs.map((spec, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <spec.icon className="w-4 h-4 text-[#8E8E93]" />
                          <span className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                            {spec.label}
                          </span>
                        </div>
                        <span className="text-[14px] font-medium text-[#111111] font-[family-name:var(--font-manrope)]">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location & Date */}
              <div className="bg-white rounded-2xl border border-[#E5E5E7] overflow-hidden mb-6">
                <div className="divide-y divide-[#F2F2F7]">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <MapPin className="w-4 h-4 text-[#8E8E93]" />
                    <span className="text-[14px] text-[#111111] font-[family-name:var(--font-manrope)]">
                      {ad.location}
                    </span>
                  </div>
                  {ad.publishedDate && (
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Clock className="w-4 h-4 text-[#8E8E93]" />
                      <span className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                        Опубликовано {ad.publishedDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ──── Right Column (Desktop Sidebar) ──── */}
          <div className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              {/* Price Card */}
              <div className="bg-white rounded-2xl border border-[#E5E5E7] p-6">
                <p className="text-[28px] font-bold text-[#111111] mb-1 font-[family-name:var(--font-manrope)]">
                  {formatPrice(ad.price)}{" "}
                  <span className="text-[16px] font-medium text-[#8E8E93]">
                    {ad.currency || "сомони"}
                  </span>
                </p>
                <p className="text-[13px] text-[#8E8E93] mb-6 font-[family-name:var(--font-manrope)]">
                  {title}{ad.version ? ` · ${ad.version}` : ""}
                </p>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button className="w-full h-12 bg-[#111111] text-white rounded-2xl text-[15px] font-semibold flex items-center justify-center gap-2 hover:bg-[#333] transition-colors font-[family-name:var(--font-manrope)]">
                    <Phone className="w-4 h-4" />
                    Позвонить
                  </button>
                  <button className="w-full h-12 bg-[#F2F2F7] text-[#111111] rounded-2xl text-[15px] font-semibold flex items-center justify-center gap-2 hover:bg-[#E5E5E7] transition-colors font-[family-name:var(--font-manrope)]">
                    <MessageCircle className="w-4 h-4" />
                    Написать
                  </button>
                </div>
              </div>

              {/* Seller Card */}
              <div className="bg-white rounded-2xl border border-[#E5E5E7] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[14px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
                      П
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#111111] font-[family-name:var(--font-manrope)]">
                        Продавец
                      </p>
                      <p className="text-[12px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                        На autoTOJ с 2024 года
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#C7C7CC]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──── Mobile Bottom CTA ──── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E5E5E7] px-4 py-3 pb-safe">
        <div className="flex gap-3">
          <button className="flex-1 h-12 bg-[#111111] text-white rounded-2xl text-[15px] font-semibold flex items-center justify-center gap-2 active:bg-[#333] transition-colors font-[family-name:var(--font-manrope)]">
            <Phone className="w-4 h-4" />
            Позвонить
          </button>
          <button className="flex-1 h-12 bg-[#F2F2F7] text-[#111111] rounded-2xl text-[15px] font-semibold flex items-center justify-center gap-2 active:bg-[#E5E5E7] transition-colors font-[family-name:var(--font-manrope)]">
            <MessageCircle className="w-4 h-4" />
            Написать
          </button>
        </div>
      </div>
    </div>
  );
}
