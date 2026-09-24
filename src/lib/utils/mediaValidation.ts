/**
 * Проверка медиафайлов перед отправкой.
 *
 * Раньше клиентских проверок не было вовсе: не-изображение попадало в галерею
 * и ломало публикацию на шаге загрузки, а файл на 12 МБ уходил на сервер и
 * возвращал ошибку, из-за которой в аккаунте оставался пустой черновик.
 * Лимиты — по INTEGRATION.md §6.5 и §15.
 */

export const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 МБ
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 МБ
export const MAX_PHOTOS = 30;

function mb(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))} МБ`;
}

export interface MediaCheck {
  accepted: File[];
  error: string | null;
}

export function checkPhotos(files: File[], alreadyPicked = 0): MediaCheck {
  const problems: string[] = [];

  const images = files.filter((f) => f.type.startsWith("image/"));
  if (images.length !== files.length) {
    problems.push("можно прикладывать только изображения");
  }

  const small = images.filter((f) => f.size <= MAX_PHOTO_BYTES);
  if (small.length !== images.length) {
    problems.push(`каждое фото — не больше ${mb(MAX_PHOTO_BYTES)}`);
  }

  const room = Math.max(0, MAX_PHOTOS - alreadyPicked);
  const accepted = small.slice(0, room);
  if (small.length > room) {
    problems.push(`всего не больше ${MAX_PHOTOS} фотографий`);
  }

  return {
    accepted,
    error: problems.length ? `Не удалось добавить: ${problems.join("; ")}` : null,
  };
}

export function checkVideo(file: File): string | null {
  if (!file.type.startsWith("video/")) return "Нужен видеофайл";
  if (file.size > MAX_VIDEO_BYTES) return `Видео — не больше ${mb(MAX_VIDEO_BYTES)}`;
  return null;
}
