"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AutoTojLogo } from "@/components/brand/AutoTojLogo";
import { HeaderNav } from "./HeaderNav";
import { HeaderActions } from "./HeaderActions";
import { ListingsBar } from "./ListingsBar";

export function DesktopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("search");

  // Hide header on auth pages
  if (pathname.startsWith("/login")) return null;

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    // TODO: map tabs to actual routes when they exist
  };

  const handleShowAuth = () => {
    router.push("/login");
  };

  const handleFilterClick = () => {
    // TODO: open filters modal/panel
    console.log("Open filters");
  };

  const handleSearch = (query: string) => {
    // TODO: implement search logic
    console.log("Search:", query);
  };

  return (
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
  );
}
