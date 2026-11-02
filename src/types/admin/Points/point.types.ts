// --- Путь: src/types/admin/Points/point.types.ts ---
// ПОЛНАЯ ВЕРСИЯ

import type { ApiContentBlock, ContentBlockFormData } from '../../common/content.types';

export interface PointBase {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  is_partner: boolean;
  budget: number;
  image: string | null;
}
export interface PointContentData {
  content: ApiContentBlock[];
}
export type Point = PointBase & PointContentData;

export interface PointFormData {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  is_partner: boolean;
  budget: string;
  image_url: string | null;
  image_file: File | null;
  remove_image: boolean;
  manageContent: boolean;
  content: ContentBlockFormData[];
}

export interface PointCreateUpdatePayload {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  is_partner: boolean;
  budget: number;
  image_url?: string | null;
  content_data?: {
    content: ApiContentBlock[];
  };
  remove_content?: boolean;
}

export interface PointFilterParams {
  limit?: number;
  offset?: number;
  name?: string; // <--- ДОБАВЛЕНО ДЛЯ ПОИСКА
}