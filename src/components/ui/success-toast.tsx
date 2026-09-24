"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

interface SuccessToastProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Автозакрытие, мс. 0 — не закрывать автоматически. */
  duration?: number;
}

/**
 * Подтверждение успешного действия.
 *
 * Раньше формы аренды и гос. номеров после публикации просто закрывались:
 * объявление уходило на модерацию и в списке не появлялось, поэтому человек
 * не понимал, сохранилось что-нибудь или нет.
 */
export function SuccessToast({
  open,
  onClose,
  title,
  description,
  duration = 5000,
}: SuccessToastProps) {
  useEffect(() => {
    if (!open || duration <= 0) return;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-24 z-[70] mx-auto flex max-w-[420px] items-start gap-3 rounded-2xl bg-[#111111] px-4 py-3 text-white shadow-lg lg:bottom-6"
    >
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#4CAF50]" />
      <div className="flex-1">
        <p className="text-[15px] font-semibold font-[family-name:var(--font-manrope)]">
          {title}
        </p>
        {description && (
          <p className="mt-0.5 text-[13px] text-white/70 font-[family-name:var(--font-manrope)]">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть уведомление"
        className="-mr-1 rounded-full p-1 transition-colors hover:bg-white/10"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
