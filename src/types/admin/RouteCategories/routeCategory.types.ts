// --- Путь: src/types/admin/RouteCategories/routeCategory.types.ts ---

// --- Тип, как данные приходят с бэкенда ---
export interface RouteCategory {
  id: number;
  name: string;
  description: string | null;
  image: string | null; // URL или S3-ключ
}

// --- Тип для данных в нашей React-форме ---
export interface RouteCategoryFormData {
  name: string;
  description: string;
  image_file: File | null; // Файл, который выбрал пользователь
  image_preview_url: string | null; // Для отображения превью
  remove_image: boolean; // Флаг для удаления картинки на бэке
}

// --- Тип для JSON-объекта, который мы отправляем на бэк ---
export interface RouteCategoryPayload {
  name: string;
  description: string | null;
  image_url?: string | null; // Для отправки URL, если не загружается файл
}

// --- Вспомогательные типы ---
export interface RouteCategoryFilterParams {
  limit?: number;
  offset?: number;
}