"use client";

import { Edit, Pause, Play, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/cards/ImageWithFallback";
import { formatPrice } from "@/lib/utils/formatPrice";
import { buildAdTitle, buildAdCharacteristics, formatDateRu } from "@/lib/utils/ad-helpers";
import type { AdListItem } from "@/lib/types/api";

interface MyAdCardMobileProps {
  ad: AdListItem;
  activeTab: "active" | "paused";
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onEdit: (id: string) => void;
  onPauseRequest: (id: string) => void;
  onPublishRequest: (id: string) => void;
  onClick: (id: string) => void;
}

export function MyAdCardMobile({
  ad,
  activeTab,
  isMenuOpen,
  onMenuToggle,
  onEdit,
  onPauseRequest,
  onPublishRequest,
  onClick,
}: MyAdCardMobileProps) {
  const title = buildAdTitle(ad);
  const chars = buildAdCharacteristics(ad);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-[#E5E5E7] hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(ad.id)}
    >
      <div className="flex">
        {/* Image */}
        <div className="relative w-32 h-32 shrink-0">
          <ImageWithFallback
            src={ad.photos[0] ?? ""}
            alt={title}
            className="w-full h-full object-cover"
          />
          <Badge
            className={`absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-md border-transparent ${
              activeTab === "active"
                ? "bg-[#EAF7EE] text-[#2E7D32] hover:bg-[#EAF7EE]"
                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {activeTab === "active" ? "Активно" : "Пауза"}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 flex flex-col justify-between relative">
          {/* Menu button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle();
            }}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F2F2F7] transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-[#8E8E93]" />
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div
              className="absolute top-10 right-2 z-50 bg-white rounded-2xl shadow-lg border border-[#E5E5EA] overflow-hidden min-w-[180px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onEdit(ad.id)}
                className="w-full px-4 py-3 text-left text-[14px] font-medium text-[#111111] hover:bg-[#F2F2F7] active:bg-[#E5E5EA] transition-colors flex items-center gap-2.5 font-[family-name:var(--font-manrope)]"
              >
                <Edit className="w-4 h-4" />
                Редактировать
              </button>
              {activeTab === "active" ? (
                <button
                  onClick={() => onPauseRequest(ad.id)}
                  className="w-full px-4 py-3 text-left text-[14px] font-medium text-[#111111] hover:bg-[#F2F2F7] active:bg-[#E5E5EA] transition-colors flex items-center gap-2.5 font-[family-name:var(--font-manrope)]"
                >
                  <Pause className="w-4 h-4" />
                  Поставить на паузу
                </button>
              ) : (
                <button
                  onClick={() => onPublishRequest(ad.id)}
                  className="w-full px-4 py-3 text-left text-[14px] font-medium text-[#111111] hover:bg-[#F2F2F7] active:bg-[#E5E5EA] transition-colors flex items-center gap-2.5 font-[family-name:var(--font-manrope)]"
                >
                  <Play className="w-4 h-4" />
                  Опубликовать
                </button>
              )}
            </div>
          )}

          <div>
            <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-[#111111] pr-8 font-[family-name:var(--font-manrope)]">
              {title}
            </h3>
            <p className="text-[12px] text-[#8E8E93] mb-1 font-[family-name:var(--font-manrope)]">
              {chars}
            </p>
            <p className="text-lg font-semibold text-[#111111] mb-1 font-[family-name:var(--font-manrope)]">
              {formatPrice(ad.price)} сомони
            </p>
          </div>
          <p className="text-[12px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
            {formatDateRu(ad.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
