"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  X,
  Share2,
  MapPin,
  Eye,
  Phone,
  MessageCircle,
  Upload,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdActionBar } from "@/components/ad/AdActionBar";
import { SellerCard } from "@/components/ad/SellerCard";
import { PlateNumber } from "@/components/plates/PlateNumber";
import { useGetPlateByIdQuery } from "@/lib/features/plates/platesApi";
import { PLATE_CATEGORY_LABELS, PLATE_REGION_LABELS } from "@/lib/types/plate";
import { formatPrice } from "@/lib/utils/formatPrice";
import { formatFullDateWithCity } from "@/lib/utils/dateFormat";
import { useAuth } from "@/hooks/useAuth";
import { useOpenChat } from "@/hooks/useOpenChat";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { DetailPageSkeleton } from "@/components/skeletons/detail-page-skeleton";

export default function PlateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idStr = params.id as string;

  // RTK Query — fetch from backend
  const { data: apiPlate, isLoading } = useGetPlateByIdQuery(idStr);

  const plate = useMemo(() => {
    if (!apiPlate) return null;
    return {
      id: apiPlate.id || idStr,
      plateNumber: apiPlate.plate_number,
      category: PLATE_CATEGORY_LABELS[apiPlate.category] ?? apiPlate.category,
      region: PLATE_REGION_LABELS[apiPlate.region_code] ?? apiPlate.region,
      price: apiPlate.price,
      negotiable: apiPlate.negotiable,
      views: apiPlate.views_count,
      publishedDate: apiPlate.published_at ?? apiPlate.created_at,
      description: apiPlate.description ?? undefined,
      sellerName: apiPlate.seller?.name ?? apiPlate.contact_name,
      sellerAdsCount: apiPlate.seller?.ads_count,
    };
  }, [apiPlate, idStr]);

  // Избранное для гос. номеров бэкенд не поддерживает: POST /favorites/:id
  // отвечает 404. Кнопка убрана, чтобы не изображать работающую функцию.
  const { requireAuth, showAuthModal, closeAuthModal } = useAuth();
  const { openChat, isOpening } = useOpenChat();

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!plate) {
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
            onClick={() => router.push("/plates")}
            className="px-6 py-3 bg-[#111111] text-white rounded-2xl text-[14px] font-medium hover:bg-[#333]"
          >
            Вернуться к номерам
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: plate.plateNumber, url: window.location.href });
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
          </div>
        </div>
      </div>

      {/* ── Desktop Two-Column Layout ── */}
      <div className="hidden lg:block">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="grid grid-cols-[1fr_380px] gap-8 items-start">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Plate hero */}
              <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
                <CardContent className="flex flex-col items-center gap-4 p-10">
                  <PlateNumber plateNumber={plate.plateNumber} size="lg" />
                  <div className="flex items-center gap-2 text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                    <span className="rounded-full bg-[#F2F2F7] px-3 py-1 font-medium text-[#111111]">
                      {plate.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {plate.region}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {plate.description && (
                <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
                  <CardContent className="p-6">
                    <h2 className="text-[16px] font-semibold text-[#111111] mb-3 font-[family-name:var(--font-manrope)]">
                      Описание
                    </h2>
                    <p className="text-[14px] text-[#333] leading-relaxed font-[family-name:var(--font-manrope)]">
                      {plate.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column — Sticky */}
            <div className="sticky top-28 space-y-4">
              {/* Price Card */}
              <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
                <CardContent className="p-6">
                  <p className="text-[28px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
                    {formatPrice(plate.price)}{" "}
                    <span className="text-[16px] font-medium text-[#8E8E93]">сомони</span>
                  </p>
                  {plate.negotiable && (
                    <p className="text-[13px] text-[#8E8E93] mt-1 font-[family-name:var(--font-manrope)]">
                      Торг уместен
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {plate.views}
                    </span>
                    <span>{formatFullDateWithCity(plate.publishedDate, plate.region)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Card */}
              <SellerCard
                sellerName={plate.sellerName}
                sellerType="private"
                sellerAdsCount={plate.sellerAdsCount}
                publishedDate={plate.publishedDate}
              />

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => requireAuth(() => {
                    if (apiPlate?.contact_phone) {
                      window.location.href = `tel:${apiPlate.contact_phone}`;
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
          </div>
        </div>
      </div>

      {/* ── Mobile + Tablet Content ── */}
      <div className="lg:hidden pb-[160px] md:pb-[176px] md:max-w-3xl md:mx-auto">
        {/* Plate hero */}
        <div className="px-4 pt-5">
          <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <PlateNumber plateNumber={plate.plateNumber} size="lg" />
              <div className="flex items-center gap-2 text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                <span className="rounded-full bg-[#F2F2F7] px-3 py-1 font-medium text-[#111111]">
                  {plate.category}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {plate.region}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price */}
        <div className="px-4 mt-5">
          <p className="text-[22px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
            {formatPrice(plate.price)}{" "}
            <span className="text-[14px] font-medium text-[#8E8E93]">сомони</span>
          </p>
          {plate.negotiable && (
            <p className="text-[13px] text-[#8E8E93] mt-1 font-[family-name:var(--font-manrope)]">
              Торг уместен
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-[13px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {plate.views}
            </span>
            <span>{formatFullDateWithCity(plate.publishedDate, plate.region)}</span>
          </div>
        </div>

        {/* Seller */}
        <div className="px-4 mt-5">
          <SellerCard
            sellerName={plate.sellerName}
            sellerType="private"
            sellerAdsCount={plate.sellerAdsCount}
            publishedDate={plate.publishedDate}
          />
        </div>

        {/* Description */}
        {plate.description && (
          <div className="px-4 mt-5">
            <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
              <CardContent className="p-4">
                <h2 className="text-[16px] font-semibold text-[#111111] mb-2 font-[family-name:var(--font-manrope)]">
                  Описание
                </h2>
                <p className="text-[14px] text-[#333] leading-relaxed font-[family-name:var(--font-manrope)]">
                  {plate.description}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Mobile Bottom CTA */}
      <AdActionBar phone={apiPlate?.contact_phone} adId={idStr} />

      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </div>
  );
}
