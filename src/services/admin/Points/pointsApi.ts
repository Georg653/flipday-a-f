// --- Путь: src/services/admin/Points/pointsApi.ts ---
// ПОЛНАЯ ВЕРСИЯ

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { getList } from '../api/list';

import type {
  PointBase,
  PointContentData,
  PointFilterParams,
  PointCreateUpdatePayload,
} from '../../../types/admin/Points/point.types';

export const PointsApi = {
  /**
   * Получает список точек (БЕЗ контента).
   */
  getPoints: async (params: PointFilterParams = {}): Promise<PointBase[]> => {
    return getList<PointBase>((`${ENDPOINTS.POINTS}`), params);
  },

  /**
   * Получает КОНТЕНТ для одной точки.
   */
  getPointContent: async (pointId: number): Promise<PointContentData> => {
    // ВАЖНО: Убедимся, что эндпоинт правильный (со слешем или без)
    const url = ENDPOINTS.POINT_CONTENT(pointId);
    const response = await axiosInstance.get<PointContentData>(url);
    return response.data;
  },

  /**
   * Удаляет точку по ее ID.
   */
  deletePoint: async (pointId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.POINT_DETAIL(pointId));
  },

  /**
   * Создает новую точку.
   */
  createPoint: async (
    jsonData: PointCreateUpdatePayload,
    imageFile: File | null,
    contentFiles: File[]
  ): Promise<PointBase> => {
    const formData = new FormData();
    formData.append('point_data_json', JSON.stringify(jsonData));
    if (imageFile) {
      formData.append('point_image_file', imageFile);
    }
    contentFiles.forEach(file => {
      formData.append('content_media_files', file);
    });

    const response = await axiosInstance.post<PointBase>(ENDPOINTS.POINTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Обновляет существующую точку.
   */
  updatePoint: async (
    pointId: number,
    jsonData: PointCreateUpdatePayload,
    imageFile: File | null,
    contentFiles: File[],
    removeImage: boolean
  ): Promise<PointBase> => {
    const formData = new FormData();
    formData.append('point_data_json', JSON.stringify(jsonData));

    if (imageFile) {
      formData.append('point_image_file', imageFile);
    }
    if (removeImage) {
      formData.append('remove_point_image', 'true');
    }
    contentFiles.forEach(file => {
      formData.append('content_media_files', file);
    });

    const response = await axiosInstance.put<PointBase>(ENDPOINTS.POINT_DETAIL(pointId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};