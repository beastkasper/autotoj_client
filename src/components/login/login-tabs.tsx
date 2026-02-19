"use client";

import type { LoginMethod } from "@/lib/validations/auth";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LoginTabsProps {
  method: LoginMethod;
  onMethodChange: (method: LoginMethod) => void;
}

export function LoginTabs({ method, onMethodChange }: LoginTabsProps) {
  return (
    <Tabs
      value={method}
      onValueChange={(v) => onMethodChange(v as LoginMethod)}
      className="mb-6"
    >
      <TabsList className="w-full rounded-full h-auto p-[3px] bg-[var(--ios-bg)]">
        <TabsTrigger
          value="phone"
          className="flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200 data-[state=active]:bg-[var(--ios-label)] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-[var(--ios-secondary-label)]"
        >
          Телефон
        </TabsTrigger>
        <TabsTrigger
          value="email"
          className="flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200 data-[state=active]:bg-[var(--ios-label)] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-[var(--ios-secondary-label)]"
        >
          Email
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
