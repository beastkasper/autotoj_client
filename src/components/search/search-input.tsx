"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  variant?: "desktop" | "mobile";
}

/** Поиск в запчастях / прокате (§6.3): h44 r12 bg secondary, иконка слева на 12. */
export function SearchInput({
  value,
  onChange,
  placeholder,
  variant = "desktop",
}: SearchInputProps) {
  if (variant === "mobile") {
    return (
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl bg-secondary pl-10 pr-10 text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Очистить"
            className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground"
          >
            <span className="text-sm">&#10005;</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-10 items-center gap-2 rounded-xl bg-[#F5F5F7] px-4">
      <Search className="size-5 shrink-0 text-[#8E8E93]" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 flex-1 border-none bg-transparent px-0 text-[15px] text-[#111111] shadow-none placeholder:text-[#8E8E93] focus-visible:ring-0"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="rounded-lg p-1 transition-colors hover:bg-[#E5E5E7]"
        >
          <span className="text-xs text-[#8E8E93]">&#10005;</span>
        </button>
      )}
    </div>
  );
}
