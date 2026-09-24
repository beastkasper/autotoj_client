"use client";

import { RequireAuth } from "@/components/auth/require-auth";
import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { SkeletonGrid } from "@/components/layout/skeleton-grid";
import { MyAdCardDesktop } from "@/components/my-ads/my-ad-card-desktop";
import { MyAdCardMobile } from "@/components/my-ads/my-ad-card-mobile";
import { MyAdsTabs, type MyAdsTab } from "@/components/my-ads/my-ads-tabs";
import { MyRentalsList } from "@/components/my-ads/my-rentals-list";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { usePagedParams } from "@/hooks/usePagedParams";
import {
  useGetMyAdsQuery,
  useArchiveAdMutation,
  useRestoreAdMutation,
  useDeleteMyAdMutation,
} from "@/lib/features/ads/adsApi";
import { ConfirmModal } from "@/components/layout/confirm-modal";

// Бэкенд знает статусы active/moderation/draft/archived/rejected (INTEGRATION.md §6.1).
// Раньше вкладка «На паузе» запрашивала несуществующий status=paused и всегда
// приходила пустой, а заархивированное объявление пропадало из интерфейса совсем.
type AdTab = MyAdsTab;

function MyAdsPageContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdTab>("active");
  const [mobileMenuId, setMobileMenuId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    type: "pause" | "publish" | "delete";
    adId: string;
  } | null>(null);

  const isRentalTab = activeTab === "rental";
  const baseParams = useMemo(
    () => ({ status: isRentalTab ? "active" : activeTab }),
    [activeTab, isRentalTab],
  );
  const { params: queryParams, page, setPage } = usePagedParams(baseParams);
  const { data: apiData, isLoading, isFetching, error, refetch } = useGetMyAdsQuery(
    queryParams,
    { skip: isRentalTab },
  );
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

  // Удаление необратимо, поэтому спрашиваем подтверждение — как у паузы и публикации.
  const handleDeleteRequest = useCallback((adId: string) => {
    setMobileMenuId(null);
    setConfirmModal({ type: "delete", adId });
  }, []);

  const handleDelete = useCallback(
    (adId: string) => {
      deleteAd(adId);
      setConfirmModal(null);
      setMobileMenuId(null);
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
    <main className="screen lg:min-h-screen lg:bg-[#F5F5F7]">
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
          {isRentalTab ? (
            <MyRentalsList />
          ) : isLoading ? (
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
          ) : error ? (
            <ErrorState
              type="error"
              title="Не удалось загрузить объявления"
              description={getApiErrorMessage(error)}
              onRetry={() => refetch()}
            />
          ) : ads.length > 0 ? (
            <div className="space-y-4">
              {ads.map((ad) => (
                <MyAdCardDesktop
                  key={ad.id}
                  ad={ad}
                  activeTab={activeTab === "archived" ? "archived" : "active"}
                  onEdit={handleEdit}
                  onPause={handlePause}
                  onPublish={handlePublish}
                  onDelete={handleDeleteRequest}
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

      {/* Шапка (§10.16): «Мои объявления» 20/600 + табы */}
      <div className="hairline sticky top-0 z-40 bg-card pt-[env(safe-area-inset-top)] lg:hidden">
        <div className="flex items-center gap-2 p-4">
          <button
            onClick={() => router.back()}
            aria-label="Назад"
            className="icon-btn -ml-2.5"
          >
            <ArrowLeft className="size-5" strokeWidth={1.5} />
          </button>
          <h1 className="text-[20px] font-semibold leading-[26px] text-foreground">
            Мои объявления
          </h1>
        </div>

        <MyAdsTabs activeTab={activeTab} onTabChange={setActiveTab} variant="mobile" />
      </div>

      {/* Список: padding 16, gap 12 */}
      <div className="flex flex-col gap-3 p-4 lg:hidden">
        {isRentalTab ? (
          <MyRentalsList />
        ) : isLoading ? (
          <SkeletonGrid count={4} variant="list" />
        ) : error ? (
          <ErrorState
            type="error"
            title="Не удалось загрузить объявления"
            description={getApiErrorMessage(error)}
            onRetry={() => refetch()}
          />
        ) : ads.length > 0 ? (
          ads.map((ad) => (
            <MyAdCardMobile
              key={ad.id}
              ad={ad}
              activeTab={activeTab === "archived" ? "archived" : "active"}
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
        )}
        {!isLoading && (
          <LoadMoreButton
            hasMore={hasMore}
            isLoading={isLoadingMore}
            onClick={() => setPage(page + 1)}
          />
        )}
      </div>

      {/* ── Mobile Confirm Modal ── */}
      {confirmModal && (
        <ConfirmModal
          title={
            confirmModal.type === "delete"
              ? "Удалить объявление?"
              : confirmModal.type === "pause"
                ? "Поставить на паузу?"
                : "Опубликовать объявление?"
          }
          description={
            confirmModal.type === "delete"
              ? "Объявление будет удалено безвозвратно. Отменить это действие нельзя."
              : confirmModal.type === "pause"
                ? "Объявление не будет видно другим пользователям"
                : "Объявление станет видно всем пользователям"
          }
          confirmLabel={
            confirmModal.type === "delete"
              ? "Удалить"
              : confirmModal.type === "pause"
                ? "На паузу"
                : "Опубликовать"
          }
          destructive={confirmModal.type === "delete"}
          onConfirm={() => {
            if (confirmModal.type === "delete") handleDelete(confirmModal.adId);
            else if (confirmModal.type === "pause") handlePause(confirmModal.adId);
            else handlePublish(confirmModal.adId);
          }}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </main>
  );
}

export default function MyAdsPage() {
  return (
    <RequireAuth description="Здесь собраны объявления вашего аккаунта">
      <MyAdsPageContent />
    </RequireAuth>
  );
}
