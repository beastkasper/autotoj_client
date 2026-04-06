"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden min-h-screen bg-white">
        <div className="px-4 pb-8">
          {/* Banner */}
          <Skeleton className="h-[140px] rounded-2xl" />
          {/* Avatar */}
          <div className="flex justify-center -mt-[44px] mb-4">
            <Skeleton className="w-[88px] h-[88px] rounded-full border-4 border-white" />
          </div>
          {/* Fields */}
          <div className="flex flex-col gap-3 mt-4">
            <Skeleton className="h-14 rounded-full" />
            <Skeleton className="h-14 rounded-full" />
            <Skeleton className="h-14 rounded-full" />
            <Skeleton className="h-24 rounded-[20px]" />
          </div>
          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-8">
            <Skeleton className="h-12 rounded-full" />
            <Skeleton className="h-12 rounded-full" />
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block max-w-[800px] mx-auto py-10 px-4">
        {/* Banner */}
        <Skeleton className="h-[200px] rounded-2xl" />
        {/* Avatar */}
        <div className="flex justify-center -mt-[60px] mb-6">
          <Skeleton className="w-[120px] h-[120px] rounded-full border-4 border-white" />
        </div>
        {/* Fields */}
        <div className="flex flex-col gap-5 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-14 rounded-[16px]" />
            </div>
          ))}
        </div>
        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <Skeleton className="h-12 w-32 rounded-[16px]" />
          <Skeleton className="h-12 w-40 rounded-[16px]" />
          <Skeleton className="h-12 w-40 rounded-[16px]" />
        </div>
      </div>
    </>
  );
}
