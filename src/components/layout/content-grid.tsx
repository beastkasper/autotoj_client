"use client";

interface ContentGridProps {
  children: React.ReactNode;
  desktopCols?: 2 | 3 | 4;
  mobileCols?: 1 | 2;
  desktopGap?: string;
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
      {/* Mobile */}
      <div className={`lg:hidden grid ${MOBILE_COLS[mobileCols]} ${mobileGap}`}>
        {children}
      </div>
    </>
  );
}
