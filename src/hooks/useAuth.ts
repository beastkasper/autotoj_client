"use client";

import { useCallback, useState } from "react";
import { useAppSelector } from "@/hooks/hooks";

export function useAuth() {
  const token = useAppSelector((s) => s.auth.token);
  const userId = useAppSelector((s) => s.auth.userId);
  const isAuthenticated = !!token;

  const [showAuthModal, setShowAuthModal] = useState(false);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (isAuthenticated) {
        action();
      } else {
        setShowAuthModal(true);
      }
    },
    [isAuthenticated],
  );

  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  return {
    isAuthenticated,
    token,
    userId,
    showAuthModal,
    requireAuth,
    closeAuthModal,
  };
}
