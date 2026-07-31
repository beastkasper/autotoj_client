"use client";

interface DesktopPageHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  maxWidth?: string;
}

export function DesktopPageHeader({
  title,
  subtitle,
  rightAction,
  maxWidth = "1440px",
}: DesktopPageHeaderProps) {
  return (
    // mx-auto — иначе на экранах шире maxWidth шапка прижимается влево,
    // а контент страницы центрируется, и заголовок не совпадает с колонкой.
    <div className="mx-auto hidden w-full lg:block" style={{ maxWidth }}>
      <div className="mx-auto px-6 pt-8 pb-2" style={{ maxWidth }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[15px] text-[#8E8E93] mt-1 font-[family-name:var(--font-manrope)]">
                {subtitle}
              </p>
            )}
          </div>
          {rightAction && <div>{rightAction}</div>}
        </div>
      </div>
    </div>
  );
}
