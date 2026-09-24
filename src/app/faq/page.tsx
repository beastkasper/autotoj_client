import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";
import { FAQ_CONTENT } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Помощь — autoTOJ",
  description: "Ответы на частые вопросы о работе сервиса autoTOJ.",
};

export default function FaqPage() {
  return <StaticPage doc={FAQ_CONTENT} />;
}
