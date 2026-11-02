// --- Путь: src/services/admin/Routes/routesApi.ts ---
// ПОЛНАЯ ВЕРСИЯ

import { PointsApi } from '../Points/pointsApi';
import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { getList } from '../api/list';

import type { 
  Route, 
  RouteFilterParams, 
  RouteCreateUpdatePayload 
} from '../../../types/admin/Routes/route.types';

export const RoutesApi = {
  getRoutes: async (params: RouteFilterParams = {}): Promise<Route[]> => {
    const routes = await getList<Route>(ENDPOINTS.ROUTES, params);
    if (!routes.some(route => route.points.some(point => typeof point === 'number'))) return routes;
    const points = await PointsApi.getPoints({ limit: 10000 });
    return routes.map(route => ({ ...route, points: route.points.map(point => typeof point === 'number' ? points.find(p => p.id === point) : point).filter((p): p is NonNullable<typeof p> => !!p) }));
  },

  getRouteById: async (routeId: number): Promise<Route> => {
    const response = await axiosInstance.get<Route>(ENDPOINTS.ROUTE_DETAIL(routeId));
    return response.data;
  },

  deleteRoute: async (routeId: number): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.ROUTE_DETAIL(routeId));
  },
  
  createRoute: async (
    jsonData: RouteCreateUpdatePayload,
    imageFile: File | null
  ): Promise<Route> => {
    const formData = new FormData();
    formData.append('route_data_json', JSON.stringify(jsonData));

    if (imageFile) {
      formData.append('image_file', imageFile);
    }

    const response = await axiosInstance.post<Route>(ENDPOINTS.ROUTES, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateRoute: async (
    routeId: number,
    jsonData: RouteCreateUpdatePayload, // Бэкенд ожидает полный объект
    imageFile: File | null,
    removeImage: boolean
  ): Promise<Route> => {
    const formData = new FormData();
    
    // Добавляем флаг `remove_image` в JSON, как того ожидает бэкенд
    const payloadWithFlags = jsonData;
    if (removeImage) formData.append('remove_image', 'true');
    formData.append('route_data_json', JSON.stringify(payloadWithFlags));

    if (imageFile) {
      formData.append('image_file', imageFile);
    }
    
    const response = await axiosInstance.put<Route>(ENDPOINTS.ROUTE_DETAIL(routeId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};