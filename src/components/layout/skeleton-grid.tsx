"use client";

interface SkeletonGridProps {
  count?: number;
  variant?: "card" | "list";
}

/** Карточка-скелетон сетки (§9.3): r12 + border, фото 4:3, линии 16/12/20/12. */
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="skeleton aspect-[4/3] rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="skeleton h-5 w-1/2" />
        <div className="skeleton h-3 w-3/4" />
      </div>
    </div>
  );
}

/** Строка-скелетон списка (§9.3): фото 128×128, линии 16/12/20/12, gap 12. */
function SkeletonListItem() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex">
        <div className="skeleton size-32 shrink-0 rounded-none" />
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
          <div className="skeleton h-5 w-1/3" />
          <div className="skeleton h-3 w-2/3" />
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
