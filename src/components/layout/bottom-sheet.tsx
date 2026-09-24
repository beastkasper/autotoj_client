"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  /** Вызывается после завершения анимации закрытия (любым способом). */
  onClosed?: () => void;
}

/** Длительность анимации закрытия / возврата на место, мс. */
const CLOSE_MS = 250;
/** Сдвиг (доля высоты панели), после которого отпускание закрывает шит. */
const CLOSE_RATIO = 0.25;
/** Скорость свайпа вниз (px/мс), после которой шит закрывается сразу. */
const FLICK_VELOCITY = 0.5;
/** Порог, после которого жест считается перетаскиванием, а не тапом/скроллом. */
const DRAG_SLOP = 6;

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

/** true, если между target и панелью есть прокручиваемый блок, не долистанный до верха. */
function isInsideScrolledContent(target: EventTarget | null, panel: HTMLElement): boolean {
  let el = target instanceof HTMLElement ? target : null;
  while (el && el !== panel) {
    const style = window.getComputedStyle(el);
    const scrollable = /(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight;
    if (scrollable && el.scrollTop > 0) return true;
    el = el.parentElement;
  }
  return false;
}

function isTextField(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && !!target.closest("input, textarea, select, [contenteditable='true']");
}

/**
 * Боттом-шит (DESIGN.md §8.1): выезжает снизу, ручка 40×4,
 * затемнение фона, закрытие по тапу вне, по Esc и свайпом вниз
 * (за ручку/шапку или за контент, когда он долистан до верха).
 * Закрытие анимируется: панель уезжает вниз, фон гаснет.
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
  onClosed,
}: BottomSheetProps) {
  // mounted — шит в DOM (в т.ч. во время анимации закрытия)
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  // Открытие/закрытие снаружи (open из props)
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setMounted(true);
      setClosing(false);
    } else if (mounted) {
      setClosing(true);
    }
  }

  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const onClosedRef = useRef(onClosed);
  useEffect(() => {
    onCloseRef.current = onClose;
    onClosedRef.current = onClosed;
  }, [onClose, onClosed]);

  // Закрытие, начатое самим шитом (фон, Esc, свайп): сначала анимация, потом onClose.
  const requestedRef = useRef(false);
  const requestClose = useCallback(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    setClosing(true);
  }, []);

  // Повторное открытие во время анимации закрытия — вернуть панель на место
  useEffect(() => {
    if (!open || closing) return;
    const panel = panelRef.current;
    const bd = backdropRef.current;
    if (panel && panel.style.transform) {
      panel.style.transition = `transform ${CLOSE_MS}ms ${EASE}`;
      panel.style.transform = "translateY(0px)";
    }
    if (bd && bd.style.opacity) {
      bd.style.transition = `opacity ${CLOSE_MS}ms ease-out`;
      bd.style.opacity = "1";
    }
  }, [open, closing]);

  // Анимация закрытия → размонтирование
  useEffect(() => {
    if (!closing) return;
    const panel = panelRef.current;
    const bd = backdropRef.current;
    if (panel) {
      panel.style.animation = "none";
      panel.style.transition = `transform ${CLOSE_MS}ms ${EASE}`;
      panel.style.transform = "translateY(100%)";
    }
    if (bd) {
      bd.style.animation = "none";
      bd.style.transition = `opacity ${CLOSE_MS}ms ease-out`;
      bd.style.opacity = "0";
    }
    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
      if (requestedRef.current) {
        requestedRef.current = false;
        onCloseRef.current();
      }
      onClosedRef.current?.();
    }, CLOSE_MS);
    return () => clearTimeout(timer);
  }, [closing]);

  // Esc + блокировка прокрутки страницы
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mounted, requestClose]);

  // ── Свайп вниз ──
  useEffect(() => {
    const panel = panelRef.current;
    if (!mounted || !panel) return;

    let startY = 0;
    let startX = 0;
    let lastY = 0;
    let lastT = 0;
    let velocity = 0;
    let tracking = false; // жест может стать перетаскиванием
    let dragging = false; // панель двигается за пальцем
    let offset = 0;
    let suppressClick = false; // клик сразу после перетаскивания мышью

    const setOffset = (dy: number) => {
      offset = dy;
      panel.style.transform = `translateY(${dy}px)`;
      const bd = backdropRef.current;
      if (bd) bd.style.opacity = String(Math.max(0, 1 - dy / Math.max(1, panel.offsetHeight)));
    };

    const begin = (x: number, y: number, target: EventTarget | null) => {
      if (closing || isTextField(target)) return;
      // Контент, прокрученный не до верха, сначала скроллится сам (как в @gorhom/bottom-sheet).
      if (isInsideScrolledContent(target, panel)) return;
      tracking = true;
      dragging = false;
      startX = x;
      startY = y;
      lastY = y;
      lastT = performance.now();
      velocity = 0;
    };

    /** Возвращает true, если событие надо «съесть» (preventDefault). */
    const move = (x: number, y: number): boolean => {
      if (!tracking) return false;
      const dy = y - startY;
      const dx = x - startX;
      if (!dragging) {
        if (Math.abs(dy) < DRAG_SLOP && Math.abs(dx) < DRAG_SLOP) return false;
        // Горизонтальный жест или движение вверх — это не закрытие, отдаём скроллу.
        if (dy <= 0 || Math.abs(dx) > Math.abs(dy)) {
          tracking = false;
          return false;
        }
        dragging = true;
        panel.style.animation = "none";
        panel.style.transition = "none";
        const bd = backdropRef.current;
        if (bd) {
          bd.style.animation = "none";
          bd.style.transition = "none";
        }
      }
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) velocity = (y - lastY) / dt;
      lastY = y;
      lastT = now;
      // Вверх — с сопротивлением, вниз — 1:1
      const next = dy - DRAG_SLOP;
      setOffset(next < 0 ? next / 4 : next);
      return true;
    };

    const end = () => {
      if (!tracking) return;
      tracking = false;
      if (!dragging) return;
      dragging = false;
      suppressClick = true;
      const height = panel.offsetHeight;
      if (offset > height * CLOSE_RATIO || velocity > FLICK_VELOCITY) {
        requestClose();
        return;
      }
      // Возврат на место
      panel.style.transition = `transform ${CLOSE_MS}ms ${EASE}`;
      panel.style.transform = "translateY(0px)";
      const bd = backdropRef.current;
      if (bd) {
        bd.style.transition = `opacity ${CLOSE_MS}ms ease-out`;
        bd.style.opacity = "1";
      }
      offset = 0;
    };

    // Touch (iOS/Android) — non-passive, чтобы гасить скролл/оверскролл во время свайпа
    const onTouchStart = (e: TouchEvent) => {
      suppressClick = false;
      if (e.touches.length !== 1) {
        tracking = false;
        return;
      }
      begin(e.touches[0].clientX, e.touches[0].clientY, e.target);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      if (move(e.touches[0].clientX, e.touches[0].clientY) && e.cancelable) e.preventDefault();
    };
    const onTouchEnd = () => end();

    // Мышь (десктоп) — тянуть можно за любую не прокрученную область
    const onMouseMove = (e: MouseEvent) => {
      if (move(e.clientX, e.clientY)) e.preventDefault();
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      end();
    };
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      suppressClick = false;
      begin(e.clientX, e.clientY, e.target);
      if (!tracking) return;
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };

    // Клик после перетаскивания мышью не должен срабатывать на элементе под курсором
    const onClickCapture = (e: MouseEvent) => {
      if (suppressClick) {
        suppressClick = false;
        e.stopPropagation();
        e.preventDefault();
      }
    };

    panel.addEventListener("touchstart", onTouchStart, { passive: true });
    panel.addEventListener("touchmove", onTouchMove, { passive: false });
    panel.addEventListener("touchend", onTouchEnd);
    panel.addEventListener("touchcancel", onTouchEnd);
    panel.addEventListener("mousedown", onMouseDown);
    panel.addEventListener("click", onClickCapture, true);
    return () => {
      panel.removeEventListener("touchstart", onTouchStart);
      panel.removeEventListener("touchmove", onTouchMove);
      panel.removeEventListener("touchend", onTouchEnd);
      panel.removeEventListener("touchcancel", onTouchEnd);
      panel.removeEventListener("mousedown", onMouseDown);
      panel.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [mounted, closing, requestClose]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        ref={backdropRef}
        className="sheet-backdrop"
        style={{ background: `rgba(0,0,0,${backdrop})` }}
        onClick={requestClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn("sheet-panel", className)}
        style={{
          borderRadius: `${radius}px ${radius}px 0 0`,
          overscrollBehavior: "contain",
          ...(maxHeight ? { maxHeight } : null),
        }}
      >
        {showHandle && <span className="sheet-handle cursor-grab touch-none active:cursor-grabbing" />}
        {children}
      </div>
    </>,
    document.body,
  );
}
