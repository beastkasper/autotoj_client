"use client";

import {
  Heart,
  MessageCircle,
  User,
  BookOpen,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderActionsProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  isAuthenticated: boolean;
  onShowAuth: () => void;
  onProfileClick?: () => void;
}

/** Icon action definitions — adding a new icon button is just a new entry here. */
interface ActionItem {
  key: string;
  icon: React.ElementType;
  title: string;
  /** Show a red notification dot */
  badge?: boolean;
  /** Only show when authenticated */
  authOnly?: boolean;
}

const ACTION_ITEMS: ActionItem[] = [
  { key: "favorites", icon: Heart, title: "Избранное" },
  { key: "myads", icon: Package, title: "Мои объявления", authOnly: true },
  { key: "blog", icon: BookOpen, title: "Бортжурнал" },
  { key: "messages", icon: MessageCircle, title: "Сообщения", badge: true },
];

export function HeaderActions({
  activeTab,
  onNavigate,
  isAuthenticated,
  onShowAuth,
  onProfileClick,
}: HeaderActionsProps) {
  const handleProfileClick = () => {
    if (!isAuthenticated) {
      onShowAuth();
    } else {
      onProfileClick?.();
    }
  };

  return (
    <div className="flex items-center gap-1">
      {ACTION_ITEMS.map((item) => {
        if (item.authOnly && !isAuthenticated) return null;

        const Icon = item.icon;
        return (
          <Button
            key={item.key}
            variant="ghost"
            size="icon"
            onClick={() => onNavigate(item.key)}
            title={item.title}
            className={
              activeTab === item.key
                ? "bg-[#111111] text-white hover:bg-[#111111]/90"
                : "text-[#8E8E93] hover:bg-[#F5F5F5] hover:text-[#111111]"
            }
          >
            <Icon className="size-5" />
            {item.badge && (
              <span className="absolute top-1 right-1 size-2 bg-[#E53935] rounded-full" />
            )}
          </Button>
        );
      })}

      {/* Profile — always visible, label changes based on auth */}
      <Button
        variant="ghost"
        onClick={handleProfileClick}
        className={
          activeTab === "menu"
            ? "bg-[#111111] text-white hover:bg-[#111111]/90 gap-2"
            : "text-[#111111] hover:bg-[#F5F5F5] gap-2"
        }
      >
        <User className="size-5" />
        {isAuthenticated && (
          <span className="text-[15px] font-medium">Профиль</span>
        )}
      </Button>
    </div>
  );
}
