// --- Путь: src/types/admin/RouteCategories/routeCategory_props.types.ts ---

import type { RouteCategory } from './routeCategory.types';

// --- Пропсы для ТАБЛИЦЫ ---
// Убраны все пропсы, связанные с пагинацией, так как ее здесь нет.
export interface RouteCategoriesTableProps {
  categories: RouteCategory[];
  isLoading: boolean;
  error: string | null;
  onEdit: (category: RouteCategory) => void;
  onDelete: (id: number) => void;
}

// --- Пропсы для ХЕДЕРА ---
export interface RouteCategoriesHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
}

// --- Пропсы для ФОРМЫ ---
// Добавлены все необходимые пропсы.
export interface RouteCategoryFormProps {
  categoryToEdit: RouteCategory | null;
  onSuccess: () => void;
  onCancel: () => void;
}