"use client";

/**
 * Скелетон сетки объявлений (DESIGN.md §9.3): 6 карточек r12,
 * фото 4:3 и 4 линии 16/12/20/12 шириной 100%/66%/50%/75%, gap 8.
 */
export function LoadingState() {
  return (
    <div
      role="status"
      aria-label="Загрузка"
      className="mt-6 grid grid-cols-2 gap-3 px-4 md:grid-cols-3 md:gap-4 md:px-6 lg:mt-0 lg:grid-cols-4 lg:gap-5 lg:px-0"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="skeleton aspect-[4/3] rounded-none" />
          <div className="flex flex-col gap-2 p-3">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-3 w-2/3" />
            <div className="skeleton h-5 w-1/2" />
            <div className="skeleton h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
