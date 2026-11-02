import { toRequestError } from '../../../utils/errors';
// --- Путь: src/hooks/admin/LearningTopicsManagement/useLearningTopicsManagement.ts ---

import { useState, useEffect, useCallback } from 'react';
import type { LearningTopic } from '../../../types/admin/LearningTopics/learningTopic.types';
import { LearningTopicsApi } from '../../../services/admin/LearningTopics/learningTopicsApi';

const ITEMS_PER_PAGE = 10;

export const useLearningTopicsManagement = () => {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Состояние для модального окна и редактирования
  const [showForm, setShowForm] = useState(false);
  const [topicToEdit, setTopicToEdit] = useState<LearningTopic | null>(null);

  // Функция для загрузки данных
  const fetchTopics = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await LearningTopicsApi.getTopics({
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      });
      setTopics(data);
      // "Слепая" пагинация: если пришло ровно столько элементов, сколько запрашивали,
      // предполагаем, что есть следующая страница.
      setHasNextPage(data.length === ITEMS_PER_PAGE);
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      let errorMessage = 'Ошибка загрузки тем обучения.';
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        errorMessage = typeof detail === 'object' ? JSON.stringify(detail, null, 2) : String(detail);
      }
      setError(errorMessage);
      setTopics([]); // В случае ошибки сбрасываем массив
    } finally {
      setLoading(false);
    }
  }, []);

  // Первоначальная загрузка данных при монтировании компонента и при смене страницы
  useEffect(() => {
    fetchTopics(currentPage);
  }, [currentPage, fetchTopics]);

  // --- Обработчики действий пользователя ---

  const handleEdit = (topic: LearningTopic) => {
    setTopicToEdit(topic);
    setShowForm(true);
  };

  const handleShowAddForm = () => {
    setTopicToEdit(null); // Сбрасываем тему для редактирования
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту тему обучения? Это может повлиять на связанные подтемы.')) {
      return;
    }
    
    // Оптимистичное удаление из UI
    const originalTopics = [...topics];
    setTopics(currentTopics => currentTopics.filter(t => t.id !== id));
    
    try {
      await LearningTopicsApi.deleteTopic(id);
      // Если удаление на последней странице привело к пустому списку, возможно, стоит перейти на предыдущую
      // Но для простоты пока просто перезагрузим текущую страницу
      if (topics.length === 1 && currentPage > 1) {
        setCurrentPage(p => p - 1);
      }
    } catch {
      
      setError('Ошибка удаления темы.');
      setTopics(originalTopics); // Откат состояния в случае ошибки
    }
  };

  // Коллбэк, который будет вызываться из формы при успешном сохранении
  const handleFormSuccess = (updatedTopic: LearningTopic) => {
    setShowForm(false);
    setTopicToEdit(null);
    if (topicToEdit) {
      // Обновляем существующий элемент в списке
      setTopics(currentTopics => 
        currentTopics.map(t => (t.id === updatedTopic.id ? updatedTopic : t))
      );
    } else {
      // Добавляем новый элемент в начало списка, если мы на первой странице
      if (currentPage === 1) {
        setTopics(currentTopics => [updatedTopic, ...currentTopics].slice(0, ITEMS_PER_PAGE));
      } else {
        // Если мы не на первой странице, просто переходим на нее, чтобы увидеть новый элемент
        setCurrentPage(1);
      }
    }
  };

  // --- Обработчики пагинации ---
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(p => p + 1);
    }
  };

  return {
    topics,
    loading,
    error,
    handleEdit,
    handleDelete,
    handleShowAddForm,
    handleFormSuccess,
    showForm,
    setShowForm,
    topicToEdit,
    // Все для пагинации
    currentPage,
    canGoNext: hasNextPage,
    canGoPrevious: currentPage > 1,
    handleNextPage,
    handlePreviousPage,
  };
};