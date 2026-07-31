"use client";

interface ContentGridProps {
  children: React.ReactNode;
  desktopCols?: 2 | 3 | 4;
  mobileCols?: 1 | 2;
  desktopGap?: string;
  /** По умолчанию 12px — шаг сетки на мобилке (§4) */
  mobileGap?: string;
}

const DESKTOP_COLS = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
} as const;

const MOBILE_COLS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
} as const;

export function ContentGrid({
  children,
  desktopCols = 4,
  mobileCols = 2,
  desktopGap = "gap-4",
  mobileGap = "gap-3",
}: ContentGridProps) {
  return (
    <>
      {/* Desktop */}
      <div className={`hidden lg:grid ${DESKTOP_COLS[desktopCols]} ${desktopGap}`}>
        {children}
      </div>
      {/* Мобилка — контент ограничен 440px, так что колонок всегда не больше двух */}
      <div className={`grid lg:hidden ${MOBILE_COLS[mobileCols]} ${mobileGap}`}>
        {children}
      </div>
    </>
  );
}
