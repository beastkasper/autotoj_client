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
  Gauge,
  Settings2,
  Phone,
  MessageCircle,
  Shield,
  Upload,
  ChevronLeft,
  Palette,
  Users,
  FileText,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdImageSection } from "@/components/ad/AdImageSection";
import { AdPriceCard } from "@/components/ad/AdPriceCard";
import { AdSpecsTable } from "@/components/ad/AdSpecsTable";
import { SellerCard } from "@/components/ad/SellerCard";
import { AdActionBar } from "@/components/ad/AdActionBar";
import { getAdById } from "@/lib/data/mockAds";
import { formatPrice } from "@/lib/utils/formatPrice";

export default function AdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const ad = getAdById(id);
  const [isFavorite, setIsFavorite] = useState(false);

  const title = useMemo(
    () =>
      ad
        ? ad.version
          ? `${ad.brand} ${ad.model} ${ad.version}`
          : `${ad.brand} ${ad.model}`
        : "",
    [ad]
  );

  const specs = useMemo(() => {
    if (!ad) return [];
    const result: { icon: typeof Gauge; label: string; value: string }[] = [];
    if (ad.year) result.push({ icon: Calendar, label: "Год выпуска", value: `${ad.year}` });
    if (ad.mileage !== undefined) result.push({ icon: Gauge, label: "Пробег", value: `${ad.mileage.toLocaleString("ru-RU")} км` });
    if (ad.bodyType) result.push({ icon: Settings2, label: "Тип кузова", value: ad.bodyType });
    if (ad.color) result.push({ icon: Palette, label: "Цвет", value: ad.color });
    if (ad.engineType) {
      const engineLabel = ad.engineVolume ? `${ad.engineVolume} / ${ad.engineType}` : ad.engineType;
      result.push({ icon: Fuel, label: "Двигатель", value: engineLabel });
    }
    if (ad.transmission) result.push({ icon: Settings2, label: "Коробка передач", value: ad.transmission });
    if (ad.driveType) result.push({ icon: Settings2, label: "Привод", value: ad.driveType });
    if (ad.condition) result.push({ icon: Shield, label: "Состояние", value: ad.condition });
    if (ad.owners !== undefined) result.push({ icon: Users, label: "Владельцев", value: `${ad.owners}` });
    if (ad.isCustomsCleared !== undefined) result.push({ icon: FileText, label: "Растаможен", value: ad.isCustomsCleared ? "Да" : "Нет" });
    return result;
  }, [ad]);

  const quickStats = useMemo(() => {
    if (!ad) return [];
    const qs: string[] = [];
    if (ad.year) qs.push(`${ad.year}`);
    if (ad.mileage !== undefined) qs.push(`${ad.mileage.toLocaleString("ru-RU")} км`);
    if (ad.engineType) qs.push(ad.engineType);
    return qs;
  }, [ad]);

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
          <Button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-[#111111] text-white rounded-2xl text-[14px] font-medium hover:bg-[#333]"
          >
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
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
                image={ad.image}
                alt={title}
                statusNew={ad.statusNew}
                statusOnOrder={ad.statusOnOrder}
                className="aspect-[16/10] rounded-2xl"
              />

              {ad.description && (
                <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
                  <CardContent className="p-6">
                    <h2 className="text-[16px] font-semibold text-[#111111] mb-3 font-[family-name:var(--font-manrope)]">
                      Описание
                    </h2>
                    <p className="text-[14px] text-[#333] leading-relaxed font-[family-name:var(--font-manrope)]">
                      {ad.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              <AdSpecsTable specs={specs} />

              {ad.equipment && ad.equipment.length > 0 && (
                <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
                  <CardContent className="p-6">
                    <h2 className="text-[16px] font-semibold text-[#111111] mb-3 font-[family-name:var(--font-manrope)]">
                      Комплектация
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {ad.equipment.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#4CAF50] mt-0.5 shrink-0" />
                          <span className="text-[13px] text-[#333] font-[family-name:var(--font-manrope)]">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column — Sticky */}
            <div className="sticky top-28 space-y-4">
              <AdPriceCard
                price={ad.price}
                title={title}
                location={ad.location}
                isFavorite={isFavorite}
                onFavoriteToggle={() => setIsFavorite(!isFavorite)}
                quickStats={quickStats}
              />

              <div className="space-y-3">
                <Button className="w-full h-[52px] bg-[#E53935] text-white rounded-2xl text-[15px] font-semibold hover:bg-[#D32F2F] font-[family-name:var(--font-manrope)]">
                  <Phone className="w-[18px] h-[18px]" />
                  Позвонить
                </Button>
                <Button className="w-full h-[52px] bg-[#111111] text-white rounded-2xl text-[15px] font-semibold hover:bg-[#333] font-[family-name:var(--font-manrope)]">
                  <MessageCircle className="w-[18px] h-[18px]" />
                  Написать
                </Button>
              </div>

              <SellerCard
                sellerName={ad.sellerName}
                sellerType={ad.sellerType}
                sellerAdsCount={ad.sellerAdsCount}
                publishedDate={ad.publishedDate}
                vehicleStatus={ad.vehicleStatus}
              />

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
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-full"
            >
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
        <AdImageSection
          image={ad.image}
          alt={title}
          statusNew={ad.statusNew}
          statusOnOrder={ad.statusOnOrder}
          className="aspect-[16/10]"
        />

        {/* Title + Price */}
        <div className="px-4 mt-5">
          <h1 className="text-[20px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
            {title}
          </h1>
          <p className="text-[22px] font-bold text-[#111111] mt-3 font-[family-name:var(--font-manrope)]">
            {formatPrice(ad.price)}{" "}
            <span className="text-[14px] font-medium text-[#8E8E93]">сомони</span>
          </p>
          <div className="flex items-center gap-2 mt-2 text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{ad.location}</span>
            {ad.publishedDate && <span>• {ad.publishedDate}</span>}
          </div>
        </div>

        {/* Description */}
        {ad.description && (
          <div className="px-4 mt-5">
            <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
              <CardContent className="p-4">
                <h2 className="text-[16px] font-semibold text-[#111111] mb-2 font-[family-name:var(--font-manrope)]">
                  Описание
                </h2>
                <p className="text-[14px] text-[#333] leading-relaxed font-[family-name:var(--font-manrope)]">
                  {ad.description}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Seller */}
        <div className="px-4 mt-5">
          <SellerCard
            sellerName={ad.sellerName}
            sellerType={ad.sellerType}
            sellerAdsCount={ad.sellerAdsCount}
            vehicleStatus={ad.vehicleStatus}
          />
        </div>

        {/* Specs */}
        {specs.length > 0 && (
          <div className="px-4 mt-5">
            <AdSpecsTable specs={specs} />
          </div>
        )}

        {/* Equipment */}
        {ad.equipment && ad.equipment.length > 0 && (
          <div className="px-4 mt-5">
            <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
              <CardContent className="p-4">
                <h2 className="text-[16px] font-semibold text-[#111111] mb-3 font-[family-name:var(--font-manrope)]">
                  Комплектация
                </h2>
                <div className="space-y-2">
                  {ad.equipment.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#4CAF50] mt-0.5 shrink-0" />
                      <span className="text-[13px] text-[#333] font-[family-name:var(--font-manrope)]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Mobile Bottom CTA */}
      <AdActionBar />
    </div>
  );
}
