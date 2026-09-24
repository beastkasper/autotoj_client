/**
 * Веб-аналог autoToj-app/src/lib/photoPicker.ts.
 *
 * Формы подачи хранят медиа как строки-URI (как в мобилке). В браузере это
 * blob:-URL, созданные через URL.createObjectURL; исходный File запоминается
 * в реестре и достаётся через fileFromUri() при multipart-загрузке.
 */

import { Alert } from "./alert";

const registry = new Map<string, File>();

function openFileDialog(accept: string, multiple: boolean): Promise<File[]> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve([]);
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;
    input.style.display = "none";
    let settled = false;
    const finish = (files: File[]) => {
      if (settled) return;
      settled = true;
      input.remove();
      resolve(files);
    };
    input.addEventListener("change", () => finish(Array.from(input.files ?? [])));
    // Отмена диалога: "cancel" поддерживается современными браузерами.
    input.addEventListener("cancel", () => finish([]));
    document.body.appendChild(input);
    input.click();
  });
}

function register(file: File): string {
  const uri = URL.createObjectURL(file);
  registry.set(uri, file);
  return uri;
}

export interface PickPhotosOptions {
  /** Сколько ещё фото можно добавить (лимит формы минус уже выбранные). */
  remaining: number;
}

/** Открывает выбор файлов и возвращает URI выбранных фото (пустой массив при отмене). */
export async function pickPhotos({ remaining }: PickPhotosOptions): Promise<string[]> {
  if (remaining <= 0) {
    Alert.alert("Лимит фото", "Достигнуто максимальное количество фотографий.");
    return [];
  }
  const files = await openFileDialog("image/jpeg,image/png,image/webp,image/heic", true);
  return files
    .filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|heic)$/i.test(f.name))
    .slice(0, remaining)
    .map(register);
}

/** Открывает выбор одного видео. Возвращает URI или null. */
export async function pickVideo(): Promise<string | null> {
  const files = await openFileDialog("video/mp4,video/quicktime,video/*", false);
  const file = files[0];
  if (!file) return null;
  return register(file);
}

/** Возвращает File для URI, полученного из pickPhotos/pickVideo. */
export function fileFromUri(uri: string, _index = 0): File | null {
  return registry.get(uri) ?? null;
}

/** Собирает File[] из списка URI, пропуская неизвестные. */
export function filesFromUris(uris: string[]): File[] {
  return uris.map((u, i) => fileFromUri(u, i)).filter((f): f is File => f !== null);
}
