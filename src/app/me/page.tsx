"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Package, BookOpen, ChevronLeft } from "lucide-react";
import { AdCard } from "@/components/cards/AdCard";
import { ContentGrid } from "@/components/layout/content-grid";
import { EmptyState } from "@/components/states/EmptyState";
import { MyAdCardMobile } from "@/components/my-ads/my-ad-card-mobile";
import { LogbookPostCard } from "@/components/logbook/logbook-post-card";
import { ConfirmModal } from "@/components/layout/confirm-modal";
import { useAuth } from "@/hooks/useAuth";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { mapAdListItemToAd } from "@/lib/utils/map-ad";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "@/lib/features/favorites/favoritesApi";
import {
  useGetMyAdsQuery,
  useArchiveAdMutation,
  useRestoreAdMutation,
} from "@/lib/features/ads/adsApi";
import { useGetLogbookPostsQuery } from "@/lib/features/logbook/logbookApi";

type TabKey = "favorites" | "ads" | "logbook";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "favorites", label: "Избранное", icon: Heart },
  { key: "ads", label: "Мои объявления", icon: Package },
  { key: "logbook", label: "Бортжурнал", icon: BookOpen },
];

export default function MePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabKey) ?? "favorites";
  const [activeTab, setActiveTab] = useState<TabKey>(
    TABS.some((t) => t.key === initialTab) ? initialTab : "favorites",
  );
  const { isAuthenticated, showAuthModal, closeAuthModal } = useAuth();
  const [confirmModal, setConfirmModal] = useState<{
    type: "pause" | "publish";
    adId: string;
  } | null>(null);
  const [mobileMenuId, setMobileMenuId] = useState<string | null>(null);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/me?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#F5F5F7] pb-24 lg:pb-12">
      {/* ── Header (mobile sticky) ── */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E7]">
        <div className="lg:hidden flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => router.back()}
            aria-label="Назад"
            className="w-10 h-10 rounded-full flex items-center justify-center -ml-2 hover:bg-[#F2F2F7] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#111111]" />
          </button>
          <h1 className="text-[17px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
            {TABS.find((t) => t.key === activeTab)?.label}
          </h1>
        </div>

        <div className="hidden lg:block max-w-[1200px] mx-auto px-6 pt-6 pb-2">
          <h1 className="text-3xl font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
            Мои разделы
          </h1>
        </div>

        {/* ── Tab strip ── */}
        <div className="flex gap-2 overflow-x-auto px-4 md:px-6 lg:max-w-[1200px] lg:mx-auto pb-3 lg:pb-4 scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                aria-pressed={isActive}
                className={`shrink-0 flex items-center gap-1.5 h-10 px-4 rounded-full text-[14px] font-medium font-[family-name:var(--font-manrope)] transition-colors ${
                  isActive
                    ? "bg-[#111111] text-white"
                    : "bg-white border border-[#E5E5E7] text-[#111111]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-4 md:px-6 pt-4 lg:max-w-[1200px] lg:mx-auto">
        {activeTab === "favorites" && (
          <FavoritesTab onAdClick={(id) => router.push(`/ad/${id}`)} />
        )}
        {activeTab === "ads" && (
          <MyAdsTab
            isAuthenticated={isAuthenticated}
            mobileMenuId={mobileMenuId}
            setMobileMenuId={setMobileMenuId}
            confirmModal={confirmModal}
            setConfirmModal={setConfirmModal}
            onAdClick={(id) => router.push(`/ad/${id}`)}
            onEdit={(id) => router.push(`/post-ad?edit=${id}`)}
          />
        )}
        {activeTab === "logbook" && (
          <LogbookTab onPostClick={(id) => router.push(`/logbook/${id}`)} />
        )}
      </div>

      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* Favorites Tab                                                        */
/* ──────────────────────────────────────────────────────────────────── */

function FavoritesTab({ onAdClick }: { onAdClick: (id: string) => void }) {
  const router = useRouter();
  const { data: apiData, isLoading } = useGetFavoritesQuery();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const favorites = apiData?.ads.map(mapAdListItemToAd) ?? [];

  const handleToggle = useCallback(
    (id: string) => {
      removeFavorite(id);
    },
    [removeFavorite],
  );

  if (isLoading) {
    return (
      <ContentGrid mobileCols={2} tabletCols={3} desktopCols={4}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#E5E5E7] aspect-[3/4] animate-pulse"
          />
        ))}
      </ContentGrid>
    );
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Нет избранных объявлений"
        description="Добавляйте объявления в избранное, чтобы не потерять их"
        action={{ label: "К объявлениям", onClick: () => router.push("/") }}
      />
    );
  }

  return (
    <ContentGrid mobileCols={2} tabletCols={3} desktopCols={4}>
      {favorites.map((ad) => (
        <AdCard
          key={ad.id}
          ad={ad}
          variant="grid"
          onFavoriteToggle={handleToggle}
          onClick={onAdClick}
        />
      ))}
    </ContentGrid>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* My Ads Tab                                                           */
/* ──────────────────────────────────────────────────────────────────── */

interface MyAdsTabProps {
  isAuthenticated: boolean;
  mobileMenuId: string | null;
  setMobileMenuId: (id: string | null) => void;
  confirmModal: { type: "pause" | "publish"; adId: string } | null;
  setConfirmModal: (
    m: { type: "pause" | "publish"; adId: string } | null,
  ) => void;
  onAdClick: (id: string) => void;
  onEdit: (id: string) => void;
}

function MyAdsTab({
  isAuthenticated,
  mobileMenuId,
  setMobileMenuId,
  confirmModal,
  setConfirmModal,
  onAdClick,
  onEdit,
}: MyAdsTabProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<"active" | "paused">("active");
  const { data: apiData, isLoading } = useGetMyAdsQuery(
    { status: statusFilter },
    { skip: !isAuthenticated },
  );
  const [archiveAd] = useArchiveAdMutation();
  const [restoreAd] = useRestoreAdMutation();
  const ads = useMemo(() => apiData?.ads ?? [], [apiData?.ads]);

  if (!isAuthenticated) {
    return (
      <EmptyState
        icon={Package}
        title="Войдите в аккаунт"
        description="Здесь будут отображаться ваши объявления"
        action={{ label: "Войти", onClick: () => router.push("/login") }}
      />
    );
  }

  const handlePause = (id: string) => {
    archiveAd(id);
    setConfirmModal(null);
    setMobileMenuId(null);
  };
  const handlePublish = (id: string) => {
    restoreAd(id);
    setConfirmModal(null);
    setMobileMenuId(null);
  };

  return (
    <>
      {/* Sub-filter for active/paused */}
      <div className="flex gap-2 mb-4">
        {(["active", "paused"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`h-9 px-4 rounded-full text-[13px] font-medium transition-colors font-[family-name:var(--font-manrope)] ${
              statusFilter === s
                ? "bg-[#111111] text-white"
                : "bg-white border border-[#E5E5E7] text-[#111111]"
            }`}
          >
            {s === "active" ? "Активные" : "На паузе"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#E5E5E7] h-32 animate-pulse"
            />
          ))}
        </div>
      ) : ads.length === 0 ? (
        <EmptyState
          icon={Package}
          title={
            statusFilter === "active"
              ? "У вас пока нет активных объявлений"
              : "Нет объявлений на паузе"
          }
          description={
            statusFilter === "active"
              ? "Создайте новое объявление, чтобы начать продажу"
              : "Здесь будут храниться объявления на паузе"
          }
          action={
            statusFilter === "active"
              ? {
                  label: "Разместить объявление",
                  onClick: () => router.push("/post-ad"),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {ads.map((ad) => (
            <MyAdCardMobile
              key={ad.id}
              ad={ad}
              activeTab={statusFilter}
              isMenuOpen={mobileMenuId === ad.id}
              onMenuToggle={() =>
                setMobileMenuId(mobileMenuId === ad.id ? null : ad.id)
              }
              onEdit={(id) => {
                setMobileMenuId(null);
                onEdit(id);
              }}
              onPauseRequest={(id) => {
                setMobileMenuId(null);
                setConfirmModal({ type: "pause", adId: id });
              }}
              onPublishRequest={(id) => {
                setMobileMenuId(null);
                setConfirmModal({ type: "publish", adId: id });
              }}
              onClick={onAdClick}
            />
          ))}
        </div>
      )}

      {confirmModal && (
        <ConfirmModal
          title={
            confirmModal.type === "pause"
              ? "Поставить на паузу?"
              : "Опубликовать объявление?"
          }
          description={
            confirmModal.type === "pause"
              ? "Объявление не будет видно другим пользователям"
              : "Объявление станет видно всем пользователям"
          }
          confirmLabel={confirmModal.type === "pause" ? "На паузу" : "Опубликовать"}
          onConfirm={() =>
            confirmModal.type === "pause"
              ? handlePause(confirmModal.adId)
              : handlePublish(confirmModal.adId)
          }
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* Logbook Tab                                                          */
/* ──────────────────────────────────────────────────────────────────── */

function LogbookTab({ onPostClick }: { onPostClick: (id: string) => void }) {
  const router = useRouter();
  const { data, isLoading } = useGetLogbookPostsQuery();
  const posts = data?.posts ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-[#E5E5E7] h-40 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Нет записей"
        description="Здесь будут отображаться записи бортжурнала"
        action={{
          label: "Создать запись",
          onClick: () => router.push("/logbook/create"),
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      {posts.map((post) => (
        <LogbookPostCard
          key={post.id}
          post={post}
          variant="mobile"
          onClick={onPostClick}
        />
      ))}
    </div>
  );
}
