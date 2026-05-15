"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCreateChatMutation } from "@/lib/features/chats/chatsApi";

/**
 * Opens a chat for a given ad. If a chat already exists between the current
 * user and the ad's owner, the backend returns its id (idempotent). Otherwise
 * a new chat is created. Then we navigate to `/messages/{chat_id}`.
 *
 * If the user is not authenticated, the auth modal is shown via `requireAuth`.
 */
export function useOpenChat() {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const [createChat, { isLoading }] = useCreateChatMutation();

  const openChat = useCallback(
    (adId: string) => {
      requireAuth(async () => {
        try {
          const { chat_id } = await createChat({ ad_id: adId }).unwrap();
          router.push(`/messages/${chat_id}`);
        } catch (err) {
          const status = (err as { status?: number } | undefined)?.status;
          if (status === 403) {
            // Trying to message own ad — silently fall back to messages list
            router.push("/messages");
            return;
          }
          // Last-resort fallback so the UX doesn't dead-end on API failure
          router.push("/messages");
        }
      });
    },
    [createChat, requireAuth, router],
  );

  return { openChat, isOpening: isLoading };
}
