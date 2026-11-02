// --- Путь: src/types/admin/Stories/story.types.ts ---

// Типы, описывающие данные, как они приходят с бэкенда (из StoryResponse)
export type StoryContentType = "image" | "video";

export interface StoryContentItem {
  content: string; // URL или S3-ключ
  type: StoryContentType;
  duration: number; // Бэк не присылает, но мы добавим для формы
}

export interface Story {
  id: number;
  name: string | null;
  is_active: boolean;
  preview: string; // URL или S3-ключ
  content_items: StoryContentItem[];
  views: number;
  created_at: string;
  expires_at: string | null;
  viewed: boolean; // В админке всегда false
}

// =============================================================================
// ТИПЫ ДЛЯ ФОРМЫ (то, с чем мы работаем на фронте)
// =============================================================================

// Один слайд в нашей форме
export interface StoryContentItemFormData {
  id: string; // Уникальный ID для ключа в React (например, uuid)
  type: StoryContentType;
  duration: string; // В инпутах всегда строки
  content_url: string | null; // Существующий URL/S3-ключ
  content_file: File | null; // Новый файл для загрузки
  content_preview: string | null; // Локальный URL для превью (URL.createObjectURL)
}

// Полные данные формы
export interface StoryFormData {
  name: string;
  is_active: boolean;
  expires_at: string; // В input type="datetime-local" это строка
  
  preview_url: string | null;       // Существующий URL/S3-ключ для превью
  preview_file: File | null;        // Новый файл для превью
  preview_local_url: string | null; // Локальный URL для превью
  remove_preview: boolean;          // Флаг для удаления превью
  
  content_items: StoryContentItemFormData[]; // Массив слайдов
}

// Начальное состояние для одного слайда в форме
export const createInitialStoryContentItem = (): StoryContentItemFormData => ({
  id: crypto.randomUUID(),
  type: 'image',
  duration: '5',
  content_url: null,
  content_file: null,
  content_preview: null,
});

// Начальное состояние для всей формы
export const initialStoryFormData: StoryFormData = {
  name: '',
  is_active: true,
  expires_at: '',
  preview_url: null,
  preview_file: null,
  preview_local_url: null,
  remove_preview: false,
  content_items: [createInitialStoryContentItem()], // Начинаем с одного пустого слайда
};


// =============================================================================
// ТИПЫ ДЛЯ PAYLOAD (то, что мы отправляем на бэк в story_data_json)
// =============================================================================

// Payload для одного слайда, который уходит в JSON
interface StoryContentItemPayload {
    content: string; // URL, S3-ключ или ПУСТАЯ СТРОКА, если загружается новый файл
    type: StoryContentType;
    duration: number;
}

// Payload для создания/обновления
export interface StoryCreateUpdatePayload {
    preview_url?: string;
    name: string | null;
    is_active: boolean;
    expires_at: string | null;
    content_items: StoryContentItemPayload[];
}

// =============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ТИПЫ
// =============================================================================

// Параметры для фильтрации списка историй
export interface StoryFilterParams {
  limit?: number;
  offset?: number;
  is_active?: boolean;
}