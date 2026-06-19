"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoadMoreButtonProps {
  /** Whether there are more pages to load. The button renders nothing if false. */
  hasMore: boolean;
  /** True while the next page is being fetched. */
  isLoading: boolean;
  onClick: () => void;
  className?: string;
}

/** Shared "Показать ещё" pagination control used across list pages. */
export function LoadMoreButton({
  hasMore,
  isLoading,
  onClick,
  className,
}: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className={cn("flex justify-center px-4 py-8 lg:px-0", className)}>
      <Button
        variant="outline"
        size="lg"
        onClick={onClick}
        disabled={isLoading}
        className="min-w-[220px] rounded-xl border-[#E5E5E7] text-[15px] font-medium font-[family-name:var(--font-manrope)]"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Загрузка...
          </>
        ) : (
          "Показать ещё"
        )}
      </Button>
    </div>
  );
}
