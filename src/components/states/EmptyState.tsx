"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Пустое состояние (DESIGN.md §9.1): круг 80×80 bg --muted, иконка 40px stroke 1.5,
 * заголовок 18/600, описание 14/400 muted, кнопка px24 py12 r8.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("px-4 py-16 text-center", className)}>
      <div className="mx-auto mb-4 grid size-20 place-items-center rounded-full bg-muted">
        <Icon className="size-10 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 text-[18px] font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mb-6 max-w-96 text-[14px] text-muted-foreground">
        {description}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="btn rounded-lg bg-primary px-6 py-3 text-[16px] font-medium text-primary-foreground"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
