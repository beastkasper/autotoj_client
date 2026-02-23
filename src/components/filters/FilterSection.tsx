"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FilterSectionProps {
  value: string;
  title: string;
  children: React.ReactNode;
}

export function FilterSection({ value, title, children }: FilterSectionProps) {
  return (
    <AccordionItem value={value} className="border-b-0">
      <div className="bg-[#F5F5F7] rounded-xl px-4">
        <AccordionTrigger className="py-3.5 hover:no-underline">
          <span className="text-[15px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
            {title}
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-4 pt-0">{children}</AccordionContent>
      </div>
    </AccordionItem>
  );
}
