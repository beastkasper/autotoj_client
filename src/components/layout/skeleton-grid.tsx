"use client";

interface SkeletonGridProps {
  count?: number;
  variant?: "card" | "list";
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E5E7] animate-pulse">
      <div className="aspect-[4/3] bg-[#E5E5E7]" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-[#E5E5E7] rounded w-3/4" />
        <div className="h-5 bg-[#E5E5E7] rounded w-1/2" />
        <div className="h-3 bg-[#E5E5E7] rounded w-2/3" />
      </div>
    </div>
  );
}

function SkeletonListItem() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#E5E5E7] animate-pulse">
      <div className="flex">
        <div className="w-32 h-32 bg-[#E5E5E7]" />
        <div className="flex-1 p-3 space-y-2">
          <div className="h-4 bg-[#E5E5E7] rounded w-3/4" />
          <div className="h-3 bg-[#E5E5E7] rounded w-1/2" />
          <div className="h-5 bg-[#E5E5E7] rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8, variant = "card" }: SkeletonGridProps) {
  const Item = variant === "list" ? SkeletonListItem : SkeletonCard;
  return (
    <div role="status" aria-label="Загрузка" className="contents">
      {Array.from({ length: count }).map((_, i) => (
        <Item key={i} />
      ))}
    </div>
  );
}
