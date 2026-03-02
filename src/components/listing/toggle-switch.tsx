"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  infoText?: string;
}

export function ToggleSwitch({
  label,
  checked,
  onChange,
  infoText,
}: ToggleSwitchProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between h-12 px-4 rounded-xl border border-[#D0D0D0] bg-white">
        <div className="flex items-center gap-2">
          <span className="text-[15px] text-[#1C1C1E] font-[family-name:var(--font-manrope)]">
            {label}
          </span>
          {infoText && (
            <button
              type="button"
              onClick={() => setShowInfo(true)}
              className="flex items-center justify-center"
            >
              <Info className="w-5 h-5 text-[#8E8E93]" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className="relative shrink-0 rounded-full transition-colors duration-200 overflow-hidden"
          style={{
            width: 51,
            height: 31,
            backgroundColor: checked ? "#1C1C1E" : "#D1D1D6",
          }}
        >
          <span
            className="absolute rounded-full bg-white transition-all duration-200"
            style={{
              width: 27,
              height: 27,
              top: 2,
              left: checked ? 22 : 2,
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          />
        </button>
      </div>

      {/* Info modal */}
      {showInfo && infoText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl mx-6 p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[17px] font-semibold font-[family-name:var(--font-manrope)]">
                {label}
              </h3>
              <button type="button" onClick={() => setShowInfo(false)}>
                <X className="w-5 h-5 text-[#8E8E93]" />
              </button>
            </div>
            <p className="text-[15px] text-[#3C3C43] leading-relaxed font-[family-name:var(--font-manrope)]">
              {infoText}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
