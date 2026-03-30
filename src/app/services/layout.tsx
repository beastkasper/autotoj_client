import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Автосервисы и услуги",
  description: "Автосервисы, шиномонтаж, автомойки, страхование и другие автоуслуги в Таджикистане на autoTOJ",
  alternates: { canonical: "https://autotoj.tj/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
