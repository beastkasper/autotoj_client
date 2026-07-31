"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Радиус верхних углов (§8.1: 16 фильтры, 20 действия, 24 селект, 28 тема) */
  radius?: 16 | 20 | 24 | 28;
  /** Плотность затемнения: .5 / .4 / .1 (§8.1) */
  backdrop?: 0.1 | 0.4 | 0.5;
  showHandle?: boolean;
  className?: string;
  ariaLabel?: string;
  /** Максимальная высота панели (по умолчанию 80%) */
  maxHeight?: string;
}

/**
 * Боттом-шит (DESIGN.md §8.1): выезжает снизу, ручка 40×4,
 * затемнение фона, закрытие по тапу вне и по Esc.
 */
export function BottomSheet({
  open,
  onClose,
  children,
  radius = 24,
  backdrop = 0.5,
  showHandle = true,
  className,
  ariaLabel,
  maxHeight,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        className="sheet-backdrop"
        style={{ background: `rgba(0,0,0,${backdrop})` }}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn("sheet-panel", className)}
        style={{
          borderRadius: `${radius}px ${radius}px 0 0`,
          ...(maxHeight ? { maxHeight } : null),
        }}
      >
        {showHandle && <span className="sheet-handle" />}
        {children}
      </div>
    </>,
    document.body,
  );
}
