// --- Путь: src/services/admin/RouteCategories/routeCategoriesApi.ts ---

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { getList } from '../api/list';

import type { 
  RouteCategory, 
  RouteCategoryFilterParams, 
  RouteCategoryPayload 
} from '../../../types/admin/RouteCategories/routeCategory.types';

export const RouteCategoriesApi = {
  // --- Запросы на чтение ---

  getRouteCategories: async (params: RouteCategoryFilterParams = {}): Promise<RouteCategory[]> => {
    return getList<RouteCategory>((`${ENDPOINTS.ROUTE_CATEGORIES}`), params);
  },

  getRouteCategoryById: async (categoryId: number): Promise<RouteCategory> => {
    const response = await axiosInstance.get<RouteCategory>(ENDPOINTS.ROUTE_CATEGORY_DETAIL(categoryId));
    return response.data;
  },

  // --- Запросы на изменение ---

  deleteRouteCategory: async (categoryId: number): Promise<void> => {
    // Категорию с ID=1 удалять нельзя, но эту проверку лучше делать в хуке
    await axiosInstance.delete(ENDPOINTS.ROUTE_CATEGORY_DETAIL(categoryId));
  },
  
  createRouteCategory: async (
    jsonData: RouteCategoryPayload,
    imageFile: File | null
  ): Promise<RouteCategory> => {
    const formData = new FormData();
    formData.append('category_data_json', JSON.stringify(jsonData));

    if (imageFile) {
      formData.append('image_file', imageFile);
    }

    const response = await axiosInstance.post<RouteCategory>(ENDPOINTS.ROUTE_CATEGORIES, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateRouteCategory: async (
    categoryId: number,
    jsonData: Partial<RouteCategoryPayload>, // При обновлении поля могут быть частичными
    imageFile: File | null,
    removeImage: boolean
  ): Promise<RouteCategory> => {
    const formData = new FormData();
    // Бэк ожидает `category_data_json`, даже если он пустой
    formData.append('category_data_json', JSON.stringify(jsonData));

    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    
    if (removeImage) {
      formData.append('remove_image', 'true');
    }

    const response = await axiosInstance.put<RouteCategory>(ENDPOINTS.ROUTE_CATEGORY_DETAIL(categoryId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};