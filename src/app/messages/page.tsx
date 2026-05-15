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
  const { data, isLoading, isError } = useGetChatsQuery(undefined, {
    skip: !token,
  });

  const handleChatClick = useCallback(
    (chatId: string) => router.push(`/messages/${chatId}`),
    [router],
  );

  return (
    <main className="min-h-screen bg-[#F5F5F7] pb-24 lg:pb-12">
      <PageHeader title="Сообщения" />
      <DesktopPageHeader
        title="Сообщения"
        subtitle="Ваши диалоги с продавцами и покупателями"
      />

      {/* Not authenticated */}
      {!isAuthenticated && (
        <EmptyState
          icon={MessageCircle}
          title="Войдите, чтобы видеть переписку"
          description="Список диалогов появится здесь после входа"
          action={{ label: "Войти", onClick: () => router.push("/login") }}
        />
      )}

      {/* Loading */}
      {isAuthenticated && isLoading && (
        <div className="px-4 md:px-6 py-4 lg:max-w-[1000px] lg:mx-auto space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 h-20 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isAuthenticated && isError && (
        <EmptyState
          icon={MessageCircle}
          title="Не удалось загрузить чаты"
          description="Проверьте соединение и попробуйте ещё раз"
        />
      )}

      {/* Empty */}
      {isAuthenticated && !isLoading && !isError && data && data.chats.length === 0 && (
        <EmptyState
          icon={MessageCircle}
          title="Нет диалогов"
          description="Напишите продавцу с карточки объявления, чтобы начать чат"
          action={{ label: "К объявлениям", onClick: () => router.push("/") }}
        />
      )}

      {/* List */}
      {isAuthenticated && data && data.chats.length > 0 && (
        <div className="px-4 md:px-6 py-4 lg:max-w-[1000px] lg:mx-auto space-y-2 md:space-y-3">
          {data.chats.map((chat) => (
            <ChatRow
              key={chat.id}
              chat={chat}
              onClick={() => handleChatClick(chat.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

interface ChatRowProps {
  chat: ChatListItem;
  onClick: () => void;
}

function ChatRow({ chat, onClick }: ChatRowProps) {
  const last = chat.last_message;
  const unread = chat.unread_count > 0;
  const previewPrefix = last?.is_mine ? "Вы: " : "";
  const previewText = last?.text ?? "Нет сообщений";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-3 md:p-4 flex items-center gap-3 text-left hover:bg-[#FAFAFA] active:scale-[0.99] transition-all"
    >
      {/* Ad photo */}
      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden shrink-0 bg-[#F2F2F7]">
        <ImageWithFallback
          src={chat.ad.photo}
          alt={chat.ad.title}
          className="w-full h-full object-cover"
        />
        {/* Partner avatar overlay */}
        {chat.partner.avatar ? (
          <img
            src={chat.partner.avatar}
            alt={chat.partner.name}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white object-cover"
          />
        ) : (
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white bg-[#111111] text-white text-[10px] font-semibold flex items-center justify-center font-[family-name:var(--font-manrope)]">
            {chat.partner.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[15px] font-semibold text-[#111111] truncate font-[family-name:var(--font-manrope)]">
            {chat.partner.name}
          </span>
          <span className="text-[12px] text-[#8E8E93] shrink-0 font-[family-name:var(--font-manrope)]">
            {formatChatListTime(chat.updated_at)}
          </span>
        </div>
        <p className="text-[13px] text-[#8E8E93] truncate mt-0.5 font-[family-name:var(--font-manrope)]">
          {chat.ad.title} · {formatPrice(chat.ad.price)} сомони
        </p>
        <div className="flex items-center justify-between gap-2 mt-1">
          <p
            className={`text-[14px] truncate font-[family-name:var(--font-manrope)] ${
              unread ? "text-[#111111] font-medium" : "text-[#8E8E93]"
            }`}
          >
            {previewPrefix}
            {previewText}
          </p>
          {unread && (
            <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-[#E53935] text-white text-[11px] font-semibold flex items-center justify-center font-[family-name:var(--font-manrope)]">
              {chat.unread_count > 99 ? "99+" : chat.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
