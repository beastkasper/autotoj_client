"use client";

import { useRouter } from "next/navigation";
import { LogIn, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AuthRequiredModalProps {
  open: boolean;
  onClose: () => void;
}

/** Модалка «Требуется вход» (DESIGN.md §8.3): r20, круг 64×64, кнопки h52. */
export function AuthRequiredModal({ open, onClose }: AuthRequiredModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-[340px] rounded-3xl border-none bg-card p-0 shadow-[var(--shadow-modal)] [&>button]:hidden">
        <div className="px-6 pb-2 pt-8 text-center">
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-secondary transition-colors"
          >
            <X className="size-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-secondary">
            <LogIn className="size-7 text-foreground" strokeWidth={1.5} />
          </div>
          <DialogHeader className="items-center">
            <DialogTitle className="mb-2 text-[20px] font-bold text-foreground">
              Требуется вход
            </DialogTitle>
            <DialogDescription className="text-[15px] leading-[22px] text-muted-foreground">
              Войдите в аккаунт, чтобы получить доступ к этой функции
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex flex-col gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={handleLogin}
            className="btn h-[52px] w-full rounded-[26px] bg-primary text-[15px] font-semibold text-primary-foreground"
          >
            <LogIn className="size-[18px]" strokeWidth={1.5} />
            Войти
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn h-11 w-full rounded-[22px] text-[15px] font-medium text-muted-foreground"
          >
            Позже
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
