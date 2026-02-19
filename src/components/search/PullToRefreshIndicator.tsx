"use client";

import { RefreshCw } from "lucide-react";

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
}

export function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
}: PullToRefreshIndicatorProps) {
  if (pullDistance <= 0) return null;

  return (
    <div
      className="lg:hidden flex justify-center items-center transition-all"
      style={{ height: `${pullDistance}px`, opacity: pullDistance / 80 }}
    >
      <RefreshCw
        className={`size-5 text-[#111111] ${isRefreshing ? "animate-spin" : ""}`}
        style={{ transform: `rotate(${pullDistance * 4}deg)` }}
      />
    </div>
  );
}
