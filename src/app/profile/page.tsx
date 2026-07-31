"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Edit2,
  User,
  Package,
  Heart,
  BookOpen,
  Globe,
  Palette,
  Bell,
  Smartphone,
  FileText,
  Lock,
  Star,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGetProfileQuery } from "@/lib/features/profile/profileApi";
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton";
import { LegalModal } from "@/components/login/legal-modal";
import { PageHeader } from "@/components/layout/page-header";
import { ThemeSheet } from "@/components/settings/theme-sheet";
import { LanguageSheet } from "@/components/settings/language-sheet";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [legal, setLegal] = useState<"terms" | "privacy" | null>(null);
  const [sheet, setSheet] = useState<"theme" | "language" | null>(null);

  if (isAuthenticated && isLoading) {
    return <ProfileSkeleton />;
  }

  /** Карточки-иконки (§13.6): у гостя ведут на экран входа. */
  const quickActions = [
    { key: "ads", label: "Мои объявления", icon: Package, href: "/my-ads" },
    { key: "favorites", label: "Избранное", icon: Heart, href: "/favorites" },
    { key: "logbook", label: "Бортжурнал", icon: BookOpen, href: "/logbook" },
  ];

  const settings = [
    { key: "language", label: "Язык", icon: Globe, onClick: () => setSheet("language") },
    { key: "theme", label: "Тема оформления", icon: Palette, onClick: () => setSheet("theme") },
    { key: "notifications", label: "Настройки уведомлений", icon: Bell, onClick: undefined },
    { key: "about", label: "О приложении", icon: Smartphone, onClick: undefined },
    { key: "terms", label: "Условия соглашения", icon: FileText, onClick: () => setLegal("terms") },
    { key: "privacy", label: "Политика конфиденциальности", icon: Lock, onClick: () => setLegal("privacy") },
    { key: "rules", label: "Правила рекомендаций", icon: Star, onClick: undefined },
    { key: "faq", label: "Часто задаваемые вопросы", icon: HelpCircle, onClick: undefined },
  ];

  const openOrLogin = (href: string) => {
    router.push(isAuthenticated ? href : "/login");
  };

  return (
    <>
      <main className="screen bg-card lg:min-h-screen lg:bg-[#FAFAFA]">
        <PageHeader title="Профиль" variant="center" />

        <div className="mx-auto w-full px-4 pt-4 lg:max-w-2xl lg:pt-10">
          <h1 className="hidden text-[28px] font-bold text-foreground lg:mb-6 lg:block">
            Профиль
          </h1>

          {isAuthenticated ? (
            /* Карточка профиля: r16 p16, border 1px, аватар 40 (§10.13) */
            <button
              onClick={() => router.push("/profile/edit")}
              className="press-card flex w-full items-center gap-3 rounded-2xl border border-border-soft bg-card p-4 text-left transition-transform"
            >
              <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.name ?? "Аватар"}
                    width={40}
                    height={40}
                    className="size-full object-cover"
                  />
                ) : (
                  <User className="size-5 text-muted-foreground" strokeWidth={1.5} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-1 block text-[16px] font-bold text-foreground">
                  {profile?.name || "Профиль"}
                </span>
                <span className="line-1 block text-[13px] text-muted-foreground">
                  {profile?.phone}
                </span>
              </span>
              <Edit2 className="size-5 shrink-0 text-foreground" strokeWidth={1.5} />
            </button>
          ) : (
            /* Гостевой блок (§10.13) */
            <div className="rounded-[20px] bg-surface-alt p-4">
              <h2 className="mb-2 text-[18px] font-semibold text-foreground">
                Войдите в аккаунт
              </h2>
              <p className="mb-4 text-[14px] text-muted-foreground">
                Чтобы пользоваться всеми возможностями платформы
              </p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="btn btn--primary w-full"
              >
                Войти
              </button>
            </div>
          )}

          {/* 4 колонки gap 8 — четвёртая пустая, для симметрии (§10.13) */}
          <div className="mb-6 mt-4 grid grid-cols-4 gap-2">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => openOrLogin(item.href)}
                  className="press-tile flex aspect-square flex-col items-center justify-center rounded-[14px] bg-card p-2 shadow-[var(--shadow-icon-card)] transition-transform"
                >
                  <span className="mb-1.5 grid size-10 place-items-center rounded-full bg-surface-alt">
                    <Icon className="size-5 text-foreground" strokeWidth={1.5} />
                  </span>
                  <span className="text-center text-[11px] font-medium leading-[14px] text-foreground">
                    {item.label}
                  </span>
                </button>
              );
            })}
            <span aria-hidden />
          </div>
        </div>

        {/* Список меню: границы сверху и снизу, разделители между строками */}
        <div className="border-y border-border-soft lg:mx-auto lg:max-w-2xl">
          {settings.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={item.onClick}
                className={`press-row flex w-full items-center gap-3 px-4 py-4 text-left transition-colors ${
                  i > 0 ? "border-t border-border-soft" : ""
                }`}
              >
                <Icon
                  className="size-5 shrink-0 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <span className="flex-1 text-[16px] font-medium text-foreground">
                  {item.label}
                </span>
                <ChevronRight
                  className="size-5 shrink-0 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
        </div>
      </main>

      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
      <ThemeSheet open={sheet === "theme"} onClose={() => setSheet(null)} />
      <LanguageSheet open={sheet === "language"} onClose={() => setSheet(null)} />
    </>
  );
}
