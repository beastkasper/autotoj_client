import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";
import { TERMS_CONTENT } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Условия соглашения — autoTOJ",
  description: "Правила использования сервиса autoTOJ.",
};

export default function TermsPage() {
  return <StaticPage doc={TERMS_CONTENT} />;
}
