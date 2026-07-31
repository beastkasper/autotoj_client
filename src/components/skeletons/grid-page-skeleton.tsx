"use client";

interface GridPageSkeletonProps {
  count?: number;
}

/** Скелетон сетки (§9.3): карточка r12 + border, фото 4:3, линии 16/12/20/12. */
function Card() {
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

export function GridPageSkeleton({ count = 8 }: GridPageSkeletonProps) {
  const items = Array.from({ length: count }).map((_, i) => <Card key={i} />);

  return (
    <>
      {/* Desktop */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-4">{items}</div>
      {/* Мобилка: 2 колонки, gap 12 */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">{items}</div>
    </>
  );
}
