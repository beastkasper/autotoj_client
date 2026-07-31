"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Star,
  BadgeCheck,
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import {
  useGetServiceProviderByIdQuery,
  useGetProviderReviewsQuery,
} from "@/lib/features/services/servicesApi";

const DAY_LABELS: Record<string, string> = {
  monday: "Пн",
  tuesday: "Вт",
  wednesday: "Ср",
  thursday: "Чт",
  friday: "Пт",
  saturday: "Сб",
  sunday: "Вс",
};

export default function ServiceProviderPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [showAllHours, setShowAllHours] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);

  const { data: provider, isLoading } = useGetServiceProviderByIdQuery(id);
  const { data: reviewsData, isLoading: reviewsLoading } =
    useGetProviderReviewsQuery({ providerId: id, page: reviewsPage, limit: 10 });

  const reviews = reviewsData?.reviews ?? [];
  const averageRating = reviewsData?.average_rating ?? provider?.rating ?? 0;

  const handleCall = useCallback(() => {
    if (provider?.phone) {
      window.open(`tel:${provider.phone}`, "_self");
    }
  }, [provider?.phone]);

  const loadMoreReviews = useCallback(() => {
    if (reviewsData?.has_more) {
      setReviewsPage((p) => p + 1);
    }
  }, [reviewsData?.has_more]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E5E5E7] border-t-[#111111] rounded-full animate-spin" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center gap-4">
        <p className="text-[17px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
          Сервис не найден
        </p>
        <Button
          onClick={() => router.push("/services")}
          variant="outline"
          className="rounded-full"
        >
          К категориям
        </Button>
      </div>
    );
  }

  const workingHoursEntries = Object.entries(provider.working_hours ?? {});

  return (
    <div className="screen lg:min-h-screen lg:bg-[#F5F5F7]">
      {/* ── Mobile Header ── */}
      <PageHeader title={provider.name} />

      {/* ── Desktop Back Link ── */}
      <div className="hidden lg:block max-w-[1440px] mx-auto px-6 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-[15px] text-[#8E8E93] hover:text-[#111111] transition-colors font-[family-name:var(--font-manrope)]"
        >
          <ChevronLeft className="w-4 h-4" />
          Назад
        </button>
      </div>

      {/* ── Photos Gallery ── */}
      {provider.photos.length > 0 && (
        <div className="lg:max-w-[1440px] lg:mx-auto lg:px-6 lg:pt-4">
          <div className="flex gap-2 overflow-x-auto lg:overflow-hidden lg:grid lg:grid-cols-3 lg:gap-4 px-4 lg:px-0 pb-2 lg:pb-0 scrollbar-hide">
            {provider.photos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`${provider.name} ${i + 1}`}
                className="h-48 lg:h-64 w-72 lg:w-full rounded-2xl object-cover bg-[#F5F5F7] shrink-0"
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto lg:px-6 lg:py-6 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* ── Main Info ── */}
        <div className="lg:col-span-2 space-y-4 px-4 lg:px-0 py-4 lg:py-0">
          {/* Name + Rating */}
          <div className="rounded-2xl bg-card p-4 lg:p-5">
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] lg:text-[28px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
                {provider.name}
              </h1>
              {provider.is_verified && (
                <BadgeCheck className="w-6 h-6 text-[#007AFF] shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Star className="size-5 fill-star text-star" />
                <span className="text-[17px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-[15px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                {provider.reviews_count} отзывов
              </span>
            </div>

            {provider.description && (
              <p className="text-[15px] text-[#333] mt-4 leading-relaxed font-[family-name:var(--font-manrope)]">
                {provider.description}
              </p>
            )}
          </div>

          {/* Contact + Address */}
          <div className="space-y-3 rounded-2xl bg-card p-4 lg:p-5">
            {provider.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8E8E93] mt-0.5 shrink-0" />
                <p className="text-[15px] text-[#111111] font-[family-name:var(--font-manrope)]">
                  {provider.city}, {provider.address}
                </p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#8E8E93] shrink-0" />
              <a
                href={`tel:${provider.phone}`}
                className="text-[15px] text-[#007AFF] font-medium font-[family-name:var(--font-manrope)]"
              >
                {provider.phone}
              </a>
            </div>

            {/* Working Hours */}
            {workingHoursEntries.length > 0 && (
              <div>
                <button
                  onClick={() => setShowAllHours(!showAllHours)}
                  className="flex items-center gap-3 w-full"
                >
                  <Clock className="w-5 h-5 text-[#8E8E93] shrink-0" />
                  <span className="text-[15px] text-[#111111] font-medium font-[family-name:var(--font-manrope)]">
                    Режим работы
                  </span>
                  {showAllHours ? (
                    <ChevronUp className="w-4 h-4 text-[#8E8E93] ml-auto" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8E8E93] ml-auto" />
                  )}
                </button>
                {showAllHours && (
                  <div className="mt-3 ml-8 space-y-1.5">
                    {workingHoursEntries.map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                          {DAY_LABELS[day] ?? day}
                        </span>
                        <span className="text-[14px] text-[#111111] font-[family-name:var(--font-manrope)]">
                          {hours ?? "Выходной"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="rounded-2xl bg-card p-4 lg:p-5">
            <h2 className="text-[17px] font-bold text-[#111111] mb-4 font-[family-name:var(--font-manrope)]">
              Отзывы ({reviewsData?.total ?? provider.reviews_count})
            </h2>

            {reviewsLoading && reviews.length === 0 && (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-[#E5E5E7] border-t-[#111111] rounded-full animate-spin" />
              </div>
            )}

            {reviews.length > 0 && (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="pb-4 border-b border-[#F2F2F7] last:border-none last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      {review.user_avatar ? (
                        <img
                          src={review.user_avatar}
                          alt={review.user_name}
                          className="w-10 h-10 rounded-full object-cover bg-[#F5F5F7]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#F2F2F7] flex items-center justify-center">
                          <User className="w-5 h-5 text-[#C7C7CC]" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
                          {review.user_name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating
                                  ? "text-[#FF9500] fill-[#FF9500]"
                                  : "text-[#E5E5E7]"
                              }`}
                            />
                          ))}
                          <span className="text-[12px] text-[#8E8E93] ml-2 font-[family-name:var(--font-manrope)]">
                            {new Date(review.created_at).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[14px] text-[#333] mt-2 leading-relaxed font-[family-name:var(--font-manrope)]">
                      {review.comment}
                    </p>
                  </div>
                ))}

                {reviewsData?.has_more && (
                  <Button
                    onClick={loadMoreReviews}
                    variant="outline"
                    className="w-full rounded-xl text-[15px] font-medium font-[family-name:var(--font-manrope)]"
                  >
                    Показать ещё
                  </Button>
                )}
              </div>
            )}

            {!reviewsLoading && reviews.length === 0 && (
              <p className="text-[14px] text-[#8E8E93] text-center py-6 font-[family-name:var(--font-manrope)]">
                Пока нет отзывов
              </p>
            )}
          </div>
        </div>

        {/* ── Desktop Sidebar ── */}
        <div className="hidden lg:block">
          <div className="sticky top-[120px] space-y-4">
            {/* Call CTA */}
            <div className="rounded-2xl bg-card p-4 lg:p-5">
              <Button
                onClick={handleCall}
                className="w-full h-12 bg-[#34C759] hover:bg-[#2DB84D] text-white rounded-xl text-[17px] font-semibold font-[family-name:var(--font-manrope)]"
              >
                <Phone className="w-5 h-5 mr-2" />
                Позвонить
              </Button>
              <p className="text-[13px] text-[#8E8E93] text-center mt-2 font-[family-name:var(--font-manrope)]">
                {provider.phone}
              </p>
            </div>

            {/* Quick Info */}
            {provider.logo_url && (
              <div className="bg-white rounded-2xl p-5 flex items-center justify-center">
                <img
                  src={provider.logo_url}
                  alt={provider.name}
                  className="w-32 h-32 rounded-2xl object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Fixed Call Button ── */}
      <div className="blur-surface hairline-top fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-[440px] px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)] lg:hidden">
        {/* Кнопка «Позвонить»: h48 r24, обводка 2px (§10.6) */}
        <button
          type="button"
          onClick={handleCall}
          className="btn h-12 w-full rounded-[24px] border-2 border-foreground text-[15px] font-semibold text-foreground"
        >
          <Phone className="size-[18px]" strokeWidth={1.5} />
          Позвонить
        </button>
      </div>
    </div>
  );
}
