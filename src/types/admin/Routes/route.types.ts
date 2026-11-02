// --- Путь: src/types/admin/Routes/route.types.ts ---
// ПОЛНАЯ ВЕРСИЯ

import type { PointBase } from '../Points/point.types';

// Тип Маршрута, как он приходит с бэкенда
export interface Route {
  id: number;
  route_category_id: number;
  name: string;
  description: string;
  auto_generated: boolean;
  image: string | null;
  distance: number;
  estimated_time: number;
  budget: number;
  points: PointBase[]; // Ожидаем массив ПОЛНЫХ объектов точек
}

// =============================================================================
// ТИПЫ ДЛЯ ФОРМЫ
// =============================================================================

export interface RouteFormData {
  name: string;
  description: string;
  route_category_id: string; // В select'е это будет строка
  distance: string;
  estimated_time: string;
  budget: string;
  
  image_file: File | null;
  image_preview_url: string | null;
  remove_image: boolean;
  
  // В форме мы храним полные объекты точек для конструктора
  points: PointBase[]; 
}

// =============================================================================
// ТИПЫ ДЛЯ PAYLOAD
// =============================================================================

// Объект, который мы сериализуем в JSON для отправки на бэк
export interface RouteCreateUpdatePayload {
  name: string;
  description: string;
  route_category_id: number;
  distance: number;
  estimated_time: number;
  budget: number;
  image_url?: string | null;
  // На бэк мы отправляем ТОЛЬКО массив ID точек
  points: number[];
}


// =============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ТИПЫ
// =============================================================================

// Параметры для фильтрации в API
export interface RouteFilterParams {
  limit?: number;
  offset?: number;
  category_id?: number | null;
  search?: string;
}