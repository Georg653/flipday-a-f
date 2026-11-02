// --- Путь: src/types/admin/LearningSubtopics/learningSubtopic_props.types.ts ---

import type { LearningSubtopic } from './learningSubtopic.types';
import type { TopicOption } from './learningSubtopic.types';

export interface LearningSubtopicsTableProps {
  subtopics: LearningSubtopic[];
  isLoading: boolean;
  error: string | null;
  onEdit: (subtopic: LearningSubtopic) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
}

export interface LearningSubtopicsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  topics: TopicOption[]; // Список тем для селекта
  selectedTopicId: string | null;
  onTopicChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isAddButtonDisabled: boolean;
}

export interface LearningSubtopicFormProps {
  subtopicToEdit: LearningSubtopic | null;
  onSuccess: (subtopic: LearningSubtopic) => void;
  onCancel: () => void;
  topics: TopicOption[]; // Список тем для селекта в форме
  // `selectedTopicId` не нужен, т.к. он уже будет в subtopicToEdit или установлен при создании
}