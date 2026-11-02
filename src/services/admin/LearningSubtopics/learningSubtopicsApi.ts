// --- Путь: src/services/admin/LearningSubtopics/learningSubtopicsApi.ts ---
// ПОЛНАЯ ПЕРЕПИСАННАЯ ВЕРСИЯ

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { getList } from '../api/list';

import type {
  LearningSubtopic,
  LearningSubtopicFilterParams,
  LearningSubtopicCreatePayload,
  LearningSubtopicUpdatePayload,
} from '../../../types/admin/LearningSubtopics/learningSubtopic.types';
// Мы также работаем с темами, поэтому импортируем и их тип
import type { LearningTopic } from '../../../types/admin/LearningTopics/learningTopic.types';

export const LearningSubtopicsApi = {
  // =======================================================================
  // === ОСНОВНЫЕ МЕТОДЫ ДЛЯ РАБОТЫ С ПОДТЕМАМИ (SUBTOPICS) ===
  // =======================================================================

  /**
   * Получение списка подтем для КОНКРЕТНОЙ темы с пагинацией.
   * Этот метод требует ID родительской темы.
   * @param topicId - ID родительской темы.
   * @param params - Параметры пагинации (limit, offset).
   */
  getSubtopicsByTopicId: async (
    topicId: number,
    params: LearningSubtopicFilterParams = {}
  ): Promise<LearningSubtopic[]> => {
    // ЗАЩИТА: Убедимся, что topicId валидный, прежде чем делать запрос.
    if (!topicId || typeof topicId !== 'number' || isNaN(topicId)) {
      console.error(
        'API_ERROR: Попытка запросить подтемы с неверным topicId:',
        topicId
      );
      // Возвращаем пустой массив, чтобы избежать ошибки 422 на бэкенде.
      return [];
    }

    return getList<LearningSubtopic>(`${ENDPOINTS.LEARNING_SUBTOPICS_BY_TOPIC(topicId)}`, params);
  },

  /**
   * Получение одной конкретной подтемы по ее уникальному ID.
   * @param subtopicId - ID подтемы.
   */
  getSubtopicById: async (subtopicId: number): Promise<LearningSubtopic> => {
    const response = await axiosInstance.get<LearningSubtopic>(
      ENDPOINTS.LEARNING_SUBTOPIC_DETAIL(subtopicId)
    );
    return response.data;
  },

  /**
   * Удаление подтемы по ее ID.
   * @param subtopicId - ID подтемы.
   */
  deleteSubtopic: async (subtopicId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.LEARNING_SUBTOPIC_DETAIL(subtopicId));
  },

  /**
   * Создание новой подтемы для конкретной темы.
   * @param topicId - ID родительской темы (для URL).
   * @param jsonData - Данные подтемы для JSON-поля.
   * @param imageFile - Файл изображения (опционально).
   */
  createSubtopic: async (
    topicId: number,
    jsonData: LearningSubtopicCreatePayload,
    imageFile: File | null
  ): Promise<LearningSubtopic> => {
    // ЗАЩИТА: Проверяем topicId перед отправкой
    if (!topicId || typeof topicId !== 'number' || isNaN(topicId)) {
      throw new Error('Невозможно создать подтему без валидного ID родительской темы.');
    }

    const formData = new FormData();
    formData.append('subtopic_data_json', JSON.stringify(jsonData));

    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    
    const url = ENDPOINTS.LEARNING_SUBTOPICS_BY_TOPIC(topicId);
    
    const response = await axiosInstance.post<LearningSubtopic>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Обновление существующей подтемы по ее ID.
   * @param subtopicId - ID подтемы для обновления.
   * @param jsonData - Данные для обновления.
   * @param imageFile - Новый файл изображения (опционально).
   * @param removeImage - Флаг для удаления текущего изображения.
   */
  updateSubtopic: async (
    subtopicId: number,
    jsonData: LearningSubtopicUpdatePayload,
    imageFile: File | null,
    removeImage: boolean
  ): Promise<LearningSubtopic> => {
    const formData = new FormData();
    formData.append('subtopic_data_json', JSON.stringify(jsonData));

    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    if (removeImage) {
      formData.append('remove_image', 'true');
    }

    const response = await axiosInstance.put<LearningSubtopic>(
      ENDPOINTS.LEARNING_SUBTOPIC_DETAIL(subtopicId),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  // =======================================================================
  // === ВСПОМОГАТЕЛЬНЫЙ МЕТОД ДЛЯ ПОЛУЧЕНИЯ СПИСКА ТЕМ (TOPICS) ===
  // =======================================================================

  /**
   * Получает ВСЕ темы обучения для использования в выпадающем списке (селекте).
   * Используем большой лимит, чтобы получить все темы сразу.
   * В реальном проекте с >1000 тем может понадобиться поиск с подгрузкой.
   */
  getAllTopics: async (): Promise<LearningTopic[]> => {
    return getList<LearningTopic>(ENDPOINTS.LEARNING_TOPICS_LIST, { limit: 1000 });
  },
};