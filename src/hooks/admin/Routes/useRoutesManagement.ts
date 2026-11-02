import { toRequestError } from '../../../utils/errors';
// --- Путь: src/hooks/admin/Routes/useRoutesManagement.ts ---
// ПОЛНАЯ ВЕРСИЯ

import { useState, useEffect, useCallback } from 'react';
import type { Route } from '../../../types/admin/Routes/route.types';
import type { RouteCategory } from '../../../types/admin/RouteCategories/routeCategory.types';
import { RoutesApi } from '../../../services/admin/Routes/routesApi';
import { RouteCategoriesApi } from '../../../services/admin/RouteCategories/routeCategoriesApi';
import { useDebounce } from './useDebounce';

const ITEMS_PER_PAGE = 10;

export const useRoutesManagement = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [categories, setCategories] = useState<RouteCategory[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const debouncedSearch = useDebounce(searchFilter, 500);

  const [showForm, setShowForm] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<Route | null>(null);

  const fetchRoutes = useCallback(async (page: number, categoryId?: number | null, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await RoutesApi.getRoutes({
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        category_id: categoryId,
        search: search || undefined,
      });
      setRoutes(data);
      setHasNextPage(data.length === ITEMS_PER_PAGE);
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'object' ? JSON.stringify(detail) : detail || 'Ошибка загрузки маршрутов');
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await RouteCategoriesApi.getRouteCategories({ limit: 1000 });
      setCategories(cats);
    } catch (err) {
      console.error("Не удалось загрузить категории для фильтра", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const catId = categoryFilter === 'all' ? null : Number(categoryFilter);
    fetchRoutes(currentPage, catId, debouncedSearch);
  }, [currentPage, categoryFilter, debouncedSearch, fetchRoutes]);

  const handleEdit = (route: Route) => {
    setRouteToEdit(route);
    setShowForm(true);
  };
  const handleShowAddForm = () => {
    setRouteToEdit(null);
    setShowForm(true);
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот маршрут?')) return;
    
    const originalRoutes = [...routes];
    setRoutes(prev => prev.filter(r => r.id !== id));
    
    try {
      await RoutesApi.deleteRoute(id);
    } catch {
      setError('Ошибка удаления маршрута');
      setRoutes(originalRoutes);
    }
  };
  const handleFormSuccess = () => {
    setShowForm(false);
    setRouteToEdit(null);
    const catId = categoryFilter === 'all' ? null : Number(categoryFilter);
    fetchRoutes(currentPage, catId, debouncedSearch);
  };
  const handlePreviousPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const handleNextPage = () => { if (hasNextPage) setCurrentPage(p => p + 1); };
  
  const handleCategoryFilterChange = (value: string) => {
    setCurrentPage(1);
    setCategoryFilter(value);
  };
  const handleSearchFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearchFilter(e.target.value);
  };
  
  return {
    routes, categories, loading, error, currentPage,
    hasNextPage, showForm, routeToEdit,
    searchFilter, categoryFilter,
    handleEdit, handleShowAddForm, handleDelete, handleFormSuccess,
    setShowForm, handlePreviousPage, handleNextPage,
    handleCategoryFilterChange, handleSearchFilterChange,
  };
};