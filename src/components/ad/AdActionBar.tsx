"use client";

import { useRouter } from "next/navigation";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";

interface AdActionBarProps {
  phone?: string;
  adId?: string;
}

export function AdActionBar({ phone, adId }: AdActionBarProps) {
  const router = useRouter();
  const { requireAuth, showAuthModal, closeAuthModal } = useAuth();

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E5E5E7] px-4 py-3 pb-safe">
        <div className="flex gap-3">
          <Button
            onClick={() => requireAuth(() => {
              if (phone) {
                window.location.href = `tel:${phone}`;
              }
            })}
            className="flex-1 h-12 bg-[#E53935] text-white rounded-2xl text-[15px] font-semibold active:bg-[#D32F2F] hover:bg-[#D32F2F] font-[family-name:var(--font-manrope)]"
          >
            <Phone className="w-4 h-4" />
            Позвонить
          </Button>
          <Button
            onClick={() => requireAuth(() => {
              if (adId) {
                router.push(`/messages?ad=${adId}`);
              }
            })}
            className="flex-1 h-12 bg-[#111111] text-white rounded-2xl text-[15px] font-semibold active:bg-[#333] hover:bg-[#333] font-[family-name:var(--font-manrope)]"
          >
            <MessageCircle className="w-4 h-4" />
            Написать
          </Button>
        </div>
      </div>
      <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />
    </>
  );
}
