import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Аренда автомобилей в Таджикистане",
  description: "Аренда автомобилей в Душанбе и других городах Таджикистана. Эконом, комфорт и бизнес класс на autoTOJ",
  alternates: { canonical: "https://autotoj.tj/rental" },
};

export default function RentalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
