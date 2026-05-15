"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/hooks";

export function useAuth() {
  const token = useAppSelector((s) => s.auth.token);
  const userId = useAppSelector((s) => s.auth.userId);

  // Auth state hydrates from localStorage on the client only. To prevent SSR/CSR
  // hydration mismatches, report `isAuthenticated = false` until the component
  // has mounted on the client, then switch to the real value.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const isAuthenticated = hydrated && !!token;

  const [showAuthModal, setShowAuthModal] = useState(false);

  const requireAuth = useCallback(
    (action: () => void) => {
      // Use the actual token value here — by the time requireAuth fires from
      // a user gesture, we're past hydration. This avoids forcing users
      // through the auth modal during the first paint.
      if (token) {
        action();
      } else {
        setShowAuthModal(true);
      }
    },
    [token],
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
