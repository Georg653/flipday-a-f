// --- Путь: src/types/admin/Routes/route_props.types.ts ---
// ПОЛНАЯ ВЕРСИЯ

import type { Route } from './route.types';
import type { PointBase } from '../Points/point.types';
import type { RouteCategory } from '../RouteCategories/routeCategory.types';

// --- Пропсы для основных компонентов страницы ---

export interface RoutesTableProps {
  routes: Route[];
  isLoading: boolean;
  error: string | null;
  onEdit: (route: Route) => void;
  onDelete: (id: number) => void;
  // Пагинация
  currentPage: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
}

export interface RoutesHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
  // Пропсы для фильтров
  categoryFilter: string; // ID категории или 'all'
  onCategoryFilterChange: (value: string) => void;
  searchFilter: string;
  onSearchFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Список категорий для выпадающего списка
  categories: RouteCategory[];
}

export interface RouteFormProps {
  routeToEdit: Route | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// --- Пропсы для конструктора точек ---

export interface RoutePointsManagerProps {
    allPoints: PointBase[];       // Все доступные точки
    selectedPoints: PointBase[];  // Точки, уже добавленные в маршрут
    onPointsChange: (newPoints: PointBase[]) => void; // Колбэк при изменении
    disabled: boolean;
}