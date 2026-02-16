"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LoginHeader() {
  const pathname = usePathname();
  const isConfirm = pathname === "/login/confirm";

  return (
    <header className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
      {isConfirm ? (
        <Link
          href="/login"
          aria-label="Назад"
          className="flex items-center justify-center w-8 h-8 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
      ) : (
        <span />
      )}

      <span className="text-base font-medium text-gray-900">
        {isConfirm ? "Подтверждение" : "Вход"}
      </span>

      <Link
        href="/"
        aria-label="Закрыть"
        className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </Link>
    </header>
  );
}
