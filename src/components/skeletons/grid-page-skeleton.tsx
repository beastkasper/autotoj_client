"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface GridPageSkeletonProps {
  count?: number;
}

export function GridPageSkeleton({ count = 8 }: GridPageSkeletonProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden border border-[#E5E5E7] animate-pulse"
          >
            <Skeleton className="aspect-[4/3] rounded-none" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile */}
      <div className="lg:hidden grid grid-cols-2 gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden border border-[#E5E5E7] animate-pulse"
          >
            <Skeleton className="aspect-[4/3] rounded-none" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
