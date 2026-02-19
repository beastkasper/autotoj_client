"use client";

import { useState, useRef, useCallback } from "react";

interface UsePullToRefreshOptions {
  threshold?: number;
  maxDistance?: number;
  onRefresh: () => Promise<void> | void;
}

export function usePullToRefresh({
  threshold = 60,
  maxDistance = 80,
  onRefresh,
}: UsePullToRefreshOptions) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (scrollRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (scrollRef.current?.scrollTop === 0 && !isRefreshing) {
        const distance = Math.max(
          0,
          Math.min(e.touches[0].clientY - touchStartY.current, maxDistance)
        );
        setPullDistance(distance);
      }
    },
    [isRefreshing, maxDistance]
  );

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const touchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return { pullDistance, isRefreshing, scrollRef, touchHandlers };
}
