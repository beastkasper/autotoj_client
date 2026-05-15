"use client";

interface ContentGridProps {
  children: React.ReactNode;
  desktopCols?: 2 | 3 | 4;
  tabletCols?: 2 | 3;
  mobileCols?: 1 | 2;
  desktopGap?: string;
  tabletGap?: string;
  mobileGap?: string;
}

const DESKTOP_COLS = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
} as const;

const TABLET_COLS = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
} as const;

const MOBILE_COLS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
} as const;

export function ContentGrid({
  children,
  desktopCols = 4,
  tabletCols = 3,
  mobileCols = 2,
  desktopGap = "gap-4",
  tabletGap = "md:gap-4",
  mobileGap = "gap-3",
}: ContentGridProps) {
  return (
    <>
      {/* Desktop */}
      <div className={`hidden lg:grid ${DESKTOP_COLS[desktopCols]} ${desktopGap}`}>
        {children}
      </div>
      {/* Mobile + Tablet */}
      <div
        className={`lg:hidden grid ${MOBILE_COLS[mobileCols]} ${TABLET_COLS[tabletCols]} ${mobileGap} ${tabletGap}`}
      >
        {children}
      </div>
    </>
  );
}
