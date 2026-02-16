"use client";

import { WifiOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  type: "error" | "offline";
  onRetry: () => void;
}

const CONFIG = {
  error: {
    icon: AlertTriangle,
    title: "Что-то пошло не так",
    description: "Произошла ошибка при загрузке данных. Попробуйте ещё раз.",
    buttonLabel: "Повторить",
  },
  offline: {
    icon: WifiOff,
    title: "Нет подключения к интернету",
    description: "Проверьте подключение и попробуйте ещё раз.",
    buttonLabel: "Повторить",
  },
} as const;

export function ErrorState({ type, onRetry }: ErrorStateProps) {
  const { icon: Icon, title, description, buttonLabel } = CONFIG[type];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="size-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <Icon className="size-7 text-[#E53935]" />
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
      <Button
        onClick={onRetry}
        className="rounded-full px-6 bg-[#111111] text-white hover:bg-[#111111]/90 text-[14px] font-medium"
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
