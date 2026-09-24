import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";
import { ABOUT_CONTENT } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "О приложении — autoTOJ",
  description: "autoTOJ — автомобильный маркетплейс Таджикистана: авто, запчасти, прокат, гос. номера и автосервисы.",
};

export default function AboutPage() {
  return <StaticPage doc={ABOUT_CONTENT} />;
}
