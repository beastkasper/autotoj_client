"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
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

interface BottomSheetSelectProps {
  label: string;
  placeholder?: string;
  value: string;
  options: readonly string[] | string[];
  onSelect: (value: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  allowCustom?: boolean;
  customLabel?: string;
  onAddCustom?: (value: string) => void;
  error?: string;
}

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
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
    return [...options].filter((opt) => opt.toLowerCase().includes(q));
  }, [options, search]);

  const handleSelect = (opt: string) => {
    onSelect(opt);
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
      {filtered.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => handleSelect(opt)}
          className={cn(
            "flex items-center justify-between w-full px-4 border-b border-[#F2F2F7] transition-colors",
            isMobile ? "h-[52px]" : "h-10 text-[14px] hover:bg-[#F2F2F7]",
            value === opt ? "bg-[#F2F2F7]" : ""
          )}
        >
          <span
            className={cn(
              "font-[family-name:var(--font-manrope)] truncate",
              isMobile ? "text-[15px]" : "text-[14px]",
              value === opt ? "font-semibold" : "font-normal"
            )}
          >
            {opt}
          </span>
          {value === opt && (
            <Check className={cn("shrink-0 text-[#111111]", isMobile ? "w-5 h-5" : "w-4 h-4")} />
          )}
        </button>
      ))}

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
            "flex items-center gap-2 w-full px-4 border-t border-[#E5E5EA]",
            isMobile ? "h-[52px]" : "h-10"
          )}
        >
          <Plus className={cn("text-[#D32F2F]", isMobile ? "w-5 h-5" : "w-4 h-4")} />
          <span className={cn("font-semibold text-[#D32F2F] font-[family-name:var(--font-manrope)]", isMobile ? "text-[15px]" : "text-[14px]")}>
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
        "flex items-center gap-2 px-3 rounded-lg bg-[#F2F2F7]",
        isMobile ? "h-12 rounded-xl" : "h-9"
      )}>
        <Search className={cn("text-[#8E8E93] shrink-0", isMobile ? "w-5 h-5" : "w-4 h-4")} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className={cn(
            "flex-1 bg-transparent outline-none font-[family-name:var(--font-manrope)] placeholder:text-[#8E8E93]",
            isMobile ? "text-[15px]" : "text-[14px]"
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
      <label className="block text-[13px] text-[#8E8E93] mb-1.5 font-[family-name:var(--font-manrope)]">
        {label}
      </label>

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        className={cn(
          "flex items-center justify-between w-full h-12 px-4 rounded-xl border bg-white transition-colors",
          error ? "border-[#E53935]" : isOpen && !isMobile ? "border-[#111111] ring-1 ring-[#111111]" : "border-[#C7C7CC]",
          isMobile ? "active:bg-[#F2F2F7]" : "hover:border-[#8E8E93]"
        )}
      >
        <span
          className={cn(
            "text-[15px] font-[family-name:var(--font-manrope)] truncate",
            value ? "text-[#000000]" : "text-[#8E8E93]"
          )}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-[#8E8E93] shrink-0 ml-2 transition-transform duration-200",
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
            className="rounded-t-[20px] max-h-[70vh] flex flex-col p-0"
          >
            <SheetHeader className="px-4 pt-4 pb-0 border-b border-[#E5E5EA]">
              <div className="flex items-center justify-between pb-4">
                <SheetTitle className="text-[17px] font-semibold text-[#000000] font-[family-name:var(--font-manrope)]">
                  {label}
                </SheetTitle>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="flex items-center justify-center w-8 h-8"
                >
                  <X className="w-5 h-5 text-[#1C1C1E]" />
                </button>
              </div>
            </SheetHeader>

            {searchBar}

            <ScrollArea className="flex-1">
              <div>{optionList}</div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}

      {/* ── DESKTOP: Portal dropdown ── */}
      {desktopDropdown}
    </div>
  );
}
