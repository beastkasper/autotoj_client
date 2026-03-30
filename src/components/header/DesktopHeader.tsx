"use client";

import { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AutoTojLogo } from "@/components/brand/AutoTojLogo";
import { HeaderNav } from "./HeaderNav";
import { HeaderActions } from "./HeaderActions";
import { ListingsBar } from "./ListingsBar";
import { DesktopFilterPanel } from "@/components/filters/DesktopFilterPanel";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { useAuth } from "@/hooks/useAuth";
import type { FilterState } from "@/components/filters/FilterSheet";

export function DesktopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, showAuthModal, requireAuth, closeAuthModal } = useAuth();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Derive active tab from current route
  const activeTab = pathname.startsWith("/rental")
    ? "rental"
    : pathname.startsWith("/parts")
      ? "parts"
      : pathname.startsWith("/services")
        ? "services"
        : pathname.startsWith("/logbook")
          ? "logbook"
          : pathname.startsWith("/profile")
            ? "menu"
            : "search";

  const handleNavigate = useCallback(
    (tab: string) => {
      // Auth-required routes
      const authRoutes: Record<string, string> = {
        favorites: "/favorites",
        myads: "/my-ads",
        messages: "/messages",
        post: "/post-ad",
        profile: "/profile",
      };

      // Public routes
      const publicRoutes: Record<string, string> = {
        search: "/",
        parts: "/parts",
        rental: "/rental",
        services: "/services",
        logbook: "/logbook",
        blog: "/logbook",
      };

      if (authRoutes[tab]) {
        requireAuth(() => router.push(authRoutes[tab]));
      } else if (publicRoutes[tab]) {
        router.push(publicRoutes[tab]);
      }
    },
    [requireAuth, router],
  );

  const handleShowAuth = useCallback(() => {
    router.push("/login");
  }, [router]);

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleFilterApply = useCallback((filters: FilterState) => {
    // TODO: apply filters to search results
    console.log("Applied filters:", filters);
    setIsFilterOpen(false);
  }, []);

  const handleSearch = (query: string) => {
    // TODO: implement search logic
    console.log("Search:", query);
  };

  // Hide header on auth pages — AFTER all hooks
  if (pathname.startsWith("/login") || pathname.startsWith("/post-ad")) return null;

  return (
    <>
      <header className="hidden lg:block sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E5E5E7]">
        {/* First row — Logo + Nav + Actions */}
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between gap-6 h-16">
            {/* Left: Logo + Navigation */}
            <div className="flex items-center gap-8 shrink-0">
              <button
                onClick={() => handleNavigate("search")}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer p-0"
              >
                <AutoTojLogo size="md" />
              </button>
              <HeaderNav activeTab={activeTab} onNavigate={handleNavigate} />
            </div>

            {/* Right: Action buttons */}
            <HeaderActions
              activeTab={activeTab}
              onNavigate={handleNavigate}
              isAuthenticated={isAuthenticated}
              onShowAuth={handleShowAuth}
              onProfileClick={() => handleNavigate("profile")}
            />
          </div>
        </div>

        {/* Second row — Listings bar (only on search tab) */}
        {activeTab === "search" && (
          <ListingsBar
            onSearch={handleSearch}
            onFilterClick={handleFilterClick}
            onNavigate={handleNavigate}
          />
        )}
      </header>

      {/* Desktop Filter Dialog (portal) */}
      {isFilterOpen && (
        <DesktopFilterPanel
          onClose={() => setIsFilterOpen(false)}
          onApply={handleFilterApply}
        />
      )}

      {/* Auth Required Modal */}
      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </>
  );
}
