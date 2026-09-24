/**
 * Безопасная ссылка на медиафайл.
 *
 * Бэкенд отдаёт загруженные пользователями фото по незащищённому протоколу и
 * сырому IP: http://72.56.126.156:8000/uploads/... Сайт работает по HTTPS,
 * поэтому браузер блокирует такие картинки как mixed content — у всех
 * объявлений, опубликованных через приложение, фотографий на проде просто нет.
 *
 * Правильное решение — отдавать медиа с https://cdn.autotoj.tj (этот хост уже
 * прописан в next.config.ts и явно задумывался). Пока этого нет, пропускаем
 * такие ссылки через встроенный оптимизатор Next: он забирает файл на сервере
 * и отдаёт браузеру уже по HTTPS. Хост перечислен в images.remotePatterns,
 * иначе оптимизатор ответит 400.
 *
 * ВАЖНО: это обходной путь. Он гонит трафик картинок через наш сервер, поэтому
 * его следует убрать, как только медиа поедут по HTTPS.
 */

const INSECURE_PREFIX = "http://";

/**
 * Оптимизатор принимает только ширины из deviceSizes/imageSizes конфига Next.
 * Любое другое значение — 400 «"w" parameter (width) of N is not allowed».
 */
const ALLOWED_WIDTHS = [
  16, 32, 48, 64, 96, 128, 256, 384,
  640, 750, 828, 1080, 1200, 1920, 2048, 3840,
];

function snapWidth(width: number): number {
  return ALLOWED_WIDTHS.find((w) => w >= width) ?? ALLOWED_WIDTHS[ALLOWED_WIDTHS.length - 1];
}

export function mediaUrl(src: string | null | undefined, width = 1200, quality = 75): string {
  if (!src) return "";
  if (!src.startsWith(INSECURE_PREFIX)) return src;
  // Локальная разработка по http — проксировать незачем.
  if (src.startsWith("http://localhost")) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${snapWidth(width)}&q=${quality}`;
}
