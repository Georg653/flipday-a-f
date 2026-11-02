// --- Путь: src/types/admin/LearningTopics/learningTopic.types.ts ---

// Тип, описывающий данные, как они приходят с бэкенда (из LearningTopicResponse)
export interface LearningTopic {
  id: number;
  name: string;
  description: string | null;
  experience_points: number;
  order: number;
  image: string | null; // S3 ключ или URL
}

// =============================================================================
// ТИПЫ ДЛЯ ФОРМЫ (то, с чем мы работаем на фронте в useLearningTopicForm)
// =============================================================================

export interface LearningTopicFormData {
  name: string;
  description: string;
  experience_points: string; // В инпутах всегда строки для удобства
  order: string;             // В инпутах всегда строки для удобства

  image_url: string | null;       // Существующий URL/S3-ключ для превью
  image_file: File | null;        // Новый файл для превью
  image_local_url: string | null; // Локальный URL для превью (URL.createObjectURL)
  remove_image: boolean;          // Флаг для удаления изображения
}

// Начальное состояние для формы
export const initialLearningTopicFormData: LearningTopicFormData = {
  name: '',
  description: '',
  experience_points: '10', // Дефолтное значение
  order: '0',              // Дефолтное значение
  image_url: null,
  image_file: null,
  image_local_url: null,
  remove_image: false,
};


// =============================================================================
// ТИПЫ ДЛЯ PAYLOAD (то, что мы сериализуем в JSON и отправляем на бэк)
// =============================================================================

// Payload для создания (все поля обязательны, кроме image_url)
export interface LearningTopicCreatePayload {
  name: string;
  description: string | null;
  experience_points: number;
  order: number;
  image_url: string | null; // Отправляем только если не загружаем файл
}

// Payload для обновления (все поля опциональны)
export interface LearningTopicUpdatePayload {
  name?: string;
  description?: string | null;
  experience_points?: number;
  order?: number;
  image_url?: string | null;
}

// =============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ТИПЫ
// =============================================================================

// Параметры для фильтрации списка тем (пока только пагинация)
export interface LearningTopicFilterParams {
  limit?: number;
  offset?: number;
  // Можно будет добавить name?: string; если на бэке появится фильтр по названию
}