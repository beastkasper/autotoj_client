"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOpenChat } from "@/hooks/useOpenChat";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";

interface AdActionBarProps {
  phone?: string;
  adId?: string;
}

/**
 * Нижняя панель деталей (DESIGN.md §10.2): фиксированная, полупрозрачная
 * с блюром и границей сверху; кнопки h52, обводка --foreground, r16, gap 12.
 */
export function AdActionBar({ phone, adId }: AdActionBarProps) {
  const { requireAuth, showAuthModal, closeAuthModal } = useAuth();
  const { openChat, isOpening } = useOpenChat();

  return (
    <>
      <div
        className="blur-surface-soft hairline-top fixed left-0 right-0 z-40 mx-auto max-w-[440px] px-4 py-3 lg:hidden"
        style={{ bottom: "calc(64px + env(safe-area-inset-bottom))" }}
      >
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() =>
              requireAuth(() => {
                if (phone) window.location.href = `tel:${phone}`;
              })
            }
            className="btn btn--outline flex-1"
          >
            <Phone className="size-[18px]" strokeWidth={1.5} />
            Позвонить
          </button>
          <button
            type="button"
            onClick={() => adId && openChat(adId)}
            disabled={isOpening}
            className="btn btn--outline flex-1"
          >
            <MessageCircle className="size-[18px]" strokeWidth={1.5} />
            Написать
          </button>
        </div>
      </div>
      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </>
  );
}
