"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* ── Desktop Top Bar ── */}
      <div className="hidden lg:block bg-white border-b border-[#E5E5E7]">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </div>

      {/* ── Desktop Two-Column ── */}
      <div className="hidden lg:block">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="grid grid-cols-[1fr_380px] gap-8 items-start">
            {/* Left */}
            <div className="space-y-6">
              <Skeleton className="aspect-[16/10] rounded-2xl" />
              {/* Specs */}
              <div className="bg-white rounded-2xl border border-[#E5E5E7] p-6 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                ))}
              </div>
              {/* Description */}
              <div className="bg-white rounded-2xl border border-[#E5E5E7] p-6 space-y-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>

            {/* Right — Sticky */}
            <div className="sticky top-28 space-y-4">
              {/* Price card */}
              <div className="bg-white rounded-2xl border border-[#E5E5E7] p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              {/* Buttons */}
              <Skeleton className="h-[52px] w-full rounded-2xl" />
              <Skeleton className="h-[52px] w-full rounded-2xl" />
              {/* Seller card */}
              <div className="bg-white rounded-2xl border border-[#E5E5E7] p-5 space-y-3">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Header ── */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E7]">
        <div className="flex items-center justify-between px-4 h-14">
          <Skeleton className="w-9 h-9 rounded-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
        </div>
      </div>

      {/* ── Mobile Content ── */}
      <div className="lg:hidden pb-24">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="px-4 mt-5 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        {/* Seller */}
        <div className="px-4 mt-5">
          <div className="bg-white rounded-2xl border border-[#E5E5E7] p-4 space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
        {/* Specs */}
        <div className="px-4 mt-5">
          <div className="bg-white rounded-2xl border border-[#E5E5E7] p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E7] px-4 py-3">
        <div className="flex gap-3">
          <Skeleton className="flex-1 h-12 rounded-2xl" />
          <Skeleton className="flex-1 h-12 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
