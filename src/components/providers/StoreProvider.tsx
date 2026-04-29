"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/lib/store";

interface StoreProviderProps {
  children: React.ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  // Lazy initializer ensures the store is constructed exactly once per
  // provider instance without touching a ref during render.
  const [store] = useState<AppStore>(() => makeStore());
  return <Provider store={store}>{children}</Provider>;
}
