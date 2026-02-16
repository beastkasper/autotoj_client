import type { Metadata } from "next";
import { LoginHeader } from "@/components/login/login-header";

export const metadata: Metadata = {
  title: "Вход — autoTOJ",
  description: "Войдите в autoTOJ по номеру телефона или email",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="login-root" data-theme="light">
      <LoginHeader />

      {/* Content */}
      <main className="flex-1 flex flex-col items-center bg-[#fff]">
        {children}
      </main>
    </div>
  );
}
