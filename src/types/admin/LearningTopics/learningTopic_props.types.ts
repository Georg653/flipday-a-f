// --- Путь: src/types/admin/LearningTopics/learningTopic_props.types.ts ---

import type { LearningTopic } from './learningTopic.types';

// Пропсы для таблицы
export interface LearningTopicsTableProps {
  topics: LearningTopic[];
  isLoading: boolean;
  error: string | null;
  onEdit: (topic: LearningTopic) => void;
  onDelete: (id: number) => void;
  // Пагинация
  currentPage: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
}

// Пропсы для хедера
export interface LearningTopicsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  // Здесь могут быть фильтры в будущем, как в NewsHeader
  // filterValue: string;
  // onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Пропсы для формы
export interface LearningTopicFormProps {
  topicToEdit: LearningTopic | null;
  onSuccess: (topic: LearningTopic) => void;
  onCancel: () => void;
}