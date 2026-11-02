// --- Путь: src/utils/media.ts ---
// ПОЛНАЯ ВЕРСИЯ

/**
 * Создает полный, абсолютный и корректный URL для медиа-файла.
 * @param relativePath - Относительный путь от API (e.g., stories/previews/image.jpg),
 *                       полный URL (http://...), или временный blob URL (blob:...).
 * @returns Полный URL или null, если входные данные пустые.
 */
// --- Путь: src/utils/media.ts ---
// ПОЛНАЯ ВЕРСИЯ

export const createImageUrl = (relativePath: string | null | undefined): string | null => {
  if (!relativePath) {
    return null;
  }
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://') || relativePath.startsWith('blob:')) {
    return relativePath;
  }
  const backendUrl = import.meta.env.VITE_MINIO_URL || "https://api.monobuket-mk.by/api/download";
  if (!backendUrl) {
    console.error("КРИТИЧЕСКАЯ ОШИБКА: VITE_MINIO_URL не задана в .env файле!");
    return `https://api.monobuket-mk.by/api/download/media/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
  }
  const mediaPrefix = '/media/';
  const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
  const cleanRelativePath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${cleanBackendUrl}${mediaPrefix}${cleanRelativePath}`;
};
