import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Бортжурнал — записи автовладельцев",
  description: "Бортжурнал autoTOJ — записи о ремонте, тюнинге, путешествиях и обслуживании автомобилей",
  alternates: { canonical: "https://autotoj.tj/logbook" },
};

export default function LogbookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
