// --- Путь: src/services/admin/LearningPages/learningPagesApi.ts ---

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { getList } from '../api/list';

import type {
  LearningPage,
  LearningPageFilterParams,
  LearningPageCreateUpdatePayload,
} from '../../../types/admin/LearningPages/learningPage.types';

export const LearningPagesApi = {
  // --- Запросы на чтение ---

  /**
   * Получение списка страниц для КОНКРЕТНОЙ подтемы с пагинацией.
   * @param subtopicId - ID родительской подтемы.
   * @param params - Параметры пагинации.
   */
  getPagesBySubtopicId: async (
    subtopicId: number,
    params: LearningPageFilterParams = {}
  ): Promise<LearningPage[]> => {
    if (!subtopicId || isNaN(subtopicId)) {
      return []; // Защита от невалидного запроса
    }
    return getList<LearningPage>(`${ENDPOINTS.LEARNING_PAGES_BY_SUBTOPIC(subtopicId)}`, params);
  },

  /**
   * Получение одной страницы по ее ID.
   */
  getPageById: async (pageId: number): Promise<LearningPage> => {
    const response = await axiosInstance.get<LearningPage>(ENDPOINTS.LEARNING_PAGE_DETAIL(pageId));
    return response.data;
  },

  // --- Запросы на изменение ---

  /**
   * Удаление страницы по ее ID.
   */
  deletePage: async (pageId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.LEARNING_PAGE_DETAIL(pageId));
  },

  /**
   * Создание новой страницы обучения.
   * @param subtopicId - ID родительской подтемы.
   * @param jsonData - Данные страницы (номер, контент).
   * @param contentFiles - Список файлов для блоков контента.
   */
  createPage: async (
    subtopicId: number,
    jsonData: LearningPageCreateUpdatePayload,
    contentFiles: File[]
  ): Promise<LearningPage> => {
    const formData = new FormData();
    formData.append('page_data_json', JSON.stringify(jsonData));

    contentFiles.forEach(file => {
      formData.append('content_files', file);
    });

    const url = ENDPOINTS.LEARNING_PAGES_BY_SUBTOPIC(subtopicId);
    
    const response = await axiosInstance.post<LearningPage>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Обновление существующей страницы обучения.
   * @param pageId - ID страницы для обновления.
   * @param jsonData - Полные новые данные страницы.
   * @param contentFiles - Список НОВЫХ файлов для блоков контента.
   */
  updatePage: async (
    pageId: number,
    jsonData: LearningPageCreateUpdatePayload,
    contentFiles: File[]
  ): Promise<LearningPage> => {
    const formData = new FormData();
    formData.append('page_data_json', JSON.stringify(jsonData));

    contentFiles.forEach(file => {
      formData.append('content_files', file);
    });

    const url = ENDPOINTS.LEARNING_PAGE_DETAIL(pageId);

    // ВАЖНО: Твой бэкенд для обновления использует PUT, а не PATCH.
    // Это значит, мы должны передавать все данные целиком.
    const response = await axiosInstance.put<LearningPage>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};