import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import StoreProvider from "@/components/providers/StoreProvider";
import { DesktopHeader } from "@/components/header/DesktopHeader";
import { MobileBottomNav } from "@/components/header/MobileBottomNav";
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
  title: {
    default: "autoTOJ — покупка, продажа и сервисы автомобилей",
    template: "%s | autoTOJ",
  },
  description: "autoTOJ — площадка для покупки и продажи автомобилей, запчастей, аренды авто и автосервисов в Таджикистане",
  metadataBase: new URL("https://autotoj.tj"),
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://autotoj.tj",
    siteName: "autoTOJ",
    title: "autoTOJ — покупка, продажа и сервисы автомобилей",
    description: "Площадка для покупки и продажи автомобилей, запчастей, аренды авто и автосервисов в Таджикистане",
  },
  twitter: {
    card: "summary_large_image",
    title: "autoTOJ — покупка, продажа и сервисы автомобилей",
    description: "Площадка для покупки и продажи автомобилей, запчастей, аренды авто и автосервисов в Таджикистане",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://autotoj.tj",
  },
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "autoTOJ",
                url: "https://autotoj.tj",
                logo: "https://autotoj.tj/icon.svg",
                sameAs: [],
              }),
            }}
          />
          <DesktopHeader />
          {children}
          <MobileBottomNav />
          <DesktopFooter />
        </StoreProvider>
      </body>
    </html>
  );
}

