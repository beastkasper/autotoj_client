"use client";

import type { LoginMethod } from "@/lib/validations/auth";

interface LoginTabsProps {
  method: LoginMethod;
  onMethodChange: (method: LoginMethod) => void;
}

export function LoginTabs({ method, onMethodChange }: LoginTabsProps) {
  return (
    <div className="flex gap-4 rounded-full p-[3px] mb-6">
      <button
        type="button"
        onClick={() => onMethodChange("phone")}
        className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
          method === "phone"
            ? "bg-[var(--ios-label)] text-white shadow-sm"
            : "text-[var(--ios-secondary-label)] bg-[var(--ios-bg)] outline outline-[var(--ios-separator)]"
        }`}
      >
        Телефон
      </button>
      <button
        type="button"
        onClick={() => onMethodChange("email")}
        className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
          method === "email"
            ? "bg-[var(--ios-label)] text-white shadow-sm"
            : "text-[var(--ios-secondary-label)] bg-[var(--ios-bg)] outline outline-[var(--ios-separator)]"
        }`}
      >
        Email
      </button>
    </div>
  );
}
