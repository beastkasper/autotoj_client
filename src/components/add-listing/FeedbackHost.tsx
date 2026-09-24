"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import {
  subscribeFeedback,
  getToast,
  getAlert,
  dismissAlert,
  Toast,
} from "@/lib/add-listing/alert";
import { cn } from "@/lib/utils";

const noop = () => () => {};

/** Отрисовывает Toast.show() и Alert.alert() из lib/add-listing/alert.ts. */
export function FeedbackHost() {
  const toast = useSyncExternalStore(subscribeFeedback, getToast, () => null);
  const alert = useSyncExternalStore(subscribeFeedback, getAlert, () => null);
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  if (!mounted) return null;

  const ToastIcon = toast?.type === "success" ? CheckCircle2 : toast?.type === "error" ? AlertCircle : Info;

  return createPortal(
    <>
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[400] flex justify-center px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)]">
          <button
            type="button"
            onClick={() => Toast.hide()}
            className={cn(
              "pointer-events-auto flex w-full max-w-[408px] items-start gap-3 rounded-2xl bg-card px-4 py-3 text-left shadow-[var(--shadow-menu)]",
              "border-l-4",
              toast.type === "success" && "border-l-success",
              toast.type === "error" && "border-l-destructive",
              toast.type === "info" && "border-l-foreground",
            )}
          >
            <ToastIcon
              className={cn(
                "mt-0.5 size-5 shrink-0",
                toast.type === "success" && "text-success",
                toast.type === "error" && "text-destructive",
                toast.type === "info" && "text-foreground",
              )}
            />
            <span className="min-w-0 flex-1">
              {toast.text1 && <span className="block text-[15px] font-semibold text-foreground">{toast.text1}</span>}
              {toast.text2 && <span className="mt-0.5 block text-[13px] text-muted-foreground">{toast.text2}</span>}
            </span>
          </button>
        </div>
      )}

      {alert && (
        <div className="fixed inset-0 z-[410] flex items-center justify-center bg-black/40 px-10">
          <div role="alertdialog" aria-modal="true" className="w-full max-w-[300px] overflow-hidden rounded-[14px] bg-card text-center">
            <div className="px-4 pb-4 pt-5">
              <p className="text-[17px] font-semibold text-foreground">{alert.title}</p>
              {alert.message && <p className="mt-1 text-[13px] leading-[18px] text-foreground">{alert.message}</p>}
            </div>
            <div className={cn("flex border-t border-border", alert.buttons.length > 2 && "flex-col")}>
              {alert.buttons.map((b, i) => (
                <button
                  key={`${b.text}-${i}`}
                  type="button"
                  onClick={() => dismissAlert(b)}
                  className={cn(
                    "h-11 flex-1 text-[17px] text-link",
                    i > 0 && (alert.buttons.length > 2 ? "border-t border-border" : "border-l border-border"),
                    b.style === "cancel" && "font-semibold",
                    b.style === "destructive" && "text-destructive",
                  )}
                >
                  {b.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>,
    document.body,
  );
}
