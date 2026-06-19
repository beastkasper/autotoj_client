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
      <TabsList className="w-full h-auto gap-3 p-0 bg-transparent">
        <TabsTrigger
          value="phone"
          className="flex-1 py-3.5 rounded-full text-[15px] font-semibold transition-all duration-200 data-[state=active]:bg-[var(--ios-label)] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-[var(--ios-label)] data-[state=inactive]:border data-[state=inactive]:border-[#E5E5E7] data-[state=inactive]:shadow-sm"
        >
          Телефон
        </TabsTrigger>
        <TabsTrigger
          value="email"
          className="flex-1 py-3.5 rounded-full text-[15px] font-semibold transition-all duration-200 data-[state=active]:bg-[var(--ios-label)] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-[var(--ios-label)] data-[state=inactive]:border data-[state=inactive]:border-[#E5E5E7] data-[state=inactive]:shadow-sm"
        >
          Email
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
