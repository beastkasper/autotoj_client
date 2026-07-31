"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import {
  X,
  Heart,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Settings,
  Car,
  Cog,
  Phone,
  MessageCircle,
  Shield,
  Upload,
  ArrowLeft,
  Palette,
  Users,
  FileText,
  Check,
  Eye,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageGallery } from "@/components/ad/ImageGallery";
import { AdPriceCard } from "@/components/ad/AdPriceCard";
import { AdSpecsTable } from "@/components/ad/AdSpecsTable";
import { AdSpecsCardMobile } from "@/components/ad/AdSpecsCardMobile";
import { AdGalleryMobile } from "@/components/ad/AdGalleryMobile";
import { SellerCard } from "@/components/ad/SellerCard";
import { AdActionBar } from "@/components/ad/AdActionBar";
import { formatDayMonthWithCity } from "@/lib/utils/dateFormat";
import { useGetAdByIdQuery, useTrackAdViewMutation } from "@/lib/features/ads/adsApi";
import {
  useCheckFavoriteQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "@/lib/features/favorites/favoritesApi";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useAuth } from "@/hooks/useAuth";
import { useOpenChat } from "@/hooks/useOpenChat";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { DetailPageSkeleton } from "@/components/skeletons/detail-page-skeleton";

/** Склонение счётчика объявлений продавца (§10.2). */
function declOfAds(count: number): string {
  const n = count % 100;
  if (n > 10 && n < 20) return "объявлений";
  const d = n % 10;
  if (d === 1) return "объявление";
  if (d >= 2 && d <= 4) return "объявления";
  return "объявлений";
}

export default function AdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { requireAuth, showAuthModal, closeAuthModal } = useAuth();
  const { openChat, isOpening } = useOpenChat();
  const id = params.id as string;

  // Заголовок в шапке проявляется при прокрутке > 200px (§7.2 C)
  const [isScrolled, setIsScrolled] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // RTK Query — fetch from backend
  const { data: apiAd, isLoading } = useGetAdByIdQuery(id);
  const [trackView] = useTrackAdViewMutation();

  // Track view on mount
  useEffect(() => {
    trackView(id);
  }, [id, trackView]);

  // Map API data to local format
  const ad = useMemo(() => {
    if (!apiAd) return null;
    return {
      id: apiAd.id,
      brand: apiAd.brand,
      model: apiAd.model,
      version: apiAd.version ?? undefined,
      price: apiAd.price,
      category: "cars" as const,
      year: apiAd.year,
      mileage: apiAd.mileage,
      engineType: apiAd.fuel,
      transmission: apiAd.transmission,
      driveType: apiAd.drive,
      location: apiAd.location,
      publishedDate: apiAd.published_at ?? apiAd.created_at,
      image: apiAd.photos[0] ?? "",
      photos: apiAd.photos,
      bodyType: apiAd.body,
      color: apiAd.color,
      condition: apiAd.condition,
      engineVolume: apiAd.engine_volume ? `${apiAd.engine_volume}L` : undefined,
      sellerName: apiAd.seller.name,
      sellerType: (apiAd.seller.type === "business" ? "dealer" : apiAd.seller.type ?? "private") as "private" | "dealer",
      sellerAdsCount: apiAd.seller.ads_count ?? 0,
      description: apiAd.description ?? undefined,
      equipment: apiAd.options ?? undefined,
      vehicleStatus: (apiAd.vehicle_status === "on_order" ? "На заказ" : "В наличии") as "В наличии" | "На заказ",
      statusNew: apiAd.condition === "Новый",
      statusOnOrder: apiAd.vehicle_status === "on_order",
      owners: apiAd.owners,
      isCustomsCleared: apiAd.is_customs_cleared,
    };
  }, [apiAd]);

  // Favorites API
  const { data: favoriteData } = useCheckFavoriteQuery(id);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const isFavorite = favoriteData?.is_favorite ?? false;

  const handleFavoriteToggle = () => {
    requireAuth(() => {
      if (isFavorite) {
        removeFavorite(id);
      } else {
        addFavorite(id);
      }
    });
  };

  const title = useMemo(
    () =>
      ad
        ? ad.version
          ? `${ad.brand} ${ad.model} ${ad.version}`
          : `${ad.brand} ${ad.model}`
        : "",
    [ad]
  );

  // Порядок и иконки характеристик — по §5 и §10.2
  const specs = useMemo(() => {
    if (!ad) return [];
    const result: { icon: typeof Gauge; label: string; value: string }[] = [];
    if (ad.year) result.push({ icon: Calendar, label: "Год", value: `${ad.year}` });
    if (ad.transmission) result.push({ icon: Settings, label: "Трансмиссия", value: ad.transmission });
    if (ad.engineType) {
      const engineLabel = ad.engineVolume ? `${ad.engineVolume} / ${ad.engineType}` : ad.engineType;
      result.push({ icon: Fuel, label: "Топливо", value: engineLabel });
    }
    if (ad.bodyType) result.push({ icon: Car, label: "Кузов", value: ad.bodyType });
    if (ad.mileage !== undefined) result.push({ icon: Gauge, label: "Пробег", value: `${ad.mileage.toLocaleString("ru-RU")} км` });
    if (ad.color) result.push({ icon: Palette, label: "Цвет", value: ad.color });
    if (ad.driveType) result.push({ icon: Cog, label: "Привод", value: ad.driveType });
    if (ad.condition) result.push({ icon: Shield, label: "Состояние", value: ad.condition });
    if (ad.owners !== undefined) result.push({ icon: Users, label: "Владельцев", value: `${ad.owners}` });
    if (apiAd?.pts) result.push({ icon: FileText, label: "ПТС", value: apiAd.pts });
    return result;
  }, [ad, apiAd?.pts]);

  const quickStats = useMemo(() => {
    if (!ad) return [];
    const qs: string[] = [];
    if (ad.year) qs.push(`${ad.year}`);
    if (ad.mileage !== undefined) qs.push(`${ad.mileage.toLocaleString("ru-RU")} км`);
    if (ad.engineType) qs.push(ad.engineType);
    return qs;
  }, [ad]);

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

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
      {apiAd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: `${apiAd.brand} ${apiAd.model}${apiAd.version ? ` ${apiAd.version}` : ""}`,
              description: apiAd.description ?? `${apiAd.brand} ${apiAd.model} ${apiAd.year}`,
              image: apiAd.photos,
              offers: {
                "@type": "Offer",
                price: apiAd.price,
                priceCurrency: apiAd.currency || "TJS",
                availability: "https://schema.org/InStock",
                url: `https://autotoj.tj/ad/${apiAd.id}`,
              },
              brand: { "@type": "Brand", name: apiAd.brand },
              model: apiAd.model,
              vehicleModelDate: String(apiAd.year),
              mileageFromOdometer: {
                "@type": "QuantitativeValue",
                value: apiAd.mileage,
                unitCode: "KMT",
              },
            }),
          }}
        />
      )}

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
              onClick={() => handleFavoriteToggle()}
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
              <ImageGallery
                images={ad.photos.length > 0 ? ad.photos : [ad.image]}
                alt={title}
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
                onFavoriteToggle={handleFavoriteToggle}
                quickStats={quickStats}
              />

              <div className="space-y-3">
                <Button
                  onClick={() => requireAuth(() => {
                    if (apiAd?.seller?.phone) {
                      window.location.href = `tel:${apiAd.seller.phone}`;
                    }
                  })}
                  className="w-full h-[52px] bg-[#E53935] text-white rounded-2xl text-[15px] font-semibold hover:bg-[#D32F2F] font-[family-name:var(--font-manrope)]"
                >
                  <Phone className="w-[18px] h-[18px]" />
                  Позвонить
                </Button>
                <Button
                  onClick={() => openChat(id)}
                  disabled={isOpening}
                  className="w-full h-[52px] bg-[#111111] text-white rounded-2xl text-[15px] font-semibold hover:bg-[#333] font-[family-name:var(--font-manrope)]"
                >
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

      {/* ── Шапка деталей (§7.2 C): заголовок проявляется при scrollY > 200 ── */}
      <header className="blur-surface hairline sticky top-0 z-50 pt-[env(safe-area-inset-top)] lg:hidden">
        <div className="flex h-14 items-center gap-2 px-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Назад"
            className="icon-btn -ml-2.5"
          >
            <ArrowLeft className="size-5" strokeWidth={1.5} />
          </button>
          <h1
            className={`screen-title line-1 flex-1 text-center transition-opacity duration-200 ${
              isScrolled ? "opacity-100" : "opacity-0"
            }`}
          >
            {title}
          </h1>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Поделиться"
            className="icon-btn"
          >
            <Upload className="size-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => handleFavoriteToggle()}
            aria-label="В избранное"
            className="icon-btn -mr-2.5"
          >
            <Heart
              className={`size-5 ${isFavorite ? "text-[#E53935]" : ""}`}
              strokeWidth={1.5}
              fill={isFavorite ? "#E53935" : "none"}
            />
          </button>
        </div>
      </header>

      {/* ── Контент (§10.2) ── */}
      <div className="pb-[160px] lg:hidden">
        <AdGalleryMobile
          images={ad.photos.length > 0 ? ad.photos : [ad.image]}
          alt={title}
          hasVideo={!!apiAd?.video}
        />

        <div className="flex flex-col gap-4 px-4 pt-4">
          {/* Заголовок, цена, мета */}
          <section>
            <h2 className="mb-2 text-[22px] font-semibold leading-7 text-foreground">
              {title}
            </h2>
            <p className="mb-2 text-[28px] font-bold leading-8 text-foreground">
              {formatPrice(ad.price)} сомони
            </p>
            <div className="mb-3 flex items-center justify-between gap-3 text-[15px] text-muted-foreground">
              <span className="flex min-w-0 items-center gap-1.5">
                <MapPin className="size-4 shrink-0" strokeWidth={1.5} />
                <span className="line-1">
                  {ad.publishedDate
                    ? formatDayMonthWithCity(ad.publishedDate, ad.location)
                    : ad.location}
                </span>
              </span>
              {typeof apiAd?.views === "number" && (
                <span className="flex shrink-0 items-center gap-1.5">
                  <Eye className="size-4" strokeWidth={1.5} />
                  {apiAd.views}
                </span>
              )}
            </div>

            {/* Торг / обмен */}
            {(apiAd?.negotiable || apiAd?.can_exchange) && (
              <div className="mb-3 flex flex-wrap gap-3 text-[15px] text-foreground">
                {apiAd?.negotiable && <span>• Торг возможен</span>}
                {apiAd?.can_exchange && <span>• Обмен возможен</span>}
              </div>
            )}

            {/* Бейджи статуса: r10, 13/600 (§6.7) */}
            <div className="flex flex-wrap gap-2">
              <span
                className="rounded-[10px] px-3 py-1.5 text-[13px] font-semibold text-white"
                style={{
                  background: ad.statusOnOrder ? "#111111" : "#2196F3",
                }}
              >
                {ad.vehicleStatus}
              </span>
              {ad.isCustomsCleared !== undefined && (
                <span
                  className="rounded-[10px] px-3 py-1.5 text-[13px] font-semibold text-white"
                  style={{ background: ad.isCustomsCleared ? "#9C27B0" : "#F44336" }}
                >
                  {ad.isCustomsCleared ? "Растаможен" : "Не растаможен"}
                </span>
              )}
            </div>
          </section>

          {/* Характеристики */}
          <AdSpecsCardMobile specs={specs} />

          {/* Комплектация */}
          {ad.equipment && ad.equipment.length > 0 && (
            <section>
              <h2 className="mb-3 text-[17px] font-semibold text-foreground">
                Комплектация
              </h2>
              <div className="flex flex-col gap-2 rounded-2xl bg-card p-1">
                {ad.equipment.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-success"
                      strokeWidth={2}
                    />
                    <span className="text-[15px] text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Описание — свёрнуто до 4 строк, если длиннее 150 символов */}
          {ad.description && (
            <section>
              <h2 className="mb-3 text-[17px] font-semibold text-foreground">
                Описание
              </h2>
              <p
                className={`whitespace-pre-wrap text-[15px] leading-[22px] text-foreground ${
                  descExpanded ? "" : "line-clamp-4"
                }`}
              >
                {ad.description}
              </p>
              {ad.description.length > 150 && (
                <button
                  type="button"
                  onClick={() => setDescExpanded((v) => !v)}
                  className="mt-2 text-[15px] font-medium text-link"
                >
                  {descExpanded ? "Скрыть" : "Показать полностью"}
                </button>
              )}
            </section>
          )}

          {/* Продавец */}
          <section>
            <h2 className="mb-3 text-[17px] font-semibold text-foreground">Продавец</h2>
            <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary">
                <User className="size-6 text-muted-foreground" strokeWidth={1.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-1 mb-0.5 block text-[15px] font-semibold text-foreground">
                  {ad.sellerName || "Продавец"}
                </span>
                <span className="block text-[13px] text-muted-foreground">
                  {ad.sellerAdsCount} {declOfAds(ad.sellerAdsCount)}
                </span>
              </span>
              <span className="shrink-0 text-[13px] text-muted-foreground">
                {ad.sellerType === "dealer" ? "Автосалон" : "Частное лицо"}
              </span>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile Bottom CTA */}
      <AdActionBar phone={apiAd?.seller?.phone} adId={id} />

      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </div>
  );
}
