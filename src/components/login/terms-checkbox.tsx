"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms-agreement"
            checked={checked}
            onCheckedChange={(val) => onChange(val === true)}
            className="mt-0.5 data-[state=checked]:bg-[var(--ios-label)] data-[state=checked]:border-[var(--ios-label)]"
          />
          <Label
            htmlFor="terms-agreement"
            className="text-sm text-[var(--ios-secondary-label)] leading-relaxed font-normal cursor-pointer"
          >
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
          </Label>
        </div>
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
