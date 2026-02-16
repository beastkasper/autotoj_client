import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import StoreProvider from "@/components/providers/StoreProvider";
import { DesktopHeader } from "@/components/header/DesktopHeader";
import { DesktopFooter } from "@/components/footer/DesktopFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "autoTOJ",
  description: "autoTOJ — автоматизация для вашего бизнеса",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} antialiased`}
      >
        <StoreProvider>
          <DesktopHeader />
          {children}
          <DesktopFooter />
        </StoreProvider>
      </body>
    </html>
  );
}

