"use client";

import { Button } from "@/components/ui/button";

export type MyAdsTab = "active" | "archived" | "rental";

interface MyAdsTabsProps {
  activeTab: MyAdsTab;
  onTabChange: (tab: MyAdsTab) => void;
  variant: "desktop" | "mobile";
}

// «На паузе» на бэкенде — это статус archived (INTEGRATION.md §6.1),
// отдельного paused не существует.
const tabs: { key: MyAdsTab; label: string }[] = [
  { key: "active", label: "Активные" },
  { key: "archived", label: "На паузе" },
  // Объявления о прокате живут в отдельном эндпоинте /my/rental, и до
  // появления этой вкладки управлять ими было неоткуда.
  { key: "rental", label: "Прокат" },
];

export function MyAdsTabs({ activeTab, onTabChange, variant }: MyAdsTabsProps) {
  if (variant === "desktop") {
    return (
      <div className="flex gap-3 mb-6">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-6 py-3 rounded-xl text-[15px] font-medium transition-all font-[family-name:var(--font-manrope)] ${
              activeTab === tab.key
                ? "bg-[#111111] text-white hover:bg-[#111111]/90"
                : "bg-white text-[#8E8E93] hover:bg-[#F5F5F5] hover:text-[#111111] border border-[#E5E5E7]"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    );
  }

  // Табы (§10.16): px16 py12, border-bottom 2px; активный — цвет и линия --foreground
  return (
    <div className="scroll-x flex border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`whitespace-nowrap border-b-2 px-4 py-3 text-[14px] font-medium transition-colors ${
            activeTab === tab.key
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
