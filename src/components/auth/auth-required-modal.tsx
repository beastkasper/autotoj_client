"use client";

import { useRouter } from "next/navigation";
import { LogIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function AuthRequiredModal({ open, onClose }: AuthRequiredModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="rounded-[20px] max-w-sm p-0 border-none shadow-lg [&>button]:hidden">
        {/* keep exact same inner layout */}
        <div className="p-8 pt-10 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center hover:bg-[#E5E5E7] transition-colors"
          >
            <X className="w-4 h-4 text-[#8E8E93]" />
          </button>
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#F5F5F7] flex items-center justify-center">
            <LogIn className="w-7 h-7 text-[#111111]" />
          </div>
          <DialogHeader className="items-center">
            <DialogTitle className="text-[20px] font-bold text-[#111111] font-[family-name:var(--font-manrope)]">
              Требуется вход
            </DialogTitle>
            <DialogDescription className="text-[15px] text-[#8E8E93] leading-relaxed font-[family-name:var(--font-manrope)]">
              Войдите в аккаунт, чтобы получить доступ к этой функции
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 pb-6 space-y-3">
          <Button
            onClick={handleLogin}
            className="w-full h-[52px] bg-[#111111] text-white rounded-2xl text-[15px] font-semibold hover:bg-[#333] font-[family-name:var(--font-manrope)]"
          >
            <LogIn className="w-[18px] h-[18px]" />
            Войти
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full h-[44px] rounded-2xl text-[15px] font-medium text-[#8E8E93] hover:text-[#111111] hover:bg-[#F5F5F7] font-[family-name:var(--font-manrope)]"
          >
            Позже
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
