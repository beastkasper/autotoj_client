"use client";

import { cn } from "@/lib/utils";

interface PlateNumberProps {
  /** Tajik plate number, e.g. "1234AA01". */
  plateNumber: string;
  size?: "sm" | "lg";
  className?: string;
}

const SIZES = {
  sm: {
    box: "h-12 gap-2 px-2",
    flag: "w-5",
    tj: "text-[7px]",
    number: "text-[18px] tracking-[0.1em]",
    region: "text-[14px]",
  },
  lg: {
    box: "h-24 gap-5 px-6",
    flag: "w-11",
    tj: "text-[13px]",
    number: "text-[44px] tracking-[0.14em]",
    region: "text-[30px]",
  },
} as const;

/**
 * Renders a Tajik license plate: a white box with a 3px black border, the
 * Tajikistan flag + "TJ" on the left and the number on the right. The flag is
 * built from plain divs (no image asset).
 */
export function PlateNumber({ plateNumber, size = "sm", className }: PlateNumberProps) {
  const s = SIZES[size];
  const match = /^(\d{3,4})\s*([A-Za-z]{2})\s*(\d{2})$/.exec(plateNumber.trim());
  const digits = match ? match[1] : plateNumber;
  const letters = match ? match[2].toUpperCase() : "";
  const region = match ? match[3] : "";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border-[3px] border-[#111111] bg-white",
        s.box,
        className,
      )}
    >
      {/* ── Tajikistan flag + TJ ── */}
      <div className={cn("flex flex-col items-center shrink-0", s.flag)}>
        <div
          className="w-full overflow-hidden rounded-[2px] border border-[#E5E5E7]"
          style={{ aspectRatio: "4 / 3" }}
        >
          <div className="h-[30%] bg-[#CE1126]" />
          <div className="flex h-[40%] items-center justify-center bg-[#FFFFFF]">
            <div className="h-[34%] w-[55%] rounded-[1px] bg-[#F8C300]" />
          </div>
          <div className="h-[30%] bg-[#006600]" />
        </div>
        <span
          className={cn(
            "mt-0.5 font-bold leading-none text-[#111111] font-[family-name:var(--font-manrope)]",
            s.tj,
          )}
        >
          TJ
        </span>
      </div>

      {/* ── Number ── */}
      <span
        className={cn(
          "font-bold leading-none text-[#111111] font-[family-name:var(--font-manrope)]",
          s.number,
        )}
      >
        {digits}
        {letters && <span className="ml-[0.15em]">{letters}</span>}
      </span>

      {/* ── Region code ── */}
      {region && (
        <>
          <div className="h-[55%] w-px self-center bg-[#111111]/15" />
          <span
            className={cn(
              "font-bold leading-none text-[#111111] font-[family-name:var(--font-manrope)]",
              s.region,
            )}
          >
            {region}
          </span>
        </>
      )}
    </div>
  );
}
