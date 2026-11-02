// --- Путь: src/types/admin/Points/point_props.types.ts ---
// ПОЛНАЯ ВЕРСИЯ

import type { PointBase, Point } from './point.types';

export interface PointsTableProps {
  points: PointBase[];
  isLoading: boolean;
  error: string | null;
  onEdit: (point: PointBase) => void;
  onDelete: (id: number) => void;
  onPreview: (point: PointBase) => void;
  activePreviewId?: number | null;
  
  // Пагинация
  currentPage: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
}

// --- ИЗМЕНЕНИЯ ЗДЕСЬ ---
export interface PointsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  searchFilter: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface PointFormProps {
  pointToEdit: Point | null;
  onSuccess: (updatedPoint: PointBase) => void;
  onCancel: () => void;
  isFetchingContent: boolean;
}