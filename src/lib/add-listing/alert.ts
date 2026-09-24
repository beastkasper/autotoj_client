/**
 * Веб-замена react-native-toast-message (Toast.show) и Alert.alert из мобилки.
 * Состояние живёт в модуле; отрисовывает его <FeedbackHost /> из
 * components/add-listing/FeedbackHost.tsx (смонтирован на странице /post-ad).
 */

export type ToastType = "success" | "error" | "info";

export interface ToastState {
  id: number;
  type: ToastType;
  text1?: string;
  text2?: string;
}

export interface AlertButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

export interface AlertState {
  id: number;
  title: string;
  message?: string;
  buttons: AlertButton[];
}

type Listener = () => void;

let toast: ToastState | null = null;
let alertState: AlertState | null = null;
let seq = 0;
let toastTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeFeedback(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToast(): ToastState | null {
  return toast;
}

export function getAlert(): AlertState | null {
  return alertState;
}

export const Toast = {
  show({
    type = "info",
    text1,
    text2,
    visibilityTime = 3000,
  }: {
    type?: ToastType;
    text1?: string;
    text2?: string;
    visibilityTime?: number;
    position?: "top" | "bottom";
  }) {
    toast = { id: ++seq, type, text1, text2 };
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast = null;
      emit();
    }, visibilityTime);
    emit();
  },
  hide() {
    toast = null;
    emit();
  },
};

export const Alert = {
  alert(title: string, message?: string, buttons?: AlertButton[]) {
    alertState = {
      id: ++seq,
      title,
      message,
      buttons: buttons && buttons.length > 0 ? buttons : [{ text: "OK" }],
    };
    emit();
  },
};

export function dismissAlert(button?: AlertButton) {
  alertState = null;
  emit();
  button?.onPress?.();
}
