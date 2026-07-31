"use client";

import { Edit2, Pause, Play, MoreVertical } from "lucide-react";
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

/**
 * Карточка «Моих объявлений» (DESIGN.md §10.16): r12 + border, фото 128×128,
 * бейдж статуса top8 left8 r6 12/500, цена 18/600.
 */
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
  const isActive = activeTab === "active";

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card"
      onClick={() => onClick(ad.id)}
    >
      <div className="flex">
        <div className="relative size-32 shrink-0">
          <ImageWithFallback
            src={ad.photos[0] ?? ""}
            alt={title}
            className="size-full object-cover"
          />
          <span
            className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-[12px] font-medium ${
              isActive ? "bg-[#4CAF50] text-white" : "bg-black/60 text-white"
            }`}
          >
            {isActive ? "Активно" : "Пауза"}
          </span>
        </div>

        <div className="relative flex flex-1 flex-col justify-between overflow-hidden p-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle();
            }}
            aria-label="Действия"
            className="absolute right-1 top-1 grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors active:bg-secondary"
          >
            <MoreVertical className="size-4" strokeWidth={1.5} />
          </button>

          <div>
            <h3 className="line-1 mb-1 pr-8 text-[14px] font-semibold text-foreground">
              {title}
            </h3>
            <p className="line-1 mb-2 text-[12px] text-muted-foreground">{chars}</p>
            {ad.location && (
              <p className="line-1 mb-2 text-[12px] text-muted-foreground">
                {ad.location}
              </p>
            )}
            <p className="mb-1 text-[18px] font-semibold text-foreground">
              {formatPrice(ad.price)} сомони
            </p>
          </div>
          <p className="text-[12px] text-muted-foreground">
            {formatDateRu(ad.created_at)}
          </p>
        </div>
      </div>

      {/* Контекстное меню (§10.16): right 12, top 48, min-width 200, r16 */}
      {isMenuOpen && (
        <div
          className="absolute right-3 top-12 z-50 min-w-[200px] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-menu)]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(ad.id)}
            className="press-row flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] text-foreground transition-colors"
          >
            <Edit2 className="size-[18px]" strokeWidth={1.5} />
            Редактировать
          </button>
          <div className="h-px bg-border" />
          {isActive ? (
            <button
              onClick={() => onPauseRequest(ad.id)}
              className="press-row flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] text-foreground transition-colors"
            >
              <Pause className="size-[18px]" strokeWidth={1.5} />
              Приостановить
            </button>
          ) : (
            <button
              onClick={() => onPublishRequest(ad.id)}
              className="press-row flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] text-foreground transition-colors"
            >
              <Play className="size-[18px]" strokeWidth={1.5} />
              Опубликовать
            </button>
          )}
        </div>
      )}
    </div>
  );
}
