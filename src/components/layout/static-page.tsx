"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { LegalDocument } from "@/lib/data/legal";

/**
 * Каркас статической страницы (о приложении, условия, конфиденциальность, помощь).
 * Раньше все четыре ссылки в футере вели в 404.
 */
export function StaticPage({ doc }: { doc: LegalDocument }) {
  const router = useRouter();

  return (
    <main className="screen bg-white lg:bg-[#F5F5F7]">
      <div className="mx-auto max-w-[760px] px-4 py-6 lg:px-6 lg:py-10">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-[15px] text-[#8E8E93] transition-colors hover:text-[#111111] font-[family-name:var(--font-manrope)]"
        >
          <ArrowLeft className="size-4" />
          Назад
        </button>

        <article className="rounded-2xl bg-white p-6 lg:border lg:border-[#E5E5E7] lg:p-8">
          <h1 className="mb-6 text-[26px] font-bold text-[#111111] font-[family-name:var(--font-manrope)] lg:text-[32px]">
            {doc.title}
          </h1>

          <div className="space-y-6">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-2 text-[17px] font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">
                  {section.heading}
                </h2>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#3A3A3C] font-[family-name:var(--font-manrope)]">
                  {section.text}
                </p>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
