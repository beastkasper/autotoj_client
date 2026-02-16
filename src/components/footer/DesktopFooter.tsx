"use client";

import { Instagram, Send, MessageCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function DesktopFooter() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide footer on auth pages
  if (pathname.startsWith("/login")) return null;

  const handleNavigate = (page: "about" | "terms" | "privacy" | "faq") => {
    router.push(`/${page}`);
  };

  return (
    <footer className="hidden md:block bg-white border-t border-[#E5E5E7] mt-16">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Logo and Description */}
          <div className="text-center">
            <h3
              className="text-[20px] font-bold text-[#111111] mb-2"
              style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
            >
              autoTOJ
            </h3>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleNavigate("about")}
              className="text-[14px] text-[#111111] hover:text-[#8E8E93] transition-colors font-medium bg-transparent border-none cursor-pointer"
              style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
            >
              О приложении
            </button>

            <div className="w-px h-4 bg-[#E5E5E7]" />

            <button
              onClick={() => handleNavigate("terms")}
              className="text-[14px] text-[#111111] hover:text-[#8E8E93] transition-colors font-medium bg-transparent border-none cursor-pointer"
              style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
            >
              Условия соглашения
            </button>

            <div className="w-px h-4 bg-[#E5E5E7]" />

            <button
              onClick={() => handleNavigate("privacy")}
              className="text-[14px] text-[#111111] hover:text-[#8E8E93] transition-colors font-medium bg-transparent border-none cursor-pointer"
              style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
            >
              Конфиденциальность
            </button>

            <div className="w-px h-4 bg-[#E5E5E7]" />

            <button
              onClick={() => handleNavigate("faq")}
              className="text-[14px] text-[#111111] hover:text-[#8E8E93] transition-colors font-medium bg-transparent border-none cursor-pointer"
              style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
            >
              Помощь
            </button>
          </div>

          {/* Social Networks */}
          <div className="flex flex-col items-center gap-3">
            <p
              className="text-[13px] text-[#8E8E93]"
              style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
            >
              Мы в социальных сетях
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/autotoj"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5E7] flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5 text-[#111111]" />
              </a>
              <a
                href="https://t.me/autotoj"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5E7] flex items-center justify-center transition-colors"
              >
                <Send className="w-5 h-5 text-[#111111]" />
              </a>
              <a
                href="https://wa.me/992000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5E7] flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-[#111111]" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <p
            className="text-[12px] text-[#C7C7CC]"
            style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
          >
            © 2026 autoTOJ. Все права защищены
          </p>
        </div>
      </div>
    </footer>
  );
}
