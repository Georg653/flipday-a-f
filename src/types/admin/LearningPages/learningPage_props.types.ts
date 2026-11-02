// --- Путь: src/types/admin/LearningPages/learningPage_props.types.ts ---

import type { LearningPage } from './learningPage.types';
import type { TopicOption, SubtopicOption } from './learningPage.types';

export interface LearningPagesTableProps {
  pages: LearningPage[];
  isLoading: boolean;
  error: string | null;
  onEdit: (page: LearningPage) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
}

export interface LearningPagesHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  // Селекторы для тем и подтем
  topics: TopicOption[];
  subtopics: SubtopicOption[];
  selectedTopicId: string | null;
  selectedSubtopicId: string | null;
  onTopicChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubtopicChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isAddButtonDisabled: boolean;
}

export interface LearningPageFormProps {
  pageToEdit: LearningPage | null;
  onSuccess: (page: LearningPage) => void;
  onCancel: () => void;
  // ID родительской подтемы для создания новой страницы
  parentSubtopicId: number | null;
}