import { toRequestError } from '../../../utils/errors';
// --- Путь: src/hooks/admin/News/useNewsManagement.ts ---

import { useState, useEffect, useCallback } from 'react';
import type { News } from '../../../types/admin/News/news.types';
import { NewsApi } from '../../../services/admin/News/newsApi';

// Простой debounce хук. Он ждет, пока пользователь перестанет печатать, и только потом обновляет значение.
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const ITEMS_PER_PAGE = 10;

export const useNewsManagement = () => {
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newsToEdit, setNewsToEdit] = useState<News | null>(null);

  // --- ЛОГИКА ДЛЯ ФИЛЬТРА ---
  const [titleFilter, setTitleFilter] = useState('');
  // Используем debounce со значением фильтра и задержкой в 500мс
  const debouncedTitleFilter = useDebounce(titleFilter, 500);

  // --- Функция загрузки данных, теперь она принимает и title ---
  const fetchNews = useCallback(async (page: number, title?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await NewsApi.getNewsList({
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        title: title || undefined, // Отправляем title, если он не пустой
      });
      setNewsItems(data);
      setHasNextPage(data.length === ITEMS_PER_PAGE);
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      let errorMessage = 'Ошибка загрузки новостей.';
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        errorMessage = typeof detail === 'object' ? JSON.stringify(detail, null, 2) : String(detail);
      }
      setError(errorMessage);
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(currentPage, debouncedTitleFilter); }, [currentPage, debouncedTitleFilter, fetchNews]);

  // --- Обработчики действий ---
  const handleEdit = (newsItem: News) => {
    setNewsToEdit(newsItem);
    setShowForm(true);
  };
  const handleShowAddForm = () => {
    setNewsToEdit(null);
    setShowForm(true);
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту новость?')) return;
    const originalNewsItems = [...newsItems];
    setNewsItems(items => items.filter(item => item.id !== id));
    try {
      await NewsApi.deleteNews(id);
    } catch {
      
      setError('Ошибка удаления новости.');
      setNewsItems(originalNewsItems);
    }
  };
  const handleFormSuccess = (updatedNews: News) => {
    setShowForm(false);
    setNewsToEdit(null);
    if (newsToEdit) {
      setNewsItems(items => items.map(item => item.id === updatedNews.id ? updatedNews : item));
    } else {
      if (currentPage === 1 && !titleFilter) {
        setNewsItems(items => [updatedNews, ...items].slice(0, ITEMS_PER_PAGE));
      } else {
        setTitleFilter(''); // Сбрасываем фильтр, чтобы увидеть новую запись
        if (currentPage !== 1) setCurrentPage(1);
      }
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };
  const handleNextPage = () => {
    if (hasNextPage) setCurrentPage(p => p + 1);
  };
  // Обработчик для инпута фильтра
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setTitleFilter(e.target.value);
  };
  
  return {
    newsItems, loading, error, currentPage,
    handlePreviousPage, handleNextPage, canGoNext: hasNextPage, canGoPrevious: currentPage > 1,
    handleEdit, handleShowAddForm, handleDelete, handleFormSuccess,
    showForm, setShowForm, newsToEdit,
    // Возвращаем все для фильтра
    titleFilter,
    handleFilterChange,
  };
};