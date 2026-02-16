"use client";

import { Button } from "@/components/ui/button";

/** Navigation tab keys — extend this union as new sections are added. */
export type NavTab = "search" | "parts" | "rental";

const NAV_ITEMS: { key: NavTab; label: string }[] = [
  { key: "search", label: "Авто" },
  { key: "parts", label: "Запчасти" },
  { key: "rental", label: "Авто прокат" },
];

interface HeaderNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export function HeaderNav({ activeTab, onNavigate }: HeaderNavProps) {
  return (
    <nav className="flex items-center gap-1">
      {NAV_ITEMS.map((item) => (
        <Button
          key={item.key}
          variant={activeTab === item.key ? "default" : "ghost"}
          size="sm"
          onClick={() => onNavigate(item.key)}
          className={
            activeTab === item.key
              ? "bg-[#111111] text-white hover:bg-[#111111]/90 rounded-lg text-[15px] font-medium"
              : "text-[#111111] hover:bg-[#F5F5F5] rounded-lg text-[15px] font-medium"
          }
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
}
