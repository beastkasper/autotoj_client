"use client";

import { Fragment, useState } from "react";
import { X, Check, Plus, ChevronDown } from "lucide-react";
import { BottomSheet } from "@/components/layout/bottom-sheet";
import { cn } from "@/lib/utils";

export type BottomSheetOption = string | { id: string; label: string };

interface BottomSheetSelectProps {
  value: string;
  options: BottomSheetOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  allowCustom?: boolean;
  onAddCustom?: () => void;
  customButtonText?: string;
  error?: string;
  title?: string;
}

const optId = (o: BottomSheetOption) => (typeof o === "string" ? o : o.id);
const optLabel = (o: BottomSheetOption) => (typeof o === "string" ? o : o.label);

export function BottomSheetSelect({
  value,
  options,
  onChange,
  placeholder,
  allowCustom,
  onAddCustom,
  customButtonText,
  error,
  title,
}: BottomSheetSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: BottomSheetOption) => {
    onChange(optId(option));
    setIsOpen(false);
  };

  const selectedLabel = (() => {
    if (!value) return "";
    const match = options.find((o) => optId(o) === value);
    return match ? optLabel(match) : value;
  })();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex h-12 w-full flex-row items-center justify-between rounded-[12px] border bg-card px-4 text-left",
          error ? "border-[#E53935]" : "border-border",
        )}
      >
        <span
          className={cn(
            "flex-1 truncate text-[15px] font-normal",
            value ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {selectedLabel || placeholder}
        </span>
        <ChevronDown size={20} strokeWidth={1.5} className="shrink-0 text-foreground" />
      </button>

      <BottomSheet open={isOpen} onClose={() => setIsOpen(false)} maxHeight="80%">
        {/* Options List. Шапка внутри списка: при динамической высоте
            библиотека измеряет только содержимое скроллируемого компонента. */}
        <div
          className="min-h-0 flex-1 overflow-y-auto"
          style={{ paddingBottom: "calc(max(env(safe-area-inset-bottom, 0px), 16px) + 16px)" }}
        >
          <div className="sticky top-0 z-10 flex flex-row items-center justify-between border-b border-border bg-card p-4">
            <div className="w-10" />
            <span className="flex-1 text-center text-[17px] font-semibold text-foreground">
              {title || placeholder || "Выберите значение"}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex size-10 items-center justify-center"
            >
              <X size={24} strokeWidth={1.5} className="text-foreground" />
            </button>
          </div>

          {options.map((item, index) => {
            const id = optId(item);
            const label = optLabel(item);
            return (
              <Fragment key={id}>
                <button
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="flex w-full flex-row items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-[15px] font-normal text-foreground">{label}</span>
                  {value === id && <Check size={20} strokeWidth={2} className="shrink-0 text-foreground" />}
                </button>
                {index < options.length - 1 && <div className="mx-4 h-px bg-border" />}
              </Fragment>
            );
          })}

          {allowCustom && onAddCustom ? (
            <>
              {options.length > 0 && <div className="mx-4 h-px bg-border" />}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onAddCustom();
                }}
                className="flex w-full flex-row items-center gap-2 px-4 py-3 text-left"
              >
                <Plus size={20} strokeWidth={1.5} className="text-foreground" />
                <span className="text-[15px] font-normal text-foreground">
                  {customButtonText || "Добавить"}
                </span>
              </button>
            </>
          ) : null}
        </div>
      </BottomSheet>
    </>
  );
}
