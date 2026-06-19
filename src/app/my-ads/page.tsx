"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Package } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { MyAdCardDesktop } from "@/components/my-ads/my-ad-card-desktop";
import { MyAdCardMobile } from "@/components/my-ads/my-ad-card-mobile";
import { MyAdsTabs } from "@/components/my-ads/my-ads-tabs";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { usePagedParams } from "@/hooks/usePagedParams";
import {
  useGetMyAdsQuery,
  useArchiveAdMutation,
  useRestoreAdMutation,
  useDeleteMyAdMutation,
} from "@/lib/features/ads/adsApi";
import { ConfirmModal } from "@/components/layout/confirm-modal";

type AdStatus = "active" | "paused";

export default function MyAdsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdStatus>("active");
  const [mobileMenuId, setMobileMenuId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    type: "pause" | "publish";
    adId: string;
  } | null>(null);

  const baseParams = useMemo(() => ({ status: activeTab }), [activeTab]);
  const { params: queryParams, page, setPage } = usePagedParams(baseParams);
  const { data: apiData, isLoading, isFetching } = useGetMyAdsQuery(queryParams);
  const [archiveAd] = useArchiveAdMutation();
  const [restoreAd] = useRestoreAdMutation();
  const [deleteAd] = useDeleteMyAdMutation();

  const ads = useMemo(() => apiData?.ads ?? [], [apiData?.ads]);
  const isLoadingMore = isFetching && !isLoading;
  const hasMore = apiData?.has_more ?? false;

  const counts = useMemo(() => {
    const active = ads.length;
    return { active, paused: 0 };
  }, [ads]);

  const handleEdit = useCallback(
    (id: string) => router.push(`/post-ad?edit=${id}`),
    [router],
  );

  const handlePause = useCallback(
    (adId: string) => {
      archiveAd(adId);
      setConfirmModal(null);
      setMobileMenuId(null);
    },
    [archiveAd],
  );

  const handlePublish = useCallback(
    (adId: string) => {
      restoreAd(adId);
      setConfirmModal(null);
      setMobileMenuId(null);
    },
    [restoreAd],
  );

  const handleDelete = useCallback(
    (adId: string) => {
      deleteAd(adId);
    },
    [deleteAd],
  );

  const handleAdClick = useCallback(
    (id: string) => router.push(`/ad/${id}`),
    [router],
  );

  const handleMobileEdit = useCallback(
    (id: string) => {
      setMobileMenuId(null);
      router.push(`/post-ad?edit=${id}`);
    },
    [router],
  );

  const handleMobilePauseRequest = useCallback((id: string) => {
    setMobileMenuId(null);
    setConfirmModal({ type: "pause", adId: id });
  }, []);

  const handleMobilePublishRequest = useCallback((id: string) => {
    setMobileMenuId(null);
    setConfirmModal({ type: "publish", adId: id });
  }, []);

  // Suppress unused variable warning -- kept for future tab count display
  void counts;

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      {/* ══════════ DESKTOP ══════════ */}
      <div className="hidden lg:block">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
              Мои объявления
            </h1>
            <p className="text-[14px] text-[#8E8E93] mt-1 font-[family-name:var(--font-manrope)]">
              Управляйте своими объявлениями
            </p>
          </div>

          <MyAdsTabs activeTab={activeTab} onTabChange={setActiveTab} variant="desktop" />

          {/* Desktop Cards */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-[#E5E5E7] animate-pulse"
                >
                  <div className="flex gap-6">
                    <div className="w-64 h-48 bg-[#E5E5E7] rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-[#E5E5E7] rounded w-1/2" />
                      <div className="h-4 bg-[#E5E5E7] rounded w-1/3" />
                      <div className="h-8 bg-[#E5E5E7] rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : ads.length > 0 ? (
            <div className="space-y-4">
              {ads.map((ad) => (
                <MyAdCardDesktop
                  key={ad.id}
                  ad={ad}
                  activeTab={activeTab}
                  onEdit={handleEdit}
                  onPause={handlePause}
                  onPublish={handlePublish}
                  onDelete={handleDelete}
                  onClick={handleAdClick}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 bg-white rounded-2xl border border-[#E5E5E7]">
              <EmptyState
                icon={Package}
                title={activeTab === "active" ? "Нет объявлений" : "Пауза объявлений"}
                description={
                  activeTab === "active"
                    ? "Создайте новое объявление, чтобы начать продажу"
                    : "Здесь будут храниться объявления на паузе"
                }
                action={
                  activeTab === "active"
                    ? {
                        label: "Разместить объявление",
                        onClick: () => router.push("/post-ad"),
                      }
                    : undefined
                }
              />
            </div>
          )}

          {!isLoading && (
            <LoadMoreButton
              hasMore={hasMore}
              isLoading={isLoadingMore}
              onClick={() => setPage(page + 1)}
            />
          )}
        </div>
      </div>

      {/* ══════════ MOBILE ══════════ */}

      {/* Mobile Header (sticky) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E7]">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center -ml-2 hover:bg-[#F2F2F7] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#111111]" />
          </button>
          <h1 className="text-[17px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
            Мои объявления
          </h1>
        </div>

        <MyAdsTabs activeTab={activeTab} onTabChange={setActiveTab} variant="mobile" />
      </div>

      {/* Mobile + Tablet Cards */}
      <div className="lg:hidden px-4 md:px-6 py-4 pb-24 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden border border-[#E5E5E7] animate-pulse"
            >
              <div className="flex">
                <div className="w-32 h-32 bg-[#E5E5E7]" />
                <div className="flex-1 p-3 space-y-2">
                  <div className="h-4 bg-[#E5E5E7] rounded w-3/4" />
                  <div className="h-3 bg-[#E5E5E7] rounded w-1/2" />
                  <div className="h-5 bg-[#E5E5E7] rounded w-1/3" />
                </div>
              </div>
            </div>
          ))
        ) : ads.length > 0 ? (
          ads.map((ad) => (
            <MyAdCardMobile
              key={ad.id}
              ad={ad}
              activeTab={activeTab}
              isMenuOpen={mobileMenuId === ad.id}
              onMenuToggle={() =>
                setMobileMenuId(mobileMenuId === ad.id ? null : ad.id)
              }
              onEdit={handleMobileEdit}
              onPauseRequest={handleMobilePauseRequest}
              onPublishRequest={handleMobilePublishRequest}
              onClick={handleAdClick}
            />
          ))
        ) : (
          <div className="md:col-span-2">
            <EmptyState
              icon={Package}
              title={
                activeTab === "active"
                  ? "У вас пока нет активных объявлений"
                  : "Пауза объявлений"
              }
              description={
                activeTab === "active"
                  ? "Создайте новое объявление, чтобы начать продажу"
                  : "Здесь будут храниться объявления на паузе"
              }
              action={
                activeTab === "active"
                  ? {
                      label: "Разместить объявление",
                      onClick: () => router.push("/post-ad"),
                    }
                  : undefined
              }
            />
          </div>
        )}
        {!isLoading && (
          <div className="md:col-span-2">
            <LoadMoreButton
              hasMore={hasMore}
              isLoading={isLoadingMore}
              onClick={() => setPage(page + 1)}
            />
          </div>
        )}
      </div>

      {/* ── Mobile Confirm Modal ── */}
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.type === "pause" ? "Поставить на паузу?" : "Опубликовать объявление?"}
          description={confirmModal.type === "pause" ? "Объявление не будет видно другим пользователям" : "Объявление станет видно всем пользователям"}
          confirmLabel={confirmModal.type === "pause" ? "На паузу" : "Опубликовать"}
          onConfirm={() => confirmModal.type === "pause" ? handlePause(confirmModal.adId) : handlePublish(confirmModal.adId)}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </main>
  );
}
