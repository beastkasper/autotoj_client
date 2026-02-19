"use client";

import type { LucideIcon } from "lucide-react";
import { LoadingState } from "@/components/states/LoadingState";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";

type PageState = "default" | "loading" | "empty" | "error" | "offline";

interface PageStateRendererProps {
  state: PageState;
  isEmpty: boolean;
  onRetry: () => void;
  onReset: () => void;
  emptyIcon: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  children: React.ReactNode;
}

export function PageStateRenderer({
  state,
  isEmpty,
  onRetry,
  onReset,
  emptyIcon,
  emptyTitle = "Ничего не найдено",
  emptyDescription = "Попробуйте изменить параметры поиска",
  emptyActionLabel = "Сбросить",
  children,
}: PageStateRendererProps) {
  if (state === "loading") return <LoadingState />;
  if (state === "error") return <ErrorState type="error" onRetry={onRetry} />;
  if (state === "offline") return <ErrorState type="offline" onRetry={onRetry} />;

  if (state === "default" && isEmpty) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={{ label: emptyActionLabel, onClick: onReset }}
      />
    );
  }

  return <>{children}</>;
}
