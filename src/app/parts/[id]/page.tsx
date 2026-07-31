"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
  X,
  Heart,
  ArrowLeft,
  MapPin,
  Phone,
  MessageCircle,
  Upload,
  Tag,
  Wrench,
  Factory,
  Hash,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageGallery } from "@/components/ad/ImageGallery";
import { AdSpecsTable } from "@/components/ad/AdSpecsTable";
import { AdActionBar } from "@/components/ad/AdActionBar";
import { AdGalleryMobile } from "@/components/ad/AdGalleryMobile";
import { PartCard } from "@/components/cards/PartCard";
import { useGetPartByIdQuery } from "@/lib/features/parts/partsApi";
import type { PartListing } from "@/lib/types/part";
import { formatFullDateWithCity } from "@/lib/utils/dateFormat";
import { useAuth } from "@/hooks/useAuth";
import { useOpenChat } from "@/hooks/useOpenChat";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { DetailPageSkeleton } from "@/components/skeletons/detail-page-skeleton";

export default function PartDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idStr = params.id as string;

  const { data: apiPart, isLoading } = useGetPartByIdQuery(idStr);

  const part = useMemo(() => {
    if (!apiPart) return null;
    return {
      id: apiPart.id || idStr,
      title: apiPart.title ?? `${apiPart.brand ?? ""} ${apiPart.model ?? ""}`.trim(),
      price: String(apiPart.price),
      condition: apiPart.condition === "new" ? "Новый" as const : "Б/у" as const,
      image: apiPart.photos[0] ?? "",
      images: apiPart.photos,
      city: apiPart.contact_city,
      category: apiPart.part_type,
      publishedDate: apiPart.published_at ?? apiPart.created_at,
      description: apiPart.description ?? undefined,
      sellerName: apiPart.seller?.name ?? undefined,
      manufacturer: apiPart.brand ?? undefined,
      compatibility: undefined,
      partNumber: undefined,
    };
  }, [apiPart, idStr]);

  const similarParts: PartListing[] = [];
  const [isFavorite, setIsFavorite] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const { requireAuth, showAuthModal, closeAuthModal } = useAuth();
  const { openChat, isOpening } = useOpenChat();

  const specs = useMemo(() => {
    if (!part) return [];
    const result: { icon: typeof Tag; label: string; value: string }[] = [];
    if (part.condition) result.push({ icon: Shield, label: "Состояние", value: part.condition });
    if (part.category) result.push({ icon: Tag, label: "Категория", value: part.category });
    if (part.manufacturer) result.push({ icon: Factory, label: "Производитель", value: part.manufacturer });
    if (part.compatibility) result.push({ icon: Wrench, label: "Совместимость", value: part.compatibility });
    if (part.partNumber) result.push({ icon: Hash, label: "Артикул", value: part.partNumber });
    return result;
  }, [part]);

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!part) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[18px] font-semibold text-[#111111] mb-2 font-[family-name:var(--font-manrope)]">
            Запчасть не найдена
          </p>
          <p className="text-[14px] text-[#8E8E93] mb-6 font-[family-name:var(--font-manrope)]">
            Возможно, объявление было удалено или ссылка устарела.
          </p>
          <Button
            onClick={() => router.push("/parts")}
            className="px-6 py-3 bg-[#111111] text-white rounded-2xl text-[14px] font-medium hover:bg-[#333]"
          >
            Вернуться к запчастям
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: part.title, url: window.location.href });
    }
  };

  return (
    <div className="screen relative lg:min-h-screen lg:bg-[#F5F5F7]">
      {apiPart && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: apiPart.title ?? `${apiPart.brand ?? ""} ${apiPart.model ?? ""}`.trim(),
              image: apiPart.photos,
              offers: {
                "@type": "Offer",
                price: apiPart.price,
                priceCurrency: apiPart.currency || "TJS",
                availability: "https://schema.org/InStock",
              },
              itemCondition: apiPart.condition === "new"
                ? "https://schema.org/NewCondition"
                : "https://schema.org/UsedCondition",
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
              <ImageGallery
                images={part.images ?? [part.image]}
                alt={part.title}
              />

              {/* Specs */}
              <AdSpecsTable specs={specs} title="Характеристики" />

              {/* Description */}
              {part.description && (
                <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
                  <CardContent className="p-6">
                    <h2 className="text-[16px] font-semibold text-[#111111] mb-3 font-[family-name:var(--font-manrope)]">
                      Описание
                    </h2>
                    <p className="text-[14px] text-[#333] leading-relaxed font-[family-name:var(--font-manrope)]">
                      {part.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Similar listings */}
              {similarParts.length > 0 && (
                <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
                  <CardContent className="p-6">
                    <h2 className="text-[16px] font-semibold text-[#111111] mb-4 font-[family-name:var(--font-manrope)]">
                      Похожие объявления
                    </h2>
                    <div className="grid grid-cols-4 gap-3">
                      {similarParts.map((p) => (
                        <PartCard
                          key={p.id}
                          part={p}
                          onClick={(pId) => router.push(`/parts/${pId}`)}
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
                  <h1 className="text-[20px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
                    {part.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      className={`px-3 py-1 text-[13px] font-medium font-[family-name:var(--font-manrope)] ${
                        part.condition === "Новый"
                          ? "bg-[#2E7D32] text-white border-transparent hover:bg-[#2E7D32]"
                          : "bg-[#F5F5F7] text-[#111111] border-transparent hover:bg-[#F5F5F7]"
                      }`}
                    >
                      {part.condition}
                    </Badge>
                    {part.category && (
                      <Badge className="px-3 py-1 text-[13px] font-medium bg-[#F5F5F7] text-[#8E8E93] border-transparent hover:bg-[#F5F5F7] font-[family-name:var(--font-manrope)]">
                        {part.category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[28px] font-bold text-[#111111] mt-4 font-[family-name:var(--font-manrope)]">
                    {part.price}{" "}
                    <span className="text-[16px] font-medium text-[#8E8E93]">сомони</span>
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{formatFullDateWithCity(part.publishedDate, part.city)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Card */}
              <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
                <CardContent className="p-5">
                  <p className="text-[14px] font-semibold text-[#111111] mb-3 font-[family-name:var(--font-manrope)]">
                    Продавец
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-[#F2F2F7]">
                        <User className="w-5 h-5 text-[#8E8E93]" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[14px] font-medium text-[#111111] font-[family-name:var(--font-manrope)]">
                        {part.sellerName || "Продавец"}
                      </p>
                      <p className="text-[12px] text-[#8E8E93] mt-0.5 font-[family-name:var(--font-manrope)]">
                        <MapPin className="w-3 h-3 inline mr-0.5" />
                        {part.city}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => requireAuth(() => {
                    const phone = apiPart?.contact_phone || apiPart?.seller?.phone;
                    if (phone) {
                      window.location.href = `tel:${phone}`;
                    }
                  })}
                  className="w-full h-[52px] bg-[#111111] text-white rounded-2xl text-[15px] font-semibold hover:bg-[#333] font-[family-name:var(--font-manrope)]"
                >
                  <Phone className="w-[18px] h-[18px]" />
                  Позвонить
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openChat(idStr)}
                  disabled={isOpening}
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

      {/* ── Шапка поверх галереи (§10.7) ── */}
      <div className="blur-surface absolute inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Назад"
            className="icon-btn -ml-2.5"
          >
            <ArrowLeft className="size-5" strokeWidth={1.5} />
          </button>
          <div className="flex items-center">
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
              onClick={() => setIsFavorite(!isFavorite)}
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
        </div>
      </div>

      {/* ── Контент: фон #F8F8F8, карточки белые (§10.7) ── */}
      <div className="bg-[#F8F8F8] pb-[160px] dark:bg-background lg:hidden">
        <AdGalleryMobile images={part.images ?? [part.image]} alt={part.title} />

        <div className="flex flex-col gap-3 p-4">
          {/* Карточка информации: r20 p20 */}
          <div className="rounded-[20px] bg-card p-5 shadow-[var(--shadow-hairline)]">
            <h1 className="mb-3 text-[22px] font-bold leading-7 text-foreground">
              {part.title}
            </h1>
            <div className="mb-3 rounded-2xl bg-[#F8F8F8] p-4 dark:bg-secondary">
              <p className="mb-1 text-[13px] text-muted-foreground">Цена</p>
              <p className="text-[28px] font-bold leading-8 text-foreground">
                {part.price}{" "}
                <span className="text-[18px] font-normal text-muted-foreground">
                  сомони
                </span>
              </p>
            </div>
            <p className="text-[13px] text-muted-foreground">
              {formatFullDateWithCity(part.publishedDate, part.city)}
            </p>
          </div>

          {/* Карточка характеристик */}
          {specs.length > 0 && (
            <div className="rounded-[20px] bg-card p-5 shadow-[var(--shadow-hairline)]">
              <h2 className="mb-4 text-[18px] font-bold text-foreground">
                Характеристики
              </h2>
              <div>
                {specs
                  .filter((spec) => spec.label !== "Состояние")
                  .map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-[15px] text-muted-foreground">
                        {spec.label}
                      </span>
                      <span className="text-[15px] font-semibold text-foreground">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                <div className="flex items-center justify-between py-2">
                  <span className="text-[15px] text-muted-foreground">Состояние</span>
                  <span
                    className="rounded-[10px] px-3 py-1.5 text-[14px] font-semibold text-white"
                    style={{
                      background: part.condition === "Новый" ? "#34C759" : "#FF9500",
                    }}
                  >
                    {part.condition}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Описание */}
          {part.description && (
            <div className="rounded-[20px] bg-card p-5 shadow-[var(--shadow-hairline)]">
              <h2 className="mb-3 text-[18px] font-bold text-foreground">Описание</h2>
              <p
                className={`whitespace-pre-wrap text-[15px] leading-[22px] text-foreground ${
                  descExpanded ? "" : "line-clamp-4"
                }`}
              >
                {part.description}
              </p>
              {part.description.length > 150 && (
                <button
                  type="button"
                  onClick={() => setDescExpanded((v) => !v)}
                  className="mt-2 flex items-center gap-1 text-[15px] font-semibold text-link"
                >
                  {descExpanded ? "Скрыть" : "Показать полностью"}
                </button>
              )}
            </div>
          )}

          {/* Продавец */}
          <div className="rounded-[20px] bg-card p-5 shadow-[var(--shadow-hairline)]">
            <h2 className="mb-3 text-[18px] font-bold text-foreground">Продавец</h2>
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary">
                <User className="size-6 text-muted-foreground" strokeWidth={1.5} />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-foreground">
                  {part.sellerName || "Продавец"}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[13px] text-muted-foreground">
                  <MapPin className="size-3.5" strokeWidth={1.5} />
                  {part.city}
                </span>
              </span>
            </div>
          </div>

          {/* Похожие */}
          {similarParts.length > 0 && (
            <section className="mt-1">
              <h2 className="mb-3 text-[18px] font-bold text-foreground">
                Похожие объявления
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {similarParts.map((p) => (
                  <PartCard
                    key={p.id}
                    part={p}
                    onClick={(pId) => router.push(`/parts/${pId}`)}
                    variant="mobile"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Mobile Bottom CTA */}
      <AdActionBar phone={apiPart?.contact_phone || apiPart?.seller?.phone} adId={idStr} />

      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </div>
  );
}
