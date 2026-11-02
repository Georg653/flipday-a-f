// src/constants/admin/Points/points.constants.ts
import type { ApiContentBlock } from '../../../types/common/content.types';
type ContentBlockType = ApiContentBlock['type']; // <<<--- ИСПРАВЛЕННЫЙ ПУТЬ

export const ITEMS_PER_PAGE_POINTS = 10;

export const POINT_CONTENT_BLOCK_TYPE_OPTIONS: { value: ContentBlockType; label: string }[] = [
  { value: 'heading', label: 'Заголовок' },
  { value: 'text', label: 'Текст' },
  { value: 'image', label: 'Изображение (URL)' },
  { value: 'video', label: 'Видео (URL)' },
  { value: 'audio', label: 'Аудио (URL)' },
  { value: 'album', label: 'Альбом изображений (URL)' },
  { value: 'slider', label: 'Слайдер изображений (URL)' },
  { value: 'test', label: 'Тест' },
];