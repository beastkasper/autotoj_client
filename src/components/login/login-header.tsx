"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginHeader() {
  const pathname = usePathname();
  const isConfirm = pathname === "/login/confirm";

  return (
    <header className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
      {isConfirm ? (
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Link href="/login" aria-label="Назад">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
      ) : (
        <span />
      )}

      <span className="text-base font-medium text-gray-900">
        {isConfirm ? "Подтверждение" : "Вход"}
      </span>

      <Button
        asChild
        variant="ghost"
        size="icon"
        className="rounded-full text-gray-500"
      >
        <Link href="/" aria-label="Закрыть">
          <X className="w-5 h-5" />
        </Link>
      </Button>
    </header>
  );
}
