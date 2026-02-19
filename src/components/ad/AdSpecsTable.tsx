"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SpecItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

interface AdSpecsTableProps {
  specs: SpecItem[];
  title?: string;
}

export function AdSpecsTable({ specs, title = "Характеристики" }: AdSpecsTableProps) {
  if (specs.length === 0) return null;

  return (
    <Card className="rounded-2xl border-[#E5E5E7] shadow-none overflow-hidden py-0">
      <CardContent className="p-0">
        <h2 className="text-[16px] font-semibold text-[#111111] px-6 pt-5 pb-2 font-[family-name:var(--font-manrope)]">
          {title}
        </h2>
        <div>
          {specs.map((spec, i) => (
            <div key={i}>
              <div className="flex items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <spec.icon className="w-4 h-4 text-[#8E8E93]" />
                  <span className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                    {spec.label}
                  </span>
                </div>
                <span className="text-[14px] font-medium text-[#111111] font-[family-name:var(--font-manrope)]">
                  {spec.value}
                </span>
              </div>
              {i < specs.length - 1 && <Separator className="bg-[#F2F2F7]" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
