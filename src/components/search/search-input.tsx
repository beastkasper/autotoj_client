"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  variant?: "desktop" | "mobile";
}

export function SearchInput({ value, onChange, placeholder, variant = "desktop" }: SearchInputProps) {
  const isDesktop = variant === "desktop";
  return (
    <div className={`flex items-center gap-2 ${
      isDesktop
        ? "bg-[#F5F5F7] rounded-xl px-4 h-10"
        : "bg-white rounded-2xl border border-[#E5E5E7] px-4 h-12"
    }`}>
      <Search className="w-5 h-5 text-[#8E8E93] shrink-0" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 bg-transparent border-none shadow-none text-[15px] text-[#111111] placeholder:text-[#8E8E93] focus-visible:ring-0 font-[family-name:var(--font-manrope)] ${
          isDesktop ? "h-10" : "h-12"
        } px-0`}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className={`p-1 ${isDesktop ? "hover:bg-[#E5E5E7] rounded-lg transition-colors" : ""}`}
        >
          <span className={`text-[#8E8E93] ${isDesktop ? "text-xs" : "text-sm"}`}>&#10005;</span>
        </button>
      )}
    </div>
  );
}
