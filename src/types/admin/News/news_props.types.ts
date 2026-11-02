// --- Путь: src/types/admin/News/news_props.types.ts ---

import type { News, ContentBlockFormData } from './news.types';

// --- Пропсы для основных компонентов страницы ---

export interface NewsTableProps {
  newsItems: News[];
  isLoading: boolean;
  error: string | null;
  onEdit: (newsItem: News) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
}

export interface NewsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  filterValue: string;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface NewsFormProps {
  newsToEdit: News | null;
  onSuccess: (newsItem: News) => void;
  onCancel: () => void;
}


// --- Пропсы для компонентов конструктора контента ---

export interface ContentBlockFormProps {
  block: ContentBlockFormData;
  index: number;
  isSubmitting: boolean;
  onRemoveBlock: (id: string) => void;
  onUpdateBlock: (id: string, newBlockData: Partial<ContentBlockFormData>) => void;
  onAddBlock: (type: ContentBlockFormData['type'], index: number) => void;
  onMoveBlockUp: () => void;   // ИСПРАВЛЕНО: без аргументов
  onMoveBlockDown: () => void; // ИСПРАВЛЕНО: без аргументов
}

export interface AddBlockPanelProps {
  onAddBlock: (type: ContentBlockFormData['type']) => void;
}