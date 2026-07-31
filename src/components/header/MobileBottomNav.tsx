"use client";

import { usePathname, useRouter } from "next/navigation";
import { Search, Wrench, PlusCircle, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { cn } from "@/lib/utils";

type NavKey = "search" | "services" | "add" | "messages" | "profile";

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
    key: "search",
    label: "Поиск",
    icon: Search,
    href: "/",
    match: (p) =>
      p === "/" ||
      p.startsWith("/ad/") ||
      p.startsWith("/parts") ||
      p.startsWith("/rental"),
  },
  {
    key: "services",
    label: "Сервисы",
    icon: Wrench,
    href: "/services",
    match: (p) => p.startsWith("/services"),
  },
  {
    key: "add",
    label: "Добавить",
    icon: PlusCircle,
    href: "/post-ad",
    authOnly: true,
    match: (p) => p.startsWith("/post-ad"),
  },
  {
    key: "messages",
    label: "Сообщения",
    icon: MessageCircle,
    href: "/messages",
    authOnly: true,
    match: (p) => p.startsWith("/messages"),
  },
  {
    key: "profile",
    label: "Профиль",
    icon: User,
    href: "/profile",
    authOnly: true,
    match: (p) =>
      p.startsWith("/profile") ||
      p === "/me" ||
      p.startsWith("/me/") ||
      p.startsWith("/favorites") ||
      p.startsWith("/my-ads") ||
      p.startsWith("/logbook"),
  },
];

/**
 * Плавающая «пилюля» таббара (DESIGN.md §7.1): 340px, r24,
 * полупрозрачный фон с блюром, тень 0 8px 24px rgba(0,0,0,.08).
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, showAuthModal, requireAuth, closeAuthModal } = useAuth();

  // Скрываем на полноэкранных потоках и внутри чата (там своя строка ввода)
  const hiddenRoutes = [/^\/login/, /^\/post-ad/, /^\/messages\/[^/]+/];
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
      <nav aria-label="Главная навигация" className="tabbar-wrap lg:hidden">
        <div className="tabbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.match(pathname);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavClick(item)}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "tabbar__item",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {isActive && <span className="tabbar__capsule" aria-hidden />}
                <Icon
                  className="size-5 shrink-0"
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span
                  className={cn("tabbar__label", isActive ? "opacity-100" : "opacity-75")}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </>
  );
}
