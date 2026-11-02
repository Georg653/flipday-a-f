import { toRequestError } from '../../../utils/errors';
// --- Путь: src/hooks/admin/LearningPagesManagement/useLearningPagesManagement.ts ---

import { useState, useEffect, useCallback } from 'react';
import type { 
  LearningPage,
  TopicOption,
  SubtopicOption
} from '../../../types/admin/LearningPages/learningPage.types';
import { LearningPagesApi } from '../../../services/admin/LearningPages/learningPagesApi';
import { LearningSubtopicsApi } from '../../../services/admin/LearningSubtopics/learningSubtopicsApi'; // Для получения списка подтем
import { LearningTopicsApi } from '../../../services/admin/LearningTopics/learningTopicsApi'; // Для получения списка тем

const ITEMS_PER_PAGE = 10;

export const useLearningPagesManagement = () => {
  // Состояние для выбора темы
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [topicsLoading, setTopicsLoading] = useState(true);

  // Состояние для выбора подтемы
  const [subtopics, setSubtopics] = useState<SubtopicOption[]>([]);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null);
  const [subtopicsLoading, setSubtopicsLoading] = useState(false);

  // Состояние для страниц
  const [pages, setPages] = useState<LearningPage[]>([]);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Пагинация для страниц
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Состояние для модального окна и редактирования
  const [showForm, setShowForm] = useState(false);
  const [pageToEdit, setPageToEdit] = useState<LearningPage | null>(null);

  // 1. Загрузка списка всех тем при монтировании компонента
  useEffect(() => {
    const fetchAllTopics = async () => {
      setTopicsLoading(true);
      setError(null);
      try {
        const data = await LearningTopicsApi.getTopics({ limit: 1000 }); // Получаем все темы
        const formattedTopics = data.map(t => ({ value: String(t.id), label: t.name }));
        setTopics(formattedTopics);
        if (formattedTopics.length > 0) {
          setSelectedTopicId(formattedTopics[0].value); // Автоматически выбираем первую тему
        } else {
          setSelectedTopicId(null); // Если тем нет, сбрасываем выбор
        }
      } catch {
        setError('Ошибка загрузки списка тем.');
        setTopics([]);
        setSelectedTopicId(null);
      } finally {
        setTopicsLoading(false);
      }
    };
    fetchAllTopics();
  }, []);

  // 2. Загрузка списка подтем при изменении выбранной темы
  useEffect(() => {
    const fetchSubtopicsForSelectedTopic = async () => {
      if (!selectedTopicId) {
        setSubtopics([]);
        setSelectedSubtopicId(null);
        return;
      }
      setSubtopicsLoading(true);
      setError(null);
      try {
        const data = await LearningSubtopicsApi.getSubtopicsByTopicId(Number(selectedTopicId), { limit: 1000 }); // Получаем все подтемы для выбранной темы
        const formattedSubtopics = data.map(st => ({ value: String(st.id), label: st.name }));
        setSubtopics(formattedSubtopics);
        if (formattedSubtopics.length > 0) {
          setSelectedSubtopicId(formattedSubtopics[0].value); // Автоматически выбираем первую подтему
        } else {
          setSelectedSubtopicId(null); // Если подтем нет, сбрасываем выбор
        }
      } catch {
        setError('Ошибка загрузки списка подтем.');
        setSubtopics([]);
        setSelectedSubtopicId(null);
      } finally {
        setSubtopicsLoading(false);
      }
    };
    fetchSubtopicsForSelectedTopic();
  }, [selectedTopicId]); // Зависит от выбранной темы

  // 3. Загрузка списка страниц при изменении выбранной подтемы или страницы пагинации
  const fetchPagesForSelectedSubtopic = useCallback(async (subtopicId: number, page: number) => {
    setPagesLoading(true);
    setError(null);
    setPages([]); // Очищаем список перед загрузкой
    try {
      const data = await LearningPagesApi.getPagesBySubtopicId(subtopicId, {
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      });
      setPages(data);
      setHasNextPage(data.length === ITEMS_PER_PAGE);
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      let errorMessage = 'Ошибка загрузки страниц.';
      if (err.response?.data?.detail) {
        errorMessage = JSON.stringify(err.response.data.detail);
      }
      setError(errorMessage);
      setPages([]);
    } finally {
      setPagesLoading(false);
    }
  }, []);

  useEffect(() => {
    // Этот эффект запускается при изменении selectedSubtopicId или currentPage
    if (selectedSubtopicId) {
      fetchPagesForSelectedSubtopic(Number(selectedSubtopicId), currentPage);
    } else {
      setPages([]); // Если подтема не выбрана, страниц нет
    }
  }, [selectedSubtopicId, currentPage, fetchPagesForSelectedSubtopic]);

  // --- Обработчики изменения выбора ---
  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopicId(e.target.value);
    setSelectedSubtopicId(null); // Сбрасываем подтему при смене темы
    setCurrentPage(1); // Сбрасываем пагинацию
  };

  const handleSubtopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubtopicId(e.target.value);
    setCurrentPage(1); // Сбрасываем пагинацию
  };

  // --- Обработчики действий со страницами ---
  const handleEdit = (page: LearningPage) => {
    setPageToEdit(page);
    setShowForm(true);
  };

  const handleShowAddForm = () => {
    if (!selectedSubtopicId) return; // Защита, кнопка и так будет disabled
    setPageToEdit(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту страницу?')) return;
    
    const originalPages = [...pages];
    setPages(current => current.filter(p => p.id !== id));
    
    try {
      await LearningPagesApi.deletePage(id);
      // После удаления перезагружаем страницы для текущей подтемы
      if (selectedSubtopicId) {
        fetchPagesForSelectedSubtopic(Number(selectedSubtopicId), currentPage);
      }
    } catch {
      
      setError('Ошибка удаления страницы.');
      setPages(originalPages); // Откат состояния
    }
  };

  const handleFormSuccess = (updatedPage: LearningPage) => {
    setShowForm(false);
    setPageToEdit(null);
    
    // Если страница принадлежит текущей выбранной подтеме, обновляем список.
    // Иначе (если страница перемещена), переключаемся на новую подтему.
    if (String(updatedPage.subtopic_id) === selectedSubtopicId) {
        fetchPagesForSelectedSubtopic(Number(selectedSubtopicId), currentPage);
    } else {
        // Переключиться на подтему, к которой теперь принадлежит страница
        setSelectedSubtopicId(String(updatedPage.subtopic_id));
        // При этом selectedTopicId тоже нужно будет обновить, если подтема переехала в другую тему.
        // Это более сложный кейс, который может быть решен путем поиска родительской темы для updatedPage.subtopic_id
        // или простой перезагрузкой всего (но это неэффективно).
        // Пока оставим так: пользователь увидит, что страница исчезла из текущей подтемы и может выбрать другую.
        // Более сложное решение: найти topic_id для updatedPage.subtopic_id и обновить selectedTopicId.
    }
  };

  // --- Обработчики пагинации ---
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };
  const handleNextPage = () => {
    if (hasNextPage) setCurrentPage(p => p + 1);
  };
  
  // Общий флаг загрузки
  const isLoading = topicsLoading || subtopicsLoading || pagesLoading;

  return {
    topics, selectedTopicId, handleTopicChange, topicsLoading,
    subtopics, selectedSubtopicId, handleSubtopicChange, subtopicsLoading,
    pages, error, isLoading,
    handleEdit, handleDelete, handleShowAddForm, handleFormSuccess,
    showForm, setShowForm, pageToEdit,
    currentPage, canGoNext: hasNextPage, canGoPrevious: currentPage > 1,
    handleNextPage, handlePreviousPage,
    // ID родительской подтемы для передачи в форму создания
    parentSubtopicId: selectedSubtopicId ? Number(selectedSubtopicId) : null,
  };
};