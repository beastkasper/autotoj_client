"use client";

import { useState, useMemo, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X, Search, Check, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type BottomSheetOption = string | { id: string; label: string };

interface BottomSheetSelectProps {
  label: string;
  placeholder?: string;
  value: string;
  options: readonly BottomSheetOption[] | BottomSheetOption[];
  onSelect: (value: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  allowCustom?: boolean;
  customLabel?: string;
  onAddCustom?: (value: string) => void;
  error?: string;
}

function optId(opt: BottomSheetOption): string {
  return typeof opt === "string" ? opt : opt.id;
}

function optLabel(opt: BottomSheetOption): string {
  return typeof opt === "string" ? opt : opt.label;
}

function useIsMobile(breakpoint = 1024) {
  // Use useSyncExternalStore so the initial value reads from
  // window.matchMedia synchronously without a setState-in-effect cascade.
  const subscribe = useCallback((onChange: () => void) => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);
  const getSnapshot = useCallback(
    () => window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches,
    [breakpoint]
  );
  // SSR fallback: assume non-mobile on the server.
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function BottomSheetSelect({
  label,
  placeholder = "Выберите",
  value,
  options,
  onSelect,
  searchable = false,
  searchPlaceholder = "Поиск...",
  allowCustom = false,
  customLabel = "Добавить",
  onAddCustom,
  error,
}: BottomSheetSelectProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const filtered = useMemo(() => {
    if (!search) return [...options];
    const q = search.toLowerCase();
    return [...options].filter((opt) => optLabel(opt).toLowerCase().includes(q));
  }, [options, search]);

  const selectedLabel = useMemo(() => {
    if (!value) return "";
    const match = options.find((opt) => optId(opt) === value);
    return match ? optLabel(match) : value;
  }, [options, value]);

  const handleSelect = (opt: BottomSheetOption) => {
    onSelect(optId(opt));
    setIsOpen(false);
    setSearch("");
  };

  const handleAddCustom = () => {
    if (customValue.trim()) {
      onAddCustom?.(customValue.trim());
      onSelect(customValue.trim());
      setCustomValue("");
      setIsAdding(false);
      setIsOpen(false);
    }
  };

  // Calculate position for portal-based desktop dropdown
  const updateDropdownPosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  // Open handler — recalculate position on open
  const handleTriggerClick = () => {
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  // Recalculate position on scroll/resize when open
  useEffect(() => {
    if (isMobile || !isOpen) return;
    const handleReposition = () => updateDropdownPosition();
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isMobile, isOpen, updateDropdownPosition]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    if (isMobile || !isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  // ── Shared option list ──
  const optionList = (
    <>
      {filtered.map((opt) => {
        const id = optId(opt);
        const label = optLabel(opt);
        const isSelected = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => handleSelect(opt)}
            className={cn(
              "flex w-full items-center justify-between px-4 transition-colors",
              isMobile
                ? "py-3 border-b border-border last:border-b-0"
                : "h-10 text-[14px] border-b border-[#F2F2F7] hover:bg-[#F2F2F7]",
              isSelected && !isMobile ? "bg-[#F2F2F7]" : ""
            )}
          >
            <span
              className={cn(
                "truncate",
                isMobile ? "text-[15px] text-foreground" : "text-[14px]",
                isSelected ? "font-semibold" : "font-normal"
              )}
            >
              {label}
            </span>
            {isSelected && (
              <Check className={cn("shrink-0 text-foreground", isMobile ? "size-5" : "size-4")} strokeWidth={2} />
            )}
          </button>
        );
      })}

      {filtered.length === 0 && (
        <div className="px-4 py-6 text-center text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
          Ничего не найдено
        </div>
      )}

      {/* Add custom */}
      {allowCustom && !isAdding && (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className={cn(
            "flex w-full items-center gap-2 px-4 border-t border-border",
            isMobile ? "h-[52px]" : "h-10"
          )}
        >
          <Plus className={cn("text-foreground", isMobile ? "size-5" : "size-4")} strokeWidth={1.5} />
          <span className={cn("font-medium text-foreground", isMobile ? "text-[16px]" : "text-[14px]")}>
            {customLabel}
          </span>
        </button>
      )}

      {/* Custom input */}
      {isAdding && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-[#E5E5EA]">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Введите значение"
            className={cn(
              "flex-1 px-3 rounded-lg border border-[#C7C7CC] font-[family-name:var(--font-manrope)] outline-none focus:border-black",
              isMobile ? "h-10 text-[15px]" : "h-8 text-[14px]"
            )}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className={cn(
              "px-3 rounded-lg bg-black text-white font-semibold font-[family-name:var(--font-manrope)]",
              isMobile ? "h-10 text-[14px]" : "h-8 text-[13px]"
            )}
          >
            Ок
          </button>
        </div>
      )}
    </>
  );

  // ── Shared search bar ──
  const searchBar = searchable ? (
    <div className={cn("px-4", isMobile ? "py-3" : "py-2 border-b border-[#F2F2F7]")}>
      <div className={cn(
        "flex items-center gap-2 rounded-lg bg-secondary px-3",
        isMobile ? "h-11 rounded-[10px]" : "h-9"
      )}>
        <Search className={cn("text-[#8E8E93] shrink-0", isMobile ? "w-5 h-5" : "w-4 h-4")} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className={cn(
            "flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
            isMobile ? "text-[16px]" : "text-[14px]"
          )}
          autoFocus={!isMobile}
        />
        {search && (
          <button type="button" onClick={() => setSearch("")} className="p-0.5">
            <X className="w-3.5 h-3.5 text-[#8E8E93]" />
          </button>
        )}
      </div>
    </div>
  ) : null;

  // ── Desktop dropdown (portaled to body) ──
  const desktopDropdown =
    !isMobile && isOpen
      ? createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] bg-white border border-[#D1D1D6] rounded-xl shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
            }}
          >
            {searchBar}
            <div className="max-h-[280px] overflow-y-auto overscroll-contain">
              {optionList}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div>
      {/* Label */}
      <label className="mb-1.5 block text-[13px] text-muted-foreground">
        {label}
      </label>

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-xl border bg-card px-4 transition-colors",
          error ? "border-[#E53935]" : isOpen && !isMobile ? "border-foreground ring-1 ring-foreground" : "border-border",
          isMobile ? "active:bg-secondary" : "hover:border-[#8E8E93]"
        )}
      >
        <span
          className={cn(
            "truncate text-[15px]",
            value ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "ml-2 size-5 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && !isMobile && "rotate-180"
          )}
        />
      </button>

      {/* Error */}
      {error && (
        <p className="mt-1 text-[12px] text-[#E53935] font-[family-name:var(--font-manrope)]">
          {error}
        </p>
      )}

      {/* ── MOBILE: Bottom Sheet ── */}
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent
            side="bottom"
            className="flex max-h-[70vh] flex-col rounded-t-[24px] p-0"
          >
            <SheetHeader className="hairline p-0">
              <div className="flex items-center justify-between p-4">
                <span className="w-10 shrink-0" aria-hidden />
                <SheetTitle className="screen-title flex-1 text-center text-foreground">
                  {label}
                </SheetTitle>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setSearch("");
                  }}
                  aria-label="Закрыть"
                  className="icon-btn shrink-0"
                >
                  <X className="size-5" strokeWidth={1.5} />
                </button>
              </div>
            </SheetHeader>

            {searchBar}

            <ScrollArea className="flex-1">
              <div>{optionList}</div>
              <div className="h-8" />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}

      {/* ── DESKTOP: Portal dropdown ── */}
      {desktopDropdown}
    </div>
  );
}
