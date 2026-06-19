"use client";

import { useEffect, useState } from "react";
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

/** Collapse the bar to icons-only after scrolling down past this offset. */
const SCROLL_THRESHOLD = 16;

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, showAuthModal, requireAuth, closeAuthModal } = useAuth();

  // Shrink to icons-only on scroll down, expand (show labels) on scroll up / top.
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < SCROLL_THRESHOLD) {
        setCollapsed(false);
        lastY = y;
        return;
      }
      const delta = y - lastY;
      if (Math.abs(delta) < 6) return;
      setCollapsed(delta > 0);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide on auth/full-screen flows and inside an individual chat (its own input bar)
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
      <div
        className="lg:hidden fixed inset-x-0 bottom-0 z-40 pointer-events-none"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <nav
          aria-label="Главная навигация"
          className="pointer-events-auto mx-3 mb-3 md:mx-auto md:max-w-md rounded-[28px] border border-[#ECECEE] bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl"
        >
          <ul
            className={cn(
              "flex items-stretch justify-around px-2 transition-all duration-300 ease-out",
              collapsed ? "py-2.5" : "py-3",
            )}
          >
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
                    className={cn(
                      "flex w-full flex-col items-center justify-center transition-colors",
                      isActive ? "text-[#111111]" : "text-[#B5B5BA]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center rounded-full px-4 py-1 transition-colors",
                        isActive ? "bg-[#EFEFF1]" : "bg-transparent",
                      )}
                    >
                      <Icon
                        className="size-6 shrink-0"
                        strokeWidth={isActive ? 2.4 : 2}
                      />
                    </span>
                    <span
                      className={cn(
                        "overflow-hidden text-[11px] leading-none font-[family-name:var(--font-manrope)] transition-all duration-300 ease-out",
                        isActive ? "font-semibold" : "font-medium",
                        collapsed
                          ? "mt-0 max-h-0 opacity-0"
                          : "mt-1 max-h-4 opacity-100",
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </>
  );
}
