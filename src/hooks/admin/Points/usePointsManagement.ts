import { toRequestError } from '../../../utils/errors';
// --- Путь: src/hooks/admin/Points/usePointsManagement.ts ---
// ПОЛНАЯ ВЕРСИЯ

import { useState, useEffect, useCallback } from 'react';
import type { Point, PointBase } from '../../../types/admin/Points/point.types';
import { PointsApi } from '../../../services/admin/Points/pointsApi';
import { useDebounce } from '../Routes/useDebounce';

const ITEMS_PER_PAGE = 15;

export const usePointsManagement = () => {
  const [points, setPoints] = useState<PointBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  
  const [searchFilter, setSearchFilter] = useState('');
  const debouncedSearchFilter = useDebounce(searchFilter, 500);
  
  const [showForm, setShowForm] = useState(false);
  const [pointToEdit, setPointToEdit] = useState<Point | null>(null);
  const [isFetchingContent, setIsFetchingContent] = useState(false);

  const fetchPoints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PointsApi.getPoints({
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        name: debouncedSearchFilter || undefined,
      });
      setPoints(data);
      setHasNextPage(data.length === ITEMS_PER_PAGE);
    } catch {
      
      setError('Ошибка загрузки точек.');
      setPoints([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchFilter]); // <--- ПРАВИЛЬНЫЕ ЗАВИСИМОСТИ

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearchFilter(e.target.value);
  };

  const handleShowAddForm = () => {
    setPointToEdit(null);
    setShowForm(true);
  };

  const handleEdit = async (pointBase: PointBase) => {
    setPointToEdit(null);
    setIsFetchingContent(true);
    setShowForm(true);
    try {
      const contentData = await PointsApi.getPointContent(pointBase.id);
      setPointToEdit({ ...pointBase, content: contentData.content });
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      if (err.response && err.response.status === 404) {
        setPointToEdit({ ...pointBase, content: [] });
      } else {
        setError('Ошибка загрузки контента точки.');
        setShowForm(false);
      }
    } finally {
      setIsFetchingContent(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту точку?')) return;
    const originalPoints = [...points];
    setPoints(currentPoints => currentPoints.filter(p => p.id !== id));
    try {
      await PointsApi.deletePoint(id);
      if (points.length === 1 && currentPage > 1) {
          setCurrentPage(p => p - 1);
      } else {
          fetchPoints(); // Перезагружаем текущую страницу
      }
    } catch {
      
      setError('Ошибка удаления.');
      setPoints(originalPoints);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setPointToEdit(null);
    if (currentPage === 1) fetchPoints();
    else setCurrentPage(1);
  };
  
  const handlePreviousPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const handleNextPage = () => { if (hasNextPage) setCurrentPage(p => p + 1); };

  return {
    points, loading, error, handleEdit, handleDelete, handleShowAddForm, handleFormSuccess,
    showForm, setShowForm, pointToEdit, isFetchingContent,
    currentPage, canGoNext: hasNextPage, canGoPrevious: currentPage > 1,
    handlePreviousPage, handleNextPage,
    searchFilter, handleSearchChange,
  };
};