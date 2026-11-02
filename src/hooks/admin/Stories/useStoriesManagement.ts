import { toRequestError } from '../../../utils/errors';
// --- Путь: src/hooks/admin/Stories/useStoriesManagement.ts ---

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Story } from '../../../types/admin/Stories/story.types';
import { StoriesApi } from '../../../services/admin/Stories/storiesApi';

const ITEMS_PER_PAGE = 10;

export const useStoriesManagement = () => {
  const statusRequests = useRef(new Set<number>());
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [storyToEdit, setStoryToEdit] = useState<Story | null>(null);

  // 1. Возвращаемся к нормальной постраничной загрузке (убираем limit=1000)
  const fetchStories = useCallback(async (page: number, isActive?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const data = await StoriesApi.getStories({
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        is_active: isActive, // Мы по-прежнему отправляем этот параметр
      });
      setStories(data);
      setHasNextPage(data.length === ITEMS_PER_PAGE);
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      // 2. Делаем обработку ошибок НАДЕЖНОЙ
      // Превращаем любую ошибку в строку, чтобы React не падал
      let errorMessage = 'Ошибка загрузки историй.';
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        // Если detail - это объект или массив, превращаем его в JSON-строку
        if (typeof detail === 'object') {
          errorMessage = JSON.stringify(detail, null, 2); // null, 2 для красивого вывода
        } else {
          errorMessage = String(detail);
        }
      }
      setError(errorMessage);
      setStories([]); // Гарантируем, что stories - это пустой массив
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories(currentPage, activeFilter);
  }, [currentPage, activeFilter, fetchStories]);
  
  const handleEdit = (story: Story) => {
    setStoryToEdit(story);
    setShowForm(true);
  };

  const handleShowAddForm = () => {
    setStoryToEdit(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту историю?')) return;
    const originalStories = [...stories];
    setStories(stories.filter(s => s.id !== id));
    try {
      await StoriesApi.deleteStory(id);
    } catch {
      
      setError('Ошибка удаления.');
      setStories(originalStories);
    }
  };

  const handleFormSuccess = (updatedStory: Story) => {
    setShowForm(false);
    setStoryToEdit(null);
    if (storyToEdit) {
      setStories(stories.map(s => s.id === updatedStory.id ? updatedStory : s));
    } else {
      if(currentPage === 1) {
        setStories([updatedStory, ...stories].slice(0, ITEMS_PER_PAGE));
      } else {
        setCurrentPage(1);
      }
    }
  };

  const handleFilterChange = (isActive: boolean | undefined) => {
    setActiveFilter(isActive);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleNextPage = () => {
    if (hasNextPage) setCurrentPage(p => p + 1);
  };

  const handleToggleStatus = async (story: Story) => {
    if (statusRequests.current.has(story.id)) return;
    statusRequests.current.add(story.id);
    setUpdatingIds([...statusRequests.current]);
    setError(null);
    try {
      const updated = await StoriesApi.updateStoryStatus(story, !story.is_active);
      setStories(current => current.map(item => item.id === story.id ? updated : item));
      if (activeFilter !== undefined) await fetchStories(currentPage, activeFilter);
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      setError(`Не удалось изменить статус истории «${story.name || story.id}»: ${err.message}`);
    } finally {
      statusRequests.current.delete(story.id);
      setUpdatingIds([...statusRequests.current]);
    }
  };

  return {
    stories,
    updatingIds,
    loading,
    error,
    currentPage,
    handlePreviousPage,
    handleNextPage,
    canGoNext: hasNextPage,
    canGoPrevious: currentPage > 1,
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    showForm,
    setShowForm,
    storyToEdit,
    activeFilter,
    handleFilterChange,
    handleToggleStatus,
  };
};