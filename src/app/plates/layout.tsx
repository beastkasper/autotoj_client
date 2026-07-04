import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Гос. номера — autoTOJ",
  description: "Красивые, счастливые и стандартные автомобильные гос. номера Таджикистана. Купить и продать номерные знаки на autoTOJ",
  alternates: { canonical: "https://autotoj.tj/plates" },
};

export default function PlatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
