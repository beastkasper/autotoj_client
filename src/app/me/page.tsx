"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Package, BookOpen, ArrowLeft } from "lucide-react";
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
    <main className="screen lg:min-h-screen lg:bg-[#F5F5F7] lg:pb-12">
      {/* ── Header (mobile sticky) ── */}
      <div className="hairline sticky top-0 z-40 bg-card pt-[env(safe-area-inset-top)] lg:bg-white/90 lg:backdrop-blur-xl">
        <div className="flex h-14 items-center gap-2 px-4 lg:hidden">
          <button
            onClick={() => router.back()}
            aria-label="Назад"
            className="icon-btn -ml-2.5"
          >
            <ArrowLeft className="size-5" strokeWidth={1.5} />
          </button>
          <h1 className="text-[20px] font-semibold leading-[26px] text-foreground">
            {TABS.find((t) => t.key === activeTab)?.label}
          </h1>
        </div>

        <div className="hidden lg:block max-w-[1200px] mx-auto px-6 pt-6 pb-2">
          <h1 className="text-3xl font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
            Мои разделы
          </h1>
        </div>

        {/* ── Tab strip ── */}
        <div className="scroll-x flex gap-2 px-4 pb-3 lg:mx-auto lg:max-w-[1200px] lg:px-6 lg:pb-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                aria-pressed={isActive}
                className="chip shrink-0"
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-4 pt-4 lg:mx-auto lg:max-w-[1200px] lg:px-6">
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
      <ContentGrid mobileCols={2} desktopCols={4}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="skeleton aspect-[3/4] rounded-2xl"
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
    <ContentGrid mobileCols={2} desktopCols={4}>
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
      <div className="mb-4 flex gap-2">
        {(["active", "paused"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            aria-pressed={statusFilter === s}
            className="chip"
          >
            {s === "active" ? "Активные" : "На паузе"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="skeleton h-32 rounded-xl"
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
        <div className="flex flex-col gap-3">
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
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="skeleton h-40 rounded-xl"
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
    <div className="flex flex-col gap-3">
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
