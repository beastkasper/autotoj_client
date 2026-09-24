"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  openAuthModal as openAuthModalAction,
  closeAuthModal as closeAuthModalAction,
} from "@/lib/features/auth/authSlice";

// Подписка-заглушка: значение никогда не меняется, нужен только разный снимок
// на сервере и на клиенте, чтобы дождаться гидратации без setState в эффекте.
const subscribeNoop = () => () => {};
const getHydratedSnapshot = () => true;
const getServerSnapshot = () => false;

export function useAuth() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const userId = useAppSelector((s) => s.auth.userId);

  // Состояние модалки берём из стора, а не из локального useState: иначе каждый
  // вызов useAuth() получает собственную копию, и тот, кто открывает модалку
  // (например, useOpenChat), и тот, кто её рендерит, оказываются разными
  // экземплярами — кнопка выглядит рабочей, но не делает ничего.
  const showAuthModal = useAppSelector((s) => s.auth.authModalOpen);

  // Токен читается из localStorage только на клиенте. Чтобы разметка сервера и
  // клиента совпала, до гидратации сообщаем isAuthenticated = false.
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    getHydratedSnapshot,
    getServerSnapshot,
  );

  const isAuthenticated = hydrated && !!token;

  const requireAuth = useCallback(
    (action: () => void) => {
      // Здесь сверяемся с реальным значением токена: к моменту пользовательского
      // жеста гидратация уже позади, и гонять человека через модалку не нужно.
      if (token) {
        action();
      } else {
        dispatch(openAuthModalAction());
      }
    },
    [token, dispatch],
  );

  const closeAuthModal = useCallback(() => {
    dispatch(closeAuthModalAction());
  }, [dispatch]);

  return {
    isAuthenticated,
    /** Прочитан ли localStorage. До этого момента серверная и клиентская разметка обязаны совпадать. */
    hydrated,
    token,
    userId,
    showAuthModal,
    requireAuth,
    closeAuthModal,
  };
}
