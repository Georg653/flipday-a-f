// --- Путь: src/types/admin/Stories/story_props.types.ts ---

import type { Story } from './story.types';

export interface StoriesTableProps {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  onEdit: (story: Story) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (story: Story) => void; // <--- ДОБАВЛЕНО
  // Пагинация
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export interface StoriesHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  activeFilter: boolean | undefined;
  onFilterChange: (value: boolean | undefined) => void;
}

export interface StoryFormProps {
  storyToEdit: Story | null;
  onSuccess: (story: Story) => void;
  onCancel: () => void;
}