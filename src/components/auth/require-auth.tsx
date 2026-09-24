"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EmptyState } from "@/components/states/EmptyState";

/**
 * Обёртка приватной страницы.
 *
 * Раньше /post-ad, /my-ads, /favorites и /profile/edit открывались гостю по
 * прямой ссылке: страница либо показывала «Нет объявлений» после пары 401,
 * либо оставалась пустой. Каждый такой 401 вдобавок запускал попытку
 * POST /auth/refresh в baseQuery.
 */
export function RequireAuth({
  children,
  title = "Войдите в аккаунт",
  description = "Эта страница доступна только авторизованным пользователям",
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  const router = useRouter();
  const { hydrated, token } = useAuth();

  // До гидратации сервер и клиент обязаны отрисовать одно и то же: на сервере
  // localStorage недоступен, и решение о доступе принять нельзя. Раньше здесь
  // сразу читался token, из-за чего React ругался на несовпадение разметки.
  if (!hydrated) {
    return (
      <main className="screen flex min-h-[50vh] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      </main>
    );
  }

  if (!token) {
    return (
      <main className="screen">
        <EmptyState
          icon={LogIn}
          title={title}
          description={description}
          action={{ label: "Войти", onClick: () => router.push("/login") }}
        />
      </main>
    );
  }

  return <>{children}</>;
}
