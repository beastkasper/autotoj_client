"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { DesktopPageHeader } from "@/components/layout/desktop-page-header";
import { EmptyState } from "@/components/states/EmptyState";
import { ImageWithFallback } from "@/components/cards/ImageWithFallback";
import { useAuth } from "@/hooks/useAuth";
import { useGetChatsQuery } from "@/lib/features/chats/chatsApi";
import { formatChatListTime } from "@/lib/utils/chatTime";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { ChatListItem } from "@/lib/types/api";

export default function MessagesPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const { data, isLoading, isError, refetch } = useGetChatsQuery(undefined, {
    skip: !token,
  });

  const handleChatClick = useCallback(
    (chatId: string) => router.push(`/messages/${chatId}`),
    [router],
  );

  const chats = data?.chats ?? [];

  return (
    <main className="screen lg:min-h-screen lg:bg-[#F5F5F7] lg:pb-12">
      {/* Шапка: «Сообщения» 20/600 по центру + hairline (§7.2 B) */}
      <PageHeader
        title="Сообщения"
        variant="center"
        titleClass="text-[20px] leading-[26px]"
      />
      <DesktopPageHeader
        title="Сообщения"
        subtitle="Ваши диалоги с продавцами и покупателями"
      />

      {!isAuthenticated && (
        <EmptyState
          icon={MessageCircle}
          title="Войдите, чтобы видеть переписку"
          description="Список диалогов появится здесь после входа"
          action={{ label: "Войти", onClick: () => router.push("/login") }}
        />
      )}

      {/* Загрузка — строки h72 с кругом 40 (§9.3) */}
      {isAuthenticated && isLoading && (
        <div className="lg:mx-auto lg:max-w-[1000px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex h-[72px] items-center gap-3 px-4">
              <div className="skeleton size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3.5 w-3/5" />
                <div className="skeleton h-3 w-2/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ошибка (§9.2 — в списке чатов вариант попроще) */}
      {isAuthenticated && isError && (
        <div className="px-4 py-16 text-center">
          <div className="mb-3 text-[40px] leading-none">⚠️</div>
          <p className="mb-4 text-[15px] font-medium text-foreground">
            Не удалось загрузить сообщения
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="btn h-11 rounded-[20px] border border-border px-6 text-[15px] font-medium text-foreground"
          >
            Повторить
          </button>
        </div>
      )}

      {/* Пусто (§10.9) */}
      {isAuthenticated && !isLoading && !isError && chats.length === 0 && (
        <div className="px-8 py-24 text-center">
          <MessageCircle
            className="mx-auto size-12 text-muted-foreground"
            strokeWidth={1.5}
          />
          <p className="mb-2 mt-4 text-[16px] font-medium text-foreground">
            Нет сообщений
          </p>
          <p className="text-[14px] text-muted-foreground">
            Здесь будут ваши чаты с продавцами и поддержкой
          </p>
        </div>
      )}

      {isAuthenticated && chats.length > 0 && (
        <>
          {/* ── Мобилка: строки h72 с разделителем со сдвигом 68 ── */}
          <div className="lg:hidden">
            <p className="px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.5px] text-muted-foreground">
              Чаты
            </p>
            {chats.map((chat) => (
              <ChatRow
                key={chat.id}
                chat={chat}
                onClick={() => handleChatClick(chat.id)}
              />
            ))}
          </div>

          {/* ── Desktop ── */}
          <div className="mx-auto hidden space-y-3 px-6 py-4 lg:block lg:max-w-[1000px]">
            {chats.map((chat) => (
              <DesktopChatRow
                key={chat.id}
                chat={chat}
                onClick={() => handleChatClick(chat.id)}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

interface ChatRowProps {
  chat: ChatListItem;
  onClick: () => void;
}

/** Строка чата (§10.9): h72, px16 py12 gap12, аватар 40 с инициалом. */
function ChatRow({ chat, onClick }: ChatRowProps) {
  const last = chat.last_message;
  const unread = chat.unread_count > 0;
  const previewPrefix = last?.is_mine ? "Вы: " : "";
  const previewText = last?.text ?? "Нет сообщений";

  return (
    <button
      type="button"
      onClick={onClick}
      className="press-row flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
    >
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-muted">
        {chat.partner.avatar ? (
          <img
            src={chat.partner.avatar}
            alt={chat.partner.name}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-[16px] font-medium text-[#6B7280]">
            {chat.partner.name.charAt(0).toUpperCase()}
          </span>
        )}
      </span>

      <span className="min-w-0 flex-1 border-b border-border pb-3 -mb-3">
        <span className="flex items-center justify-between gap-2">
          <span className="line-1 text-[15px] font-medium text-foreground">
            {chat.partner.name}
          </span>
          <span className="shrink-0 text-[12px] text-muted-foreground">
            {formatChatListTime(chat.updated_at)}
          </span>
        </span>
        <span className="line-1 mt-0.5 block text-[13px] text-[#6B7280]">
          {chat.ad.title}
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-2">
          <span className="line-1 text-[14px] text-[#3A3A3C] dark:text-muted-foreground">
            {previewPrefix}
            {previewText}
          </span>
          {unread && (
            <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-[#E53935] text-[11px] font-semibold text-white">
              {chat.unread_count > 9 ? "9+" : chat.unread_count}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

/** Десктопная карточка диалога — прежний вид. */
function DesktopChatRow({ chat, onClick }: ChatRowProps) {
  const last = chat.last_message;
  const unread = chat.unread_count > 0;
  const previewPrefix = last?.is_mine ? "Вы: " : "";
  const previewText = last?.text ?? "Нет сообщений";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left transition-all hover:bg-[#FAFAFA]"
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#F2F2F7]">
        <ImageWithFallback
          src={chat.ad.photo}
          alt={chat.ad.title}
          className="size-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[15px] font-semibold text-[#111111]">
            {chat.partner.name}
          </span>
          <span className="shrink-0 text-[12px] text-[#8E8E93]">
            {formatChatListTime(chat.updated_at)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[13px] text-[#8E8E93]">
          {chat.ad.title} · {formatPrice(chat.ad.price)} сомони
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p
            className={`truncate text-[14px] ${
              unread ? "font-medium text-[#111111]" : "text-[#8E8E93]"
            }`}
          >
            {previewPrefix}
            {previewText}
          </p>
          {unread && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#E53935] px-1.5 text-[11px] font-semibold text-white">
              {chat.unread_count > 99 ? "99+" : chat.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
