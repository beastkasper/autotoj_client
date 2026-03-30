"use client";

import { Edit, Pause, Play, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/cards/ImageWithFallback";
import { formatPrice } from "@/lib/utils/formatPrice";
import { buildAdTitle, buildAdCharacteristics, formatDateRu } from "@/lib/utils/ad-helpers";
import type { AdListItem } from "@/lib/types/api";

interface MyAdCardDesktopProps {
  ad: AdListItem;
  activeTab: "active" | "paused";
  onEdit: (id: string) => void;
  onPause: (id: string) => void;
  onPublish: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

export function MyAdCardDesktop({
  ad,
  activeTab,
  onEdit,
  onPause,
  onPublish,
  onDelete,
  onClick,
}: MyAdCardDesktopProps) {
  const title = buildAdTitle(ad);
  const chars = buildAdCharacteristics(ad);

  return (
    <div
      className="group bg-white rounded-2xl p-6 border border-[#E5E5E7] hover:border-[#111111] hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onClick(ad.id)}
    >
      <div className="flex gap-6">
        {/* Image */}
        <div className="w-64 h-48 rounded-xl overflow-hidden shrink-0">
          <ImageWithFallback
            src={ad.photos[0] ?? ""}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-[20px] font-bold text-[#111111] group-hover:text-[#E53935] transition-colors font-[family-name:var(--font-manrope)]">
                {title}
              </h3>
              <Badge
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border ${
                  activeTab === "active"
                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
                    : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50"
                }`}
              >
                {activeTab === "active" ? "Активно" : "На паузе"}
              </Badge>
            </div>
            <p className="text-[14px] text-[#8E8E93] mb-3 font-[family-name:var(--font-manrope)]">
              {chars}
            </p>
            <p className="text-[28px] font-bold text-[#E53935] font-[family-name:var(--font-manrope)]">
              {formatPrice(ad.price)} сомони
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {ad.views} просмотров
              </span>
              <span>
                Опубликовано: {formatDateRu(ad.created_at)}
              </span>
            </div>

            {/* Action buttons */}
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={() => onEdit(ad.id)}
                className="px-4 py-2.5 rounded-xl bg-[#111111] text-white hover:bg-[#2C2C2E] text-[13px] font-medium transition-colors font-[family-name:var(--font-manrope)]"
              >
                <Edit className="w-4 h-4" />
                Редактировать
              </Button>
              {activeTab === "active" ? (
                <Button
                  variant="outline"
                  onClick={() => onPause(ad.id)}
                  className="px-4 py-2.5 rounded-xl border-[#E5E5E7] text-[#111111] hover:bg-[#F5F5F5] text-[13px] font-medium transition-colors font-[family-name:var(--font-manrope)]"
                >
                  <Pause className="w-4 h-4" />
                  На паузу
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => onPublish(ad.id)}
                  className="px-4 py-2.5 rounded-xl border-green-200 text-green-700 hover:bg-green-50 text-[13px] font-medium transition-colors font-[family-name:var(--font-manrope)]"
                >
                  <Play className="w-4 h-4" />
                  Опубликовать
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => onDelete(ad.id)}
                className="px-4 py-2.5 rounded-xl border-[#E5E5E7] text-[#E53935] hover:bg-red-50 text-[13px] font-medium transition-colors font-[family-name:var(--font-manrope)]"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
