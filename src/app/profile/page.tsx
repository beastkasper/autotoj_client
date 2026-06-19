"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Pencil,
  User,
  Package,
  Heart,
  BookOpen,
  Wallet,
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
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton";
import { LegalModal } from "@/components/login/legal-modal";

const F = "font-[family-name:var(--font-manrope)]";
const CARD = "bg-white border border-[#F0F0F2] shadow-[0_2px_8px_rgba(0,0,0,0.04)]";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, showAuthModal, closeAuthModal } = useAuth();
  const { data: profile, isLoading } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const [legal, setLegal] = useState<"terms" | "privacy" | null>(null);

  if (!isAuthenticated) {
    return <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />;
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const quickActions = [
    { key: "ads", label: "Мои объявления", icon: Package, onClick: () => router.push("/my-ads") },
    { key: "favorites", label: "Избранное", icon: Heart, onClick: () => router.push("/favorites") },
    { key: "logbook", label: "Бортжурнал", icon: BookOpen, onClick: () => router.push("/logbook") },
    { key: "wallet", label: "Кошелек", icon: Wallet, onClick: undefined },
  ];

  const settings = [
    { key: "language", label: "Язык", icon: Globe, onClick: undefined },
    { key: "theme", label: "Тема оформления", icon: Palette, onClick: undefined },
    { key: "notifications", label: "Настройки уведомлений", icon: Bell, onClick: undefined },
    { key: "about", label: "О приложении", icon: Smartphone, onClick: undefined },
    { key: "terms", label: "Условия соглашения", icon: FileText, onClick: () => setLegal("terms") },
    { key: "privacy", label: "Политика конфиденциальности", icon: Lock, onClick: () => setLegal("privacy") },
    { key: "rules", label: "Правила рекомендаций", icon: Star, onClick: undefined },
    { key: "faq", label: "Часто задаваемые вопросы", icon: HelpCircle, onClick: undefined },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#FAFAFA]">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E7]">
          <div className="flex items-center justify-center h-14">
            <h1 className={`text-[17px] font-semibold text-[#111111] ${F}`}>Профиль</h1>
          </div>
        </header>

        <div className="mx-auto w-full max-w-md lg:max-w-2xl px-4 pt-4 lg:pt-10 pb-28 space-y-5">
          <h1 className={`hidden lg:block text-[28px] font-bold text-[#111111] ${F}`}>Профиль</h1>

          {/* Profile card */}
          <button
            onClick={() => router.push("/profile/edit")}
            className={`w-full flex items-center gap-3 rounded-2xl p-4 text-left active:scale-[0.99] transition-transform ${CARD}`}
          >
            <span className="size-14 rounded-full overflow-hidden bg-[#F2F2F7] flex items-center justify-center shrink-0">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.name ?? "Аватар"}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              ) : (
                <User className="w-7 h-7 text-[#C7C7CC]" />
              )}
            </span>
            <span className="flex-1 min-w-0">
              <span className={`block text-[18px] font-bold text-[#111111] truncate ${F}`}>
                {profile?.name || "Профиль"}
              </span>
              <span className={`block text-[15px] text-[#8E8E93] truncate ${F}`}>
                {profile?.phone}
              </span>
            </span>
            <span className="size-9 rounded-full flex items-center justify-center shrink-0">
              <Pencil className="w-5 h-5 text-[#111111]" />
            </span>
          </button>

          {/* Quick actions */}
          <div className="grid grid-cols-4 gap-2.5">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={item.onClick}
                  className={`flex flex-col items-center rounded-2xl py-4 px-1 active:scale-[0.97] transition-transform ${CARD}`}
                >
                  <span className="size-11 rounded-full bg-[#F2F2F7] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#111111]" strokeWidth={1.8} />
                  </span>
                  <span className={`mt-2 text-[12px] font-medium text-[#111111] text-center leading-tight ${F}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Settings list */}
          <div className={`rounded-2xl overflow-hidden ${CARD}`}>
            {settings.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-4 active:bg-[#F7F7F9] transition-colors ${
                    i > 0 ? "border-t border-[#F2F2F2]" : ""
                  }`}
                >
                  <Icon className="w-[22px] h-[22px] text-[#8E8E93] shrink-0" strokeWidth={1.8} />
                  <span className={`flex-1 text-left text-[16px] text-[#111111] ${F}`}>
                    {item.label}
                  </span>
                  <ChevronRight className="w-5 h-5 text-[#C7C7CC] shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
    </>
  );
}
