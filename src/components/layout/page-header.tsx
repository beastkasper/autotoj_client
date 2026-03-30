"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function PageHeader({ title, onBack, rightAction }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E7]">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack ?? (() => router.back())}
            className="w-10 h-10 rounded-full flex items-center justify-center -ml-2 hover:bg-[#F2F2F7] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#111111]" />
          </button>
          <h1 className="text-[17px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
            {title}
          </h1>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </div>
  );
}
