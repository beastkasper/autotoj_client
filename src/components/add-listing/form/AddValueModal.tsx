"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { BottomSheet } from "@/components/layout/bottom-sheet";
import { cn } from "@/lib/utils";

interface AddValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (value: string) => void;
  title: string;
  placeholder?: string;
  buttonText?: string;
}

export function AddValueModal({
  isOpen,
  onClose,
  onAdd,
  title,
  placeholder = "Введите значение",
  buttonText = "Добавить",
}: AddValueModalProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
      onClose();
    }
  };

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  const enabled = !!inputValue.trim();

  return (
    <BottomSheet open={isOpen} onClose={handleClose} maxHeight="85%">
      <div style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)" }}>
        <div className="px-6 pt-2 pb-2">
          {/* Header */}
          <div className="mb-4 flex flex-row items-center justify-between">
            <span className="text-[18px] font-semibold text-foreground">{title}</span>
            <button
              type="button"
              onClick={handleClose}
              className="flex size-6 items-center justify-center"
            >
              <X size={24} strokeWidth={1.5} className="text-foreground" />
            </button>
          </div>

          {/* Input */}
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            className="block h-12 w-full rounded-[12px] border border-border bg-background px-4 text-[15px] font-normal text-foreground outline-none placeholder:text-muted-foreground"
          />

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={!enabled}
            className={cn(
              "mt-4 flex h-12 w-full items-center justify-center rounded-[12px]",
              enabled ? "bg-foreground" : "bg-muted",
            )}
          >
            <span
              className={cn(
                "text-[16px] font-semibold",
                enabled ? "text-background" : "text-muted-foreground",
              )}
            >
              {buttonText}
            </span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
