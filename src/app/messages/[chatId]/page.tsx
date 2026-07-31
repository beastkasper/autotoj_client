"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Send,
  AlertCircle,
  MoreVertical,
  Paperclip,
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
      <main className="screen min-h-screen bg-card">
        <EmptyState
          icon={AlertCircle}
          title="Войдите в аккаунт"
          description="Чтобы открыть переписку, войдите"
          action={{ label: "Войти", onClick: () => router.push("/login") }}
        />
      </main>
    );
  }

  if (chatLoading) {
    return (
      <main className="screen min-h-screen bg-card">
        <ChatHeaderSkeleton onBack={() => router.back()} />
        <div className="space-y-2 px-4 py-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`skeleton h-10 rounded-2xl ${
                i % 2 === 0 ? "w-1/2" : "ml-auto w-2/3"
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
      <main className="screen min-h-screen bg-card">
        <ChatHeaderSkeleton onBack={() => router.back()} />
        <EmptyState
          icon={AlertCircle}
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
    <main className="flex min-h-screen flex-col bg-card">
      {/* ── Шапка h56 (§10.10) ── */}
      <div className="sticky top-0 z-30 bg-card pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 items-center gap-3 px-4 lg:max-w-[1000px]">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Назад"
            className="icon-btn -ml-2.5"
          >
            <ArrowLeft className="size-5" strokeWidth={1.5} />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            {chat.partner.avatar ? (
              <img
                src={chat.partner.avatar}
                alt={chat.partner.name}
                className="size-9 rounded-full bg-secondary object-cover"
              />
            ) : (
              <span className="grid size-9 place-items-center rounded-full bg-muted text-[14px] font-medium text-[#6B7280]">
                {chat.partner.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="line-1 text-[15px] font-semibold text-foreground">
              {chat.partner.name}
            </span>
          </div>

          <button type="button" aria-label="Меню" className="icon-btn -mr-2.5">
            <MoreVertical className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Плашка объявления: m 12px 16px 8px, фото 40×40 r8 (§10.10) */}
        <button
          type="button"
          onClick={handleAdClick}
          className="press-row mx-4 mb-2 mt-3 flex w-[calc(100%-32px)] items-center gap-3 rounded-xl px-1 text-left lg:mx-auto lg:max-w-[1000px]"
        >
          <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-secondary">
            <ImageWithFallback
              src={chat.ad.photo}
              alt={chat.ad.title}
              className="size-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-1 text-[14px] font-medium text-foreground">
              {chat.ad.title}
            </p>
            <p className="text-[12px] text-muted-foreground">
              {formatPrice(chat.ad.price)} сомони
            </p>
          </div>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
        </button>
        <div className="hairline" />
      </div>

      {/* ── Лента сообщений: px16, gap 8 (§10.10) ── */}
      <div
        className="mx-auto w-full flex-1 overflow-y-auto px-4 py-4 lg:max-w-[1000px]"
        style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom))" }}
      >
        {msgsLoading && ordered.length === 0 ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`skeleton h-10 rounded-2xl ${
                  i % 2 === 0 ? "w-1/2" : "ml-auto w-2/3"
                }`}
              />
            ))}
          </div>
        ) : ordered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[14px] text-muted-foreground">
              Сообщений ещё нет. Напишите первым.
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.dateLabel} className="space-y-2">
              <div className="my-3 flex justify-center">
                <span className="rounded-full bg-secondary px-3 py-1 text-[12px] text-muted-foreground">
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

      {/* ── Строка ввода h56 (§10.10) ── */}
      <div
        className="hairline-top fixed bottom-0 left-0 right-0 z-30 bg-card px-4 py-2"
        style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex items-end gap-3 lg:max-w-[1000px]">
          <button
            type="button"
            aria-label="Вложение"
            className="icon-btn shrink-0 text-muted-foreground"
          >
            <Paperclip className="size-5" strokeWidth={1.5} />
          </button>
          <div className="flex min-h-9 flex-1 items-end rounded-[20px] bg-secondary">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Сообщение…"
              rows={1}
              className="max-h-32 flex-1 resize-none bg-transparent px-4 py-2 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || sending}
            aria-label="Отправить"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-all active:scale-95 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            <Send className="size-[18px]" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </main>
  );
}

/**
 * Пузырь сообщения (§10.10): входящее — bg secondary, r16 с левым нижним 4;
 * исходящее — bg muted, r16 с правым нижним 4. Текст 15/400, время 11/400 muted.
 */
function MessageBubble({ message }: { message: Message }) {
  const mine = message.is_mine;
  return (
    <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[75%] px-3 py-2 ${
          mine
            ? "rounded-2xl rounded-br-[4px] bg-muted text-foreground"
            : "rounded-2xl rounded-bl-[4px] bg-secondary text-foreground"
        }`}
      >
        {message.text && (
          <p className="whitespace-pre-wrap break-words text-[15px] leading-snug">
            {message.text}
          </p>
        )}
        {message.media_url && (
          <div className="mt-1 overflow-hidden rounded-xl">
            {message.media_type === "video" ? (
              <video
                src={message.media_url}
                controls
                className="max-h-72 w-full rounded-xl"
              />
            ) : (
              <img
                src={message.media_url}
                alt=""
                className="max-h-72 w-full rounded-xl object-cover"
              />
            )}
          </div>
        )}
      </div>
      <span className="mt-1 text-[11px] text-muted-foreground">
        {formatMessageTime(message.created_at)}
        {mine && message.is_read && " · прочитано"}
      </span>
    </div>
  );
}

function ChatHeaderSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="hairline sticky top-0 z-30 bg-card pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 items-center gap-3 px-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Назад"
          className="icon-btn -ml-2.5"
        >
          <ArrowLeft className="size-5" strokeWidth={1.5} />
        </button>
        <div className="skeleton size-9 rounded-full" />
        <div className="skeleton h-4 w-[140px]" />
      </div>
    </div>
  );
}
