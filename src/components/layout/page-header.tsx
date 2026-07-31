"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Шапки экранов (DESIGN.md §7.2)
 *
 * `center` — тип A: заголовок 17/600 по центру, высота 56, hairline снизу.
 * `back`   — тип C: назад / заголовок / действия, высота 56, иконки-кнопки 40×40.
 * `large`  — тип B: крупный заголовок 20/600 слева, padding 16, рядом «назад».
 */
type HeaderVariant = "center" | "back" | "large";

interface PageHeaderProps {
  title: string;
  variant?: HeaderVariant;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  /** Убрать разделитель снизу (шапка над галереей и т.п.) */
  bare?: boolean;
  className?: string;
  /** Переопределение размера заголовка (например, 20/600 в «Сообщениях») */
  titleClass?: string;
}

export function PageHeader({
  title,
  variant = "back",
  subtitle,
  onBack,
  rightAction,
  bare = false,
  className,
  titleClass,
}: PageHeaderProps) {
  const router = useRouter();
  const back = onBack ?? (() => router.back());

  return (
    <header
      className={cn(
        "lg:hidden sticky top-0 z-40 bg-card pt-[env(safe-area-inset-top)]",
        !bare && "hairline",
        className,
      )}
    >
      {variant === "center" && (
        <div className="relative flex h-14 items-center justify-center px-4">
          <h1 className={cn("screen-title text-foreground", titleClass)}>{title}</h1>
          {rightAction && (
            <div className="absolute right-2 flex items-center">{rightAction}</div>
          )}
        </div>
      )}

      {variant === "back" && (
        <div className="flex h-14 items-center justify-between px-4">
          <button
            type="button"
            onClick={back}
            aria-label="Назад"
            className="icon-btn -ml-2.5"
          >
            <ArrowLeft className="size-5" strokeWidth={1.5} />
          </button>
          <h1 className="screen-title line-1 flex-1 px-2 text-center text-foreground">
            {title}
          </h1>
          <div className="flex min-w-10 items-center justify-end gap-1">
            {rightAction}
          </div>
        </div>
      )}

      {variant === "large" && (
        <div className="flex items-center gap-2 p-4">
          <button
            type="button"
            onClick={back}
            aria-label="Назад"
            className="icon-btn -ml-2.5"
          >
            <ArrowLeft className="size-5" strokeWidth={1.5} />
          </button>
          <div className="min-w-0 flex-1">
            <h1
              className={cn(
                "line-1 text-[20px] font-semibold leading-[26px] text-foreground",
                titleClass,
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-[14px] text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {rightAction && <div className="flex items-center gap-1">{rightAction}</div>}
        </div>
      )}
    </header>
  );
}
