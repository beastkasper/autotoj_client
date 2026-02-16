"use client";

import { useState } from "react";
import { LegalModal } from "@/components/login/legal-modal";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function TermsCheckbox({ checked, onChange, error }: TermsCheckboxProps) {
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(null);

  return (
    <>
      <div className="mt-5">
        <label className="flex items-start gap-3 cursor-pointer">
          <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`mt-0.5 w-5 h-5 min-w-5 rounded border-2 flex items-center justify-center transition-all duration-150 ${
              checked
                ? "bg-[var(--ios-label)] border-[var(--ios-label)]"
                : "bg-white border-gray-300"
            }`}
          >
            {checked && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6L5 8.5L9.5 4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <span className="text-sm text-[var(--ios-secondary-label)] leading-relaxed">
            Я принимаю{" "}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLegalModal("terms");
              }}
              className="font-semibold text-[var(--ios-label)] hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Правила использования
            </button>{" "}
            и{" "}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLegalModal("privacy");
              }}
              className="font-semibold text-[var(--ios-label)] hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Политику конфиденциальности
            </button>
          </span>
        </label>
        {error && (
          <p className="mt-1.5 text-xs text-[var(--ios-destructive)]">{error}</p>
        )}
      </div>

      {legalModal && (
        <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
      )}
    </>
  );
}
