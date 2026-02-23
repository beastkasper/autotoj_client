"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
  X,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Fuel,
  Settings2,
  Phone,
  MessageCircle,
  Upload,
  ChevronLeft,
  CircleDot,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdImageSection } from "@/components/ad/AdImageSection";
import { AdSpecsTable } from "@/components/ad/AdSpecsTable";
import { AdActionBar } from "@/components/ad/AdActionBar";
import { RentalCard } from "@/components/cards/RentalCard";
import {
  getRentalById,
  getSimilarRentals,
} from "@/lib/data/mockRentals";
import { formatFullDateWithCity } from "@/lib/utils/dateFormat";

export default function RentalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const car = getRentalById(id);
  const similarCars = useMemo(() => getSimilarRentals(id), [id]);
  const [isFavorite, setIsFavorite] = useState(false);

  const specs = useMemo(() => {
    if (!car) return [];
    const result: { icon: typeof Calendar; label: string; value: string }[] = [];
    if (car.year) result.push({ icon: Calendar, label: "Год выпуска", value: `${car.year}` });
    if (car.transmission) result.push({ icon: Settings2, label: "Трансмиссия", value: car.transmission });
    if (car.fuel) result.push({ icon: Fuel, label: "Топливо", value: car.fuel });
    if (car.carClass) result.push({ icon: CircleDot, label: "Класс", value: car.carClass });
    return result;
  }, [car]);

  if (!car) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[18px] font-semibold text-[#111111] mb-2 font-[family-name:var(--font-manrope)]">
            Объявление не найдено
          </p>
          <p className="text-[14px] text-[#8E8E93] mb-6 font-[family-name:var(--font-manrope)]">
            Возможно, оно было удалено или ссылка устарела.
          </p>
          <Button
            onClick={() => router.push("/rental")}
            className="px-6 py-3 bg-[#111111] text-white rounded-2xl text-[14px] font-medium hover:bg-[#333]"
          >
            Вернуться к прокату
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: car.title, url: window.location.href });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* ── Desktop Top Action Bar ── */}
      <div className="hidden lg:block bg-white border-b border-[#E5E5E7]">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[14px] text-[#111111] hover:text-[#8E8E93] font-medium font-[family-name:var(--font-manrope)]"
          >
            <X className="w-4 h-4" />
            Закрыть
          </Button>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleShare}
              className="flex items-center gap-2 text-[14px] text-[#111111] hover:text-[#8E8E93] font-medium font-[family-name:var(--font-manrope)]"
            >
              <Upload className="w-4 h-4" />
              Поделиться
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-2 text-[14px] font-medium font-[family-name:var(--font-manrope)] ${
                isFavorite ? "text-[#E53935]" : "text-[#111111] hover:text-[#8E8E93]"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-[#E53935]" : ""}`} />
              В избранное
            </Button>
          </div>
        </div>
      </div>

      {/* ── Desktop Two-Column Layout ── */}
      <div className="hidden lg:block">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="grid grid-cols-[1fr_380px] gap-8 items-start">
            {/* Left Column */}
            <div className="space-y-6">
              <AdImageSection
                image={car.image}
                alt={car.title}
                className="aspect-[16/10] rounded-2xl"
              />

              {/* Thumbnail strip */}
              {car.images && car.images.length > 1 && (
                <div className="flex gap-3">
                  {car.images.map((img, i) => (
                    <div
                      key={i}
                      className="w-[120px] h-[80px] rounded-xl overflow-hidden bg-[#E5E5E7] border-2 border-transparent hover:border-[#111111] transition-colors cursor-pointer"
                    >
                      <img src={img} alt={`${car.title} ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Specs */}
              <AdSpecsTable specs={specs} title="Характеристики" />

              {/* Description */}
              {car.description && (
                <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
                  <CardContent className="p-6">
                    <h2 className="text-[16px] font-semibold text-[#111111] mb-3 font-[family-name:var(--font-manrope)]">
                      Описание
                    </h2>
                    <p className="text-[14px] text-[#333] leading-relaxed font-[family-name:var(--font-manrope)]">
                      {car.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Similar listings */}
              {similarCars.length > 0 && (
                <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
                  <CardContent className="p-6">
                    <h2 className="text-[16px] font-semibold text-[#111111] mb-4 font-[family-name:var(--font-manrope)]">
                      Похожие объявления
                    </h2>
                    <div className="grid grid-cols-4 gap-3">
                      {similarCars.map((c) => (
                        <RentalCard
                          key={c.id}
                          car={c}
                          onClick={(cId) => router.push(`/rental/${cId}`)}
                          variant="desktop"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column — Sticky */}
            <div className="sticky top-28 space-y-4">
              {/* Price Card */}
              <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
                <CardContent className="p-6">
                  <h1 className="text-[22px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
                    {car.title}
                  </h1>
                  <p className="text-[13px] text-[#8E8E93] mt-1 font-[family-name:var(--font-manrope)]">
                    Стоимость аренды
                  </p>
                  <p className="text-[28px] font-bold text-[#111111] mt-2 font-[family-name:var(--font-manrope)]">
                    {car.pricePerDay} сомони{" "}
                    <span className="text-[16px] font-normal text-[#8E8E93]">/ день</span>
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{formatFullDateWithCity(car.publishedDate, car.city)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Card */}
              <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
                <CardContent className="p-5">
                  <p className="text-[14px] font-semibold text-[#111111] mb-3 font-[family-name:var(--font-manrope)]">
                    Арендодатель
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-[#F2F2F7]">
                        <User className="w-5 h-5 text-[#8E8E93]" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[14px] font-medium text-[#111111] font-[family-name:var(--font-manrope)]">
                        {car.sellerName || "Арендодатель"}
                      </p>
                      <p className="text-[12px] text-[#8E8E93] mt-0.5 font-[family-name:var(--font-manrope)]">
                        <MapPin className="w-3 h-3 inline mr-0.5" />
                        {car.city}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button className="w-full h-[52px] bg-[#111111] text-white rounded-2xl text-[15px] font-semibold hover:bg-[#333] font-[family-name:var(--font-manrope)]">
                  <Phone className="w-[18px] h-[18px]" />
                  Позвонить
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-[52px] rounded-2xl text-[15px] font-semibold border-[#E5E5E7] text-[#111111] hover:bg-[#F5F5F7] font-[family-name:var(--font-manrope)]"
                >
                  <MessageCircle className="w-[18px] h-[18px]" />
                  Написать
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={handleShare}
                className="w-full h-[44px] rounded-2xl text-[14px] text-[#E53935] font-medium border-[#E5E5E7] hover:bg-[#FFF5F5] font-[family-name:var(--font-manrope)]"
              >
                Поделиться объявлением
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Header ── */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E7]">
        <div className="flex items-center justify-between px-4 h-14">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full -ml-2"
          >
            <ChevronLeft className="w-5 h-5 text-[#111111]" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare} className="rounded-full">
              <Share2 className="w-5 h-5 text-[#111111]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className="rounded-full"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-[#E53935] text-[#E53935]" : "text-[#111111]"}`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Mobile Content ── */}
      <div className="lg:hidden pb-24">
        <AdImageSection image={car.image} alt={car.title} className="aspect-[16/10]" />

        {/* Title + Price */}
        <div className="px-4 mt-5">
          <h1 className="text-[20px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
            {car.title}
          </h1>
          <p className="text-[13px] text-[#8E8E93] mt-1 font-[family-name:var(--font-manrope)]">
            Стоимость аренды
          </p>
          <p className="text-[22px] font-bold text-[#111111] mt-2 font-[family-name:var(--font-manrope)]">
            {car.pricePerDay} сомони{" "}
            <span className="text-[14px] font-medium text-[#8E8E93]">/ день</span>
          </p>
          <div className="flex items-center gap-2 mt-2 text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{formatFullDateWithCity(car.publishedDate, car.city)}</span>
          </div>
        </div>

        {/* Seller */}
        <div className="px-4 mt-5">
          <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
            <CardContent className="p-4">
              <p className="text-[14px] font-semibold text-[#111111] mb-3 font-[family-name:var(--font-manrope)]">
                Арендодатель
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-[#F2F2F7]">
                    <User className="w-5 h-5 text-[#8E8E93]" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[14px] font-medium text-[#111111] font-[family-name:var(--font-manrope)]">
                    {car.sellerName || "Арендодатель"}
                  </p>
                  <p className="text-[12px] text-[#8E8E93] mt-0.5 font-[family-name:var(--font-manrope)]">
                    <MapPin className="w-3 h-3 inline mr-0.5" />
                    {car.city}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Specs */}
        {specs.length > 0 && (
          <div className="px-4 mt-5">
            <AdSpecsTable specs={specs} title="Характеристики" />
          </div>
        )}

        {/* Description */}
        {car.description && (
          <div className="px-4 mt-5">
            <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
              <CardContent className="p-4">
                <h2 className="text-[16px] font-semibold text-[#111111] mb-2 font-[family-name:var(--font-manrope)]">
                  Описание
                </h2>
                <p className="text-[14px] text-[#333] leading-relaxed font-[family-name:var(--font-manrope)]">
                  {car.description}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Similar */}
        {similarCars.length > 0 && (
          <div className="px-4 mt-5">
            <h2 className="text-[16px] font-semibold text-[#111111] mb-3 font-[family-name:var(--font-manrope)]">
              Похожие объявления
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {similarCars.map((c) => (
                <RentalCard
                  key={c.id}
                  car={c}
                  onClick={(cId) => router.push(`/rental/${cId}`)}
                  variant="mobile"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom CTA */}
      <AdActionBar />
    </div>
  );
}
