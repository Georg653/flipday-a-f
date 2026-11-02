// --- Путь: src/types/admin/LearningPages/learningPage.types.ts ---

// Импортируем базовые типы для контент-блоков из модуля News, чтобы не дублировать
// В идеале, их можно вынести в общую директорию src/types/common/content.types.ts
// Но для простоты пока импортируем напрямую.
import type {
  ContentBlock as ApiContentBlock,
  ContentBlockFormData as BaseContentBlockFormData,
} from '../News/news.types';

// Тип для страницы, как она приходит с бэкенда
export interface LearningPage {
  id: number;
  subtopic_id: number;
  page_number: number;
  content: ApiContentBlock[];
  total_pages?: number; // Бэк может присылать это поле
}

// =============================================================================
// ТИПЫ ДЛЯ ФОРМЫ
// =============================================================================

// Тип для блока контента в нашей форме. Он идентичен тому, что в новостях.
export type ContentBlockFormData = BaseContentBlockFormData;

// Основной тип для всей формы страницы обучения
export interface LearningPageFormData {
  page_number: string;
  subtopic_id: string; // ID родительской подтемы
  content: ContentBlockFormData[];
}

// Начальное состояние для формы
export const initialLearningPageFormData: Omit<LearningPageFormData, 'subtopic_id'> = {
  page_number: '1',
  content: [], // Начинаем с пустой страницы
};

// =============================================================================
// ТИПЫ ДЛЯ PAYLOAD (то, что уходит на бэк в page_data_json)
// =============================================================================

// Payload для создания/обновления страницы
export interface LearningPageCreateUpdatePayload {
  page_number: number;
  content: ApiContentBlock[];
}

// =============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ТИПЫ
// =============================================================================

// Параметры для фильтрации списка страниц
export interface LearningPageFilterParams {
  limit?: number;
  offset?: number;
}

// Типы для селектов
export interface TopicOption { value: string; label: string; }
export interface SubtopicOption { value:string; label: string; }