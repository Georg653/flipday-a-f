// src/services/admin/Achievements/achievementsApi.ts (ФИНАЛЬНЫЙ ФИКС)
import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { getList } from '../api/list';

import type {
  Achievement,
  AchievementCreatePayload,
  AchievementUpdatePayload,
  AchievementFilterParams,
} from '../../../types/admin/Achievements/achievement.types';

export const AchievementsApi = {
  // Этот метод не меняем, он должен работать
  getAchievements: async (params: AchievementFilterParams = {}): Promise<Achievement[]> => {
    return getList<Achievement>((`${ENDPOINTS.ACHIEVEMENTS}`), params);
  },

  getAchievementById: async (achievementId: number): Promise<Achievement> => {
    const response = await axiosInstance.get<Achievement>(ENDPOINTS.ACHIEVEMENT_DETAIL(achievementId));
    return response.data;
  },

  // ----- ВОТ ЗДЕСЬ ИСПРАВЛЕНИЯ -----
  createAchievement: async (
    payload: AchievementCreatePayload,
    imageFile: File | null
  ): Promise<Achievement> => {
    const formData = new FormData();
    // ИЗМЕНЕНО: Просто передаем JSON как строку, без всяких Blob.
    formData.append('achievement_data_json', JSON.stringify(payload)); 
    
    if (imageFile) {
      formData.append('image_file', imageFile);
    }

    const response = await axiosInstance.post<Achievement>(ENDPOINTS.ACHIEVEMENTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateAchievement: async (
    achievementId: number,
    payload: AchievementUpdatePayload,
    imageFile: File | null,
    removeImage: boolean
  ): Promise<Achievement> => {
    const formData = new FormData();
     // ИЗМЕНЕНО: Просто передаем JSON как строку, без всяких Blob.
    formData.append('achievement_data_json', JSON.stringify(payload));

    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    if (removeImage) {
        formData.append('remove_image', 'true');
    }
    
    const response = await axiosInstance.put<Achievement>(ENDPOINTS.ACHIEVEMENT_DETAIL(achievementId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Этот метод тоже не меняем
  deleteAchievement: async (achievementId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.ACHIEVEMENT_DETAIL(achievementId));
  },
};