"use client";

import { TERMS_CONTENT, PRIVACY_CONTENT } from "@/lib/data/legal";

interface LegalModalProps {
  type: "terms" | "privacy";
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const content = type === "terms" ? TERMS_CONTENT : PRIVACY_CONTENT;

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 flex items-center gap-3 px-5 py-4 border-b border-gray-200 bg-white z-10">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Назад"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <span className="text-base font-medium text-gray-900">
          {content.title}
        </span>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-xl font-bold text-[var(--ios-label)] mb-4">{content.title}</h2>

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
    </div>
  );
}
