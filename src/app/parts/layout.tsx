import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Запчасти для авто — купить б/у и новые",
  description: "Купить автозапчасти в Таджикистане. Новые и б/у запчасти: шины, диски, двигатели, кузов и другое на autoTOJ",
  alternates: { canonical: "https://autotoj.tj/parts" },
};

export default function PartsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
