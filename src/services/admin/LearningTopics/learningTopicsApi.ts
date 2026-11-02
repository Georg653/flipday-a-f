// --- Путь: src/services/admin/LearningTopics/learningTopicsApi.ts ---

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { getList } from '../api/list';

import type {
  LearningTopic,
  LearningTopicFilterParams,
  LearningTopicCreatePayload,
  LearningTopicUpdatePayload,
} from '../../../types/admin/LearningTopics/learningTopic.types';

export const LearningTopicsApi = {
  // --- Запросы на чтение ---

  /**
   * Получение списка тем обучения с пагинацией.
   */
  getTopics: async (params: LearningTopicFilterParams = {}): Promise<LearningTopic[]> => {
    return getList<LearningTopic>(ENDPOINTS.LEARNING_TOPICS_LIST, params);
  },

  /**
   * Получение одной темы обучения по ее ID.
   */
  getTopicById: async (topicId: number): Promise<LearningTopic> => {
    const response = await axiosInstance.get<LearningTopic>(ENDPOINTS.LEARNING_TOPIC_DETAIL(topicId));
    return response.data;
  },

  // --- Запросы на изменение ---

  /**
   * Удаление темы обучения по ее ID.
   */
  deleteTopic: async (topicId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.LEARNING_TOPIC_DETAIL(topicId));
  },

  /**
   * Создание новой темы обучения.
   * @param jsonData - Данные темы для сериализации в JSON.
   * @param imageFile - Файл изображения (опционально).
   */
  createTopic: async (
    jsonData: LearningTopicCreatePayload,
    imageFile: File | null
  ): Promise<LearningTopic> => {
    const formData = new FormData();
    formData.append('topic_data_json', JSON.stringify(jsonData));

    if (imageFile) {
      formData.append('image_file', imageFile);
    }

    const response = await axiosInstance.post<LearningTopic>(ENDPOINTS.LEARNING_TOPICS_LIST, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Обновление существующей темы обучения.
   * @param topicId - ID темы для обновления.
   * @param jsonData - Данные темы для обновления.
   * @param imageFile - Новый файл изображения (опционально).
   * @param removeImage - Флаг для удаления текущего изображения.
   */
  updateTopic: async (
    topicId: number,
    jsonData: LearningTopicUpdatePayload,
    imageFile: File | null,
    removeImage: boolean
  ): Promise<LearningTopic> => {
    const formData = new FormData();
    formData.append('topic_data_json', JSON.stringify(jsonData));

    if (imageFile) {
      formData.append('image_file', imageFile);
    }

    if (removeImage) {
      formData.append('remove_image', 'true');
    }

    const response = await axiosInstance.put<LearningTopic>(ENDPOINTS.LEARNING_TOPIC_DETAIL(topicId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};