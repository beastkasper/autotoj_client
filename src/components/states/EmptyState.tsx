"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="size-16 rounded-2xl bg-[#F2F2F7] flex items-center justify-center mb-4">
        <Icon className="size-7 text-[#8E8E93]" />
      </div>
      <h3
        className="text-lg font-semibold text-[#111111] mb-1"
        style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
      >
        {title}
      </h3>
      <p
        className="text-sm text-[#8E8E93] max-w-xs mb-6"
        style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
      >
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          variant="outline"
          className="rounded-full px-6 text-[14px] font-medium"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
