"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TERMS_CONTENT, PRIVACY_CONTENT } from "@/lib/data/legal";

interface LegalModalProps {
  type: "terms" | "privacy";
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const content = type === "terms" ? TERMS_CONTENT : PRIVACY_CONTENT;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center gap-3 px-5 py-4 border-b border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <DialogTitle className="text-base font-medium text-gray-900">
            {content.title}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-xl font-bold text-[var(--ios-label)] mb-4">
            {content.title}
          </h2>

          {content.sections.map((section, i) => (
            <div key={i} className="mb-6">
              <h3 className="text-base font-semibold text-[var(--ios-label)] mb-2">
                {section.heading}
              </h3>
              <p className="text-sm text-[#333] leading-relaxed whitespace-pre-line">
                {section.text}
              </p>
            </div>
          ))}

          <p className="text-xs text-gray-400 mt-8">
            Последнее обновление: 10 января 2026
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
