"use client";

import { usePathname, useRouter } from "next/navigation";
import { Car, Package, User, KeyRound, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";

type NavKey = "home" | "parts" | "rental" | "me" | "profile";

interface NavItem {
  key: NavKey;
  label: string;
  icon: React.ElementType;
  href: string;
  authOnly?: boolean;
  match: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: "home",
    label: "Авто",
    icon: Car,
    href: "/",
    match: (p) => p === "/" || p.startsWith("/ad/"),
  },
  {
    key: "parts",
    label: "Запчасти",
    icon: Package,
    href: "/parts",
    match: (p) => p.startsWith("/parts"),
  },
  {
    key: "rental",
    label: "Прокат",
    icon: KeyRound,
    href: "/rental",
    match: (p) => p.startsWith("/rental"),
  },
  {
    key: "me",
    label: "Подборки",
    icon: Heart,
    href: "/me",
    authOnly: true,
    match: (p) =>
      p.startsWith("/me") ||
      p.startsWith("/favorites") ||
      p.startsWith("/my-ads") ||
      p.startsWith("/logbook"),
  },
  {
    key: "profile",
    label: "Профиль",
    icon: User,
    href: "/profile",
    authOnly: true,
    match: (p) => p.startsWith("/profile"),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, showAuthModal, requireAuth, closeAuthModal } = useAuth();

  // Hide on auth/full-screen flows
  const hiddenRoutes = [/^\/login/, /^\/post-ad/];
  if (hiddenRoutes.some((re) => re.test(pathname))) return null;

  const handleNavClick = (item: NavItem) => {
    if (item.authOnly && !isAuthenticated) {
      requireAuth(() => router.push(item.href));
      return;
    }
    router.push(item.href);
  };

  return (
    <>
      <nav
        aria-label="Главная навигация"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E5E5E7]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="flex items-stretch justify-around h-16 md:h-[72px] max-w-3xl mx-auto px-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.match(pathname);
            return (
              <li key={item.key} className="flex-1">
                <button
                  type="button"
                  onClick={() => handleNavClick(item)}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full h-full flex flex-col items-center justify-center gap-1 transition-colors ${
                    isActive ? "text-[#111111]" : "text-[#8E8E93]"
                  }`}
                >
                  <Icon
                    className="w-5 h-5 md:w-6 md:h-6"
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                  <span
                    className={`text-[11px] md:text-[12px] font-[family-name:var(--font-manrope)] ${
                      isActive ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </>
  );
}
