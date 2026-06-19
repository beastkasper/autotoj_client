"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Send,
  AlertTriangle,
  MoreVertical,
  Phone,
} from "lucide-react";
import { ImageWithFallback } from "@/components/cards/ImageWithFallback";
import { EmptyState } from "@/components/states/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetChatQuery,
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useMarkChatReadMutation,
} from "@/lib/features/chats/chatsApi";
import { formatPrice } from "@/lib/utils/formatPrice";
import {
  formatMessageTime,
  formatMessageDateSeparator,
} from "@/lib/utils/chatTime";
import type { Message } from "@/lib/types/api";

const MESSAGES_PAGE_SIZE = 50;

export default function ChatPage() {
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId;
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();

  const {
    data: chat,
    isLoading: chatLoading,
    isError: chatError,
    error: chatErrorObj,
  } = useGetChatQuery(chatId, { skip: !token });

  const {
    data: messagesData,
    isLoading: msgsLoading,
  } = useGetChatMessagesQuery(
    { chatId, page: 1, limit: MESSAGES_PAGE_SIZE },
    {
      skip: !token,
      // Poll until WebSocket is wired up
      pollingInterval: 5000,
    },
  );

  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const [markChatRead] = useMarkChatReadMutation();

  // Mark chat as read on mount and whenever new messages arrive
  useEffect(() => {
    if (!token || !chatId) return;
    markChatRead(chatId).catch(() => {
      // Non-blocking — just ignore failure
    });
  }, [chatId, token, markChatRead, messagesData?.total]);

  // Reverse messages: backend returns newest-first, UI shows oldest-first
  const ordered: Message[] = useMemo(() => {
    if (!messagesData?.messages) return [];
    return [...messagesData.messages].reverse();
  }, [messagesData?.messages]);

  // Group messages by day for separators
  const groups = useMemo(() => {
    const out: { dateLabel: string; items: Message[] }[] = [];
    for (const m of ordered) {
      const label = formatMessageDateSeparator(m.created_at);
      const last = out[out.length - 1];
      if (last && last.dateLabel === label) {
        last.items.push(m);
      } else {
        out.push({ dateLabel: label, items: [m] });
      }
    }
    return out;
  }, [ordered]);

  // Auto-scroll to bottom on new messages
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [ordered.length]);

  const [text, setText] = useState("");
  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setText("");
    try {
      await sendMessage({ chatId, text: trimmed }).unwrap();
    } catch {
      // Restore text on failure so the user doesn't lose it
      setText(trimmed);
    }
  }, [text, sending, sendMessage, chatId]);

  const handleAdClick = useCallback(() => {
    if (chat?.ad?.id) router.push(`/ad/${chat.ad.id}`);
  }, [chat?.ad?.id, router]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#F5F5F7]">
        <EmptyState
          icon={AlertTriangle}
          title="Войдите в аккаунт"
          description="Чтобы открыть переписку, войдите"
          action={{ label: "Войти", onClick: () => router.push("/login") }}
        />
      </main>
    );
  }

  if (chatLoading) {
    return (
      <main className="min-h-screen bg-[#F5F5F7]">
        <ChatHeaderSkeleton onBack={() => router.back()} />
        <div className="px-4 py-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-10 rounded-2xl bg-white animate-pulse ${
                i % 2 === 0 ? "w-1/2" : "w-2/3 ml-auto"
              }`}
            />
          ))}
        </div>
      </main>
    );
  }

  if (chatError || !chat) {
    const status = (chatErrorObj as { status?: number } | undefined)?.status;
    return (
      <main className="min-h-screen bg-[#F5F5F7]">
        <ChatHeaderSkeleton onBack={() => router.back()} />
        <EmptyState
          icon={AlertTriangle}
          title={status === 404 ? "Чат не найден" : "Не удалось загрузить чат"}
          description={
            status === 403
              ? "У вас нет доступа к этому чату"
              : "Попробуйте ещё раз позже"
          }
          action={{
            label: "К списку чатов",
            onClick: () => router.push("/messages"),
          }}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F5F7] flex flex-col">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-[#E5E5E7]">
        <div className="flex items-center gap-3 px-3 md:px-6 h-14 lg:h-16 lg:max-w-[1000px] lg:mx-auto">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Назад"
            className="w-10 h-10 rounded-full flex items-center justify-center -ml-2 hover:bg-[#F2F2F7] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#111111]" />
          </button>

          {/* Partner */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {chat.partner.avatar ? (
              <img
                src={chat.partner.avatar}
                alt={chat.partner.name}
                className="w-9 h-9 rounded-full object-cover bg-[#F2F2F7]"
              />
            ) : (
              <span className="w-9 h-9 rounded-full bg-[#111111] text-white text-[14px] font-semibold flex items-center justify-center font-[family-name:var(--font-manrope)]">
                {chat.partner.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="text-[15px] font-semibold text-[#111111] truncate font-[family-name:var(--font-manrope)]">
              {chat.partner.name}
            </span>
          </div>

          <button
            type="button"
            aria-label="Меню"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F2F2F7] transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-[#111111]" />
          </button>
        </div>

        {/* Ad pill */}
        <button
          type="button"
          onClick={handleAdClick}
          className="w-full lg:max-w-[1000px] lg:mx-auto flex items-center gap-3 px-3 md:px-6 py-2 bg-[#FAFAFA] border-t border-[#F2F2F7] text-left hover:bg-[#F5F5F7] transition-colors"
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F2F2F7] shrink-0">
            <ImageWithFallback
              src={chat.ad.photo}
              alt={chat.ad.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#111111] truncate font-medium font-[family-name:var(--font-manrope)]">
              {chat.ad.title}
            </p>
            <p className="text-[12px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              {formatPrice(chat.ad.price)} сомони
            </p>
          </div>
        </button>
      </div>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto px-3 md:px-6 py-4 lg:max-w-[1000px] lg:mx-auto w-full"
        style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom))" }}
      >
        {msgsLoading && ordered.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-10 rounded-2xl bg-white animate-pulse ${
                  i % 2 === 0 ? "w-1/2" : "w-2/3 ml-auto"
                }`}
              />
            ))}
          </div>
        ) : ordered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
              Сообщений ещё нет. Напишите первым.
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.dateLabel} className="space-y-1.5">
              <div className="flex justify-center my-3">
                <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E7] text-[12px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">
                  {group.dateLabel}
                </span>
              </div>
              {group.items.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div
        className="fixed left-0 right-0 z-30 bg-white border-t border-[#E5E5E7] px-3 md:px-6 py-2"
        style={{ bottom: 0, paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-end gap-2 lg:max-w-[1000px] lg:mx-auto">
          <a
            href={chat.partner ? undefined : undefined}
            className="hidden md:flex w-10 h-10 rounded-full items-center justify-center hover:bg-[#F2F2F7] text-[#111111] transition-colors"
            aria-label="Позвонить"
          >
            <Phone className="w-5 h-5" />
          </a>
          <div className="flex-1 bg-[#F2F2F7] rounded-2xl flex items-end min-h-10">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Написать сообщение..."
              rows={1}
              className="flex-1 bg-transparent px-4 py-2.5 text-[15px] text-[#111111] placeholder:text-[#8E8E93] focus:outline-none resize-none max-h-32 font-[family-name:var(--font-manrope)]"
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || sending}
            aria-label="Отправить"
            className="w-10 h-10 rounded-full bg-[#E53935] text-white flex items-center justify-center shrink-0 disabled:bg-[#C7C7CC] disabled:cursor-not-allowed hover:bg-[#D32F2F] active:scale-95 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const mine = message.is_mine;
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-3 py-2 ${
          mine
            ? "bg-[#E53935] text-white rounded-br-sm"
            : "bg-white text-[#111111] border border-[#E5E5E7] rounded-bl-sm"
        }`}
      >
        {message.text && (
          <p
            className="text-[15px] leading-snug whitespace-pre-wrap break-words font-[family-name:var(--font-manrope)]"
          >
            {message.text}
          </p>
        )}
        {message.media_url && (
          <div className="mt-1 rounded-xl overflow-hidden">
            {message.media_type === "video" ? (
              <video
                src={message.media_url}
                controls
                className="w-full max-h-72 rounded-xl"
              />
            ) : (
              <img
                src={message.media_url}
                alt=""
                className="w-full max-h-72 object-cover rounded-xl"
              />
            )}
          </div>
        )}
        <span
          className={`block text-[11px] mt-1 text-right font-[family-name:var(--font-manrope)] ${
            mine ? "text-white/70" : "text-[#8E8E93]"
          }`}
        >
          {formatMessageTime(message.created_at)}
          {mine && message.is_read && " · прочитано"}
        </span>
      </div>
    </div>
  );
}

function ChatHeaderSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-[#E5E5E7]">
      <div className="flex items-center gap-3 px-3 md:px-6 h-14 lg:h-16">
        <button
          type="button"
          onClick={onBack}
          aria-label="Назад"
          className="w-10 h-10 rounded-full flex items-center justify-center -ml-2 hover:bg-[#F2F2F7]"
        >
          <ChevronLeft className="w-5 h-5 text-[#111111]" />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#F2F2F7] animate-pulse" />
        <div className="flex-1 h-4 bg-[#F2F2F7] rounded animate-pulse max-w-[140px]" />
      </div>
    </div>
  );
}
