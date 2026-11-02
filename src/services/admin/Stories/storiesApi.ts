// --- Путь: src/services/admin/Stories/storiesApi.ts ---

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { getList } from '../api/list';
import type { Story, StoryFilterParams, StoryCreateUpdatePayload } from '../../../types/admin/Stories/story.types';

export const StoriesApi = {
  // ... (getStories, getStoryById, deleteStory, createStory, updateStory остаются без изменений)
  getStories: async (params: StoryFilterParams = {}): Promise<Story[]> => {
    return getList<Story>((`${ENDPOINTS.STORIES}`), params);
  },
  getStoryById: async (storyId: number): Promise<Story> => {
    const response = await axiosInstance.get<Story>(ENDPOINTS.STORY_DETAIL(storyId));
    return response.data;
  },
  deleteStory: async (storyId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.STORY_DETAIL(storyId));
  },
  createStory: async (jsonData: StoryCreateUpdatePayload, previewFile: File | null, contentMediaFiles: File[]): Promise<Story> => {
    const formData = new FormData();
    formData.append('story_data_json', JSON.stringify(jsonData));
    if (previewFile) formData.append('preview_file', previewFile);
    contentMediaFiles.forEach(file => formData.append('story_content_media_files', file));
    const response = await axiosInstance.post<Story>(ENDPOINTS.STORIES, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
  },
  updateStory: async (storyId: number, jsonData: StoryCreateUpdatePayload, previewFile: File | null, contentMediaFiles: File[], removePreview: boolean): Promise<Story> => {
    const formData = new FormData();
    formData.append('story_data_json', JSON.stringify(jsonData));
    if (previewFile) formData.append('preview_file', previewFile);
    if (removePreview) formData.append('remove_preview', 'true');
    contentMediaFiles.forEach(file => formData.append('story_content_media_files', file));
    const response = await axiosInstance.put<Story>(ENDPOINTS.STORY_DETAIL(storyId), formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
  },

  // --- ВМЕСТО patchStory ИСПОЛЬЗУЕМ ЭТО ---
  updateStoryStatus: async (story: Story, newStatus: boolean): Promise<Story> => {
    const formData = new FormData();
    formData.append('story_data_json', JSON.stringify({ is_active: newStatus }));
    return (await axiosInstance.put<Story>(ENDPOINTS.STORY_DETAIL(story.id), formData)).data;
  },
};