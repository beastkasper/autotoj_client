import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Страница не найдена — autoTOJ",
};

/**
 * Собственная 404. Раньше показывалась стандартная английская страница Next.js
 * («This page could not be found») без единой ссылки обратно в приложение.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-[64px] font-extrabold leading-none text-[#E53935] font-[family-name:var(--font-manrope)]">
        404
      </p>
      <h1 className="mt-4 text-[22px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
        Страница не найдена
      </h1>
      <p className="mt-2 max-w-96 text-[15px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
        Возможно, объявление снято с публикации или ссылка устарела.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex h-11 items-center rounded-xl bg-[#111111] px-5 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
        >
          На главную
        </Link>
        <Link
          href="/parts"
          className="flex h-11 items-center rounded-xl bg-[#F2F2F7] px-5 text-[15px] font-medium text-[#111111] transition-colors hover:bg-[#E5E5EA]"
        >
          Запчасти
        </Link>
        <Link
          href="/faq"
          className="flex h-11 items-center rounded-xl bg-[#F2F2F7] px-5 text-[15px] font-medium text-[#111111] transition-colors hover:bg-[#E5E5EA]"
        >
          Помощь
        </Link>
      </div>
    </main>
  );
}
