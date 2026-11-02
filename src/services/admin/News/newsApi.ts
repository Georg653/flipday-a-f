// --- Путь: src/services/admin/News/newsApi.ts ---

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { getList } from '../api/list';

import type { 
  News, 
  NewsFilterParams, 
  NewsCreateUpdatePayload 
} from '../../../types/admin/News/news.types';

export const NewsApi = {
  // --- Запросы на чтение ---

  getNewsList: async (params: NewsFilterParams = {}): Promise<News[]> => {
    return getList<News>((`${ENDPOINTS.NEWS_LIST}`), params);
  },

  getNewsById: async (newsId: number): Promise<News> => {
    const response = await axiosInstance.get<News>(ENDPOINTS.NEWS_DETAIL(newsId));
    return response.data;
  },

  // --- Запросы на изменение ---

  deleteNews: async (newsId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.NEWS_DETAIL(newsId));
  },
  
  createNews: async (
    jsonData: NewsCreateUpdatePayload,
    previewFile: File | null,
    backgroundFile: File | null,
    contentFiles: File[]
  ): Promise<News> => {
    const formData = new FormData();
    formData.append('news_data_json', JSON.stringify(jsonData));

    if (previewFile) {
      formData.append('preview_file', previewFile);
    }
    if (backgroundFile) {
      formData.append('background_file', backgroundFile);
    }
    
    contentFiles.forEach(file => {
      formData.append('content_files', file);
    });

    const response = await axiosInstance.post<News>(ENDPOINTS.NEWS_LIST, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateNews: async (
    newsId: number,
    jsonData: NewsCreateUpdatePayload,
    previewFile: File | null,
    backgroundFile: File | null,
    contentFiles: File[],
    removePreview: boolean,
    removeBackground: boolean
  ): Promise<News> => {
    const formData = new FormData();
    formData.append('news_data_json', JSON.stringify(jsonData));

    if (previewFile) {
      formData.append('preview_file', previewFile);
    }
    if (backgroundFile) {
      formData.append('background_file', backgroundFile);
    }
    
    if (removePreview) {
      formData.append('remove_preview', 'true');
    }
    if (removeBackground) {
      formData.append('remove_background', 'true');
    }
    
    contentFiles.forEach(file => {
      formData.append('content_files', file);
    });

    const response = await axiosInstance.put<News>(ENDPOINTS.NEWS_DETAIL(newsId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};