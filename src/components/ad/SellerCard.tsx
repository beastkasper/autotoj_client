"use client";

import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface SellerCardProps {
  sellerName?: string;
  sellerType?: "dealer" | "private";
  sellerAdsCount?: number;
  publishedDate?: string;
  vehicleStatus?: string;
}

export function SellerCard({
  sellerName,
  sellerType,
  sellerAdsCount,
  publishedDate,
  vehicleStatus,
}: SellerCardProps) {
  return (
    <Card className="rounded-2xl border-[#E5E5E7] shadow-none py-0">
      <CardContent className="p-5">
        <p className="text-[14px] font-semibold text-[#111111] mb-3 font-[family-name:var(--font-manrope)]">
          Продавец
        </p>
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-[#F2F2F7]">
              <User className="w-5 h-5 text-[#8E8E93]" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[14px] font-medium text-[#111111] font-[family-name:var(--font-manrope)]">
              {sellerName || "Продавец"}
            </p>
            <p className="text-[12px] text-[#8E8E93] mt-0.5 font-[family-name:var(--font-manrope)]">
              {sellerType === "dealer" ? "Автосалон" : "Частное лицо"}
              {sellerAdsCount ? ` • ${sellerAdsCount} объявл.` : ""}
            </p>
          </div>
        </div>

        {(publishedDate || vehicleStatus) && (
          <>
            <Separator className="mt-4 mb-3 bg-[#F2F2F7]" />
            <div className="space-y-2">
              {publishedDate && (
                <div className="flex items-center justify-between text-[13px] font-[family-name:var(--font-manrope)]">
                  <span className="text-[#8E8E93]">Опубликовано</span>
                  <span className="text-[#111111] font-medium">{publishedDate}</span>
                </div>
              )}
              {vehicleStatus && (
                <div className="flex items-center justify-between text-[13px] font-[family-name:var(--font-manrope)]">
                  <span className="text-[#8E8E93]">Статус</span>
                  <span
                    className={`font-medium ${
                      vehicleStatus === "В наличии" ? "text-[#4CAF50]" : "text-[#FF9800]"
                    }`}
                  >
                    {vehicleStatus}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
