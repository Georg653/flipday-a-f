// --- Путь: src/types/admin/News/news.types.ts ---

// --- Типы для API, 1-в-1 как на бэке ---
import type { ApiContentBlock as ContentBlock, ContentBlockFormData } from '../../common/content.types';
export type { ContentBlockFormData, CollectionItemFormData, TestOptionFormData } from '../../common/content.types';
export type { ApiContentBlock as ContentBlock } from '../../common/content.types';

export interface News {
  id: number;
  title: string;
  description: string;
  preview: string | null;
  background: string | null;
  content: ContentBlock[];
  created_at?: string;
}

// =============================================================================
// ТИПЫ ДЛЯ ФОРМЫ
// =============================================================================

// Основной тип для всей формы новости
export interface NewsFormData {
  title: string;
  description: string;
  preview_url: string | null;
  preview_file: File | null;
  remove_preview: boolean;
  background_url: string | null;
  background_file: File | null;
  remove_background: boolean;
  content: ContentBlockFormData[];
}

// --- Типы для PAYLOAD ---
export interface NewsCreateUpdatePayload {
  title: string;
  description: string;
  content: ContentBlock[];
  preview_url?: string | null;
  background_url?: string | null;
}

// --- Вспомогательные типы ---
export interface NewsFilterParams { limit?: number; offset?: number; title?: string; }