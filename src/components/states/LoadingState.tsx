"use client";

export function LoadingState() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 px-4 lg:px-0 mt-8 lg:mt-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden bg-white border border-[#F2F2F7]"
        >
          {/* Image skeleton */}
          <div className="aspect-[4/3] bg-[#F2F2F7] animate-pulse" />
          {/* Content skeleton */}
          <div className="p-3 space-y-2">
            <div className="h-4 bg-[#F2F2F7] rounded-lg w-3/4 animate-pulse" />
            <div className="h-3 bg-[#F2F2F7] rounded-lg w-1/2 animate-pulse" />
            <div className="h-5 bg-[#F2F2F7] rounded-lg w-2/3 animate-pulse" />
            <div className="h-3 bg-[#F2F2F7] rounded-lg w-1/3 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
