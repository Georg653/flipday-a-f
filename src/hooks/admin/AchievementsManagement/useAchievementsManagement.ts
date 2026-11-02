import { toRequestError } from '../../../utils/errors';
// src/hooks/admin/AchievementsManagement/useAchievementsManagement.ts
import { useState, useEffect, useCallback } from 'react';
import type { Achievement } from '../../../types/admin/Achievements/achievement.types';
import { AchievementsApi } from '../../../services/admin/Achievements/achievementsApi';
import { ITEMS_PER_PAGE_ACHIEVEMENTS } from '../../../constants/admin/Achievements/achievements.constants';

export const useAchievementsManagement = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [achievementToEdit, setAchievementToEdit] = useState<Achievement | null>(null);

  const itemsPerPage = ITEMS_PER_PAGE_ACHIEVEMENTS;

  const fetchAchievements = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AchievementsApi.getAchievements({
        offset: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
      });

      // ----- ГЛАВНОЕ ИЗМЕНЕНИЕ - "ЗАЩИТА ОТ ДУРАКА" -----
      // Мы гарантируем, что achievements всегда будет массивом.
      const achievementsData = Array.isArray(data) ? data : [];
      
      setAchievements(achievementsData);
      
      // Логика пагинации теперь тоже безопасна
      setHasNextPage(achievementsData.length === itemsPerPage);

    } catch (cause: unknown) {
      const err = toRequestError(cause);
      const message = err.response?.data?.detail || 'Ошибка загрузки достижений.';
      setError(typeof message === 'string' ? message : JSON.stringify(message));
      console.error('[useAchievementsManagement] Fetch error:', err);
      // При любой ошибке мы тоже гарантируем пустой массив.
      setAchievements([]); 
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchAchievements(currentPage);
  }, [currentPage, fetchAchievements]);
  
  const handleEdit = (achievement: Achievement) => {
    setAchievementToEdit(achievement);
    setShowForm(true);
  };

  const handleShowAddForm = () => {
    setAchievementToEdit(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Точно удалить это достижение?')) return;
    try {
      await AchievementsApi.deleteAchievement(id);
      fetchAchievements(currentPage);
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      const message = err.response?.data?.detail || 'Ошибка удаления.';
      setError(typeof message === 'string' ? message : JSON.stringify(message));
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setAchievementToEdit(null);
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchAchievements(1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleNextPage = () => {
    if (hasNextPage) setCurrentPage(p => p + 1);
  };

  // Этот блок не изменился, он просто возвращает все наши функции и данные
  return {
    achievements,
    loading,
    error,
    currentPage,
    handlePreviousPage,
    handleNextPage,
    canGoNext: hasNextPage,
    canGoPrevious: currentPage > 1,
    itemsPerPage: itemsPerPage,
    totalItems: -1, // Это все еще для пагинации
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    showForm,
    setShowForm,
    achievementToEdit,
  };
};