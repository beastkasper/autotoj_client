"use client";

import { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AutoTojLogo } from "@/components/brand/AutoTojLogo";
import { HeaderNav } from "./HeaderNav";
import { HeaderActions } from "./HeaderActions";
import { ListingsBar } from "./ListingsBar";
import { DesktopFilterPanel } from "@/components/filters/DesktopFilterPanel";
import type { FilterState } from "@/components/filters/FilterSheet";

export function DesktopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Derive active tab from current route
  const activeTab = pathname.startsWith("/rental")
    ? "rental"
    : pathname.startsWith("/parts")
      ? "parts"
      : "search";

  const handleNavigate = (tab: string) => {
    switch (tab) {
      case "search":
        router.push("/");
        break;
      case "parts":
        router.push("/parts");
        break;
      case "rental":
        router.push("/rental");
        break;
      case "post":
        router.push("/post-ad");
        break;
      default:
        console.log("Navigate:", tab);
    }
  };

  const handleShowAuth = () => {
    router.push("/login");
  };

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
              isAuthenticated={false}
              onShowAuth={handleShowAuth}
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
    </>
  );
}
