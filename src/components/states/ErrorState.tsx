"use client";

import { WifiOff, AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  type: "error" | "offline";
  onRetry: () => void;
  title?: string;
  description?: string;
}

const CONFIG = {
  error: {
    icon: AlertCircle,
    title: "Не удалось загрузить объявления",
    description: "Произошла ошибка при загрузке данных",
    circle: "bg-[rgba(255,59,48,0.1)]",
    iconColor: "text-destructive",
  },
  offline: {
    icon: WifiOff,
    title: "Нет подключения к интернету",
    description: "Проверьте подключение к сети и попробуйте снова",
    circle: "bg-muted",
    iconColor: "text-muted-foreground",
  },
} as const;

/** Состояние ошибки (DESIGN.md §9.2) — тот же каркас, что и у пустого состояния. */
export function ErrorState({ type, onRetry, title, description }: ErrorStateProps) {
  const cfg = CONFIG[type];
  const Icon = cfg.icon;

  return (
    <div className="px-4 py-16 text-center">
      <div
        className={`mx-auto mb-4 grid size-20 place-items-center rounded-full ${cfg.circle}`}
      >
        <Icon className={`size-10 ${cfg.iconColor}`} strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 text-[18px] font-semibold text-foreground">
        {title ?? cfg.title}
      </h3>
      <p className="mx-auto mb-6 max-w-96 text-[14px] text-muted-foreground">
        {description ?? cfg.description}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="btn gap-2 rounded-lg bg-primary px-6 py-3 text-[16px] font-medium text-primary-foreground"
      >
        <RefreshCw className="size-4" strokeWidth={1.5} />
        Повторить
      </button>
    </div>
  );
}
