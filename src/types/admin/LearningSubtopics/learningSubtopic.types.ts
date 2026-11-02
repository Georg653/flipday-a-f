// --- Путь: src/types/admin/LearningSubtopics/learningSubtopic.types.ts ---

// Тип, описывающий данные, как они приходят с бэкенда
// На основе вашей схемы LearningSubtopicSchema
export interface LearningSubtopic {
  id: number;
  topic_id: number;
  name: string;
  description: string | null;
  experience_points: number;
  image: string | null;
  order: number;
  // Поля is_completed и is_unlocked в админке не так важны, но пусть будут
  is_completed?: boolean;
  is_unlocked?: boolean;
}

// =============================================================================
// ТИПЫ ДЛЯ ФОРМЫ
// =============================================================================

export interface LearningSubtopicFormData {
  name: string;
  description: string;
  experience_points: string;
  order: string;
  topic_id: string; // ID родительской темы, в селекте это будет строка

  image_url: string | null;
  image_file: File | null;
  image_local_url: string | null;
  remove_image: boolean;
}

// Начальное состояние для формы (topic_id будет устанавливаться извне)
export const initialLearningSubtopicFormData: Omit<LearningSubtopicFormData, 'topic_id'> = {
  name: '',
  description: '',
  experience_points: '10',
  order: '0',
  image_url: null,
  image_file: null,
  image_local_url: null,
  remove_image: false,
};


// =============================================================================
// ТИПЫ ДЛЯ PAYLOAD (то, что уходит на бэк)
// =============================================================================

// Payload для создания (topic_id не нужен, т.к. он в URL)
export interface LearningSubtopicCreatePayload {
  name: string;
  description: string | null;
  experience_points: number;
  order: number;
  image_url: string | null;
}

// Payload для обновления (topic_id опционален, если мы хотим переместить подтему)
export interface LearningSubtopicUpdatePayload {
  name?: string;
  description?: string | null;
  experience_points?: number;
  order?: number;
  topic_id?: number; // Для перемещения между темами
  image_url?: string | null;
}

// =============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ТИПЫ
// =============================================================================

// Параметры для фильтрации списка подтем
export interface LearningSubtopicFilterParams {
  limit?: number;
  offset?: number;
  // Фильтра по названию пока нет, но можно будет добавить
}

// Тип для опции в селекте выбора темы
export interface TopicOption {
  value: string;
  label: string;
}