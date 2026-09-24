import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";
import { PRIVACY_CONTENT } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Конфиденциальность — autoTOJ",
  description: "Политика конфиденциальности сервиса autoTOJ.",
};

export default function PrivacyPage() {
  return <StaticPage doc={PRIVACY_CONTENT} />;
}
