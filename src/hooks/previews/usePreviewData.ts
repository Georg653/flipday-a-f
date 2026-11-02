// --- Путь: src/hooks/previews/usePreviewData.ts ---
// ПОЛНАЯ ВЕРСИЯ

import { useMemo, useEffect, useRef } from 'react';
import type { ContentBlockFormData, ApiContentBlock } from '../../types/common/content.types';
import type { ContentPreviewData } from '../../components/previews/ContentPreview/ContentPreview';

type FormDataType = {
  title?: string | null;
  description?: string | null;
  preview_file?: File | null;
  preview_url?: string | null;
  background_file?: File | null;
  background_url?: string | null;
  image_file?: File | null;      // Для Point
  image_url?: string | null;       // Для Point
  content: ContentBlockFormData[];
  page_number?: string;
};

export const usePreviewData = (formData: FormDataType): ContentPreviewData => {
  const objectUrls = useRef<string[]>([]);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => { urls.forEach(URL.revokeObjectURL); };
  }, []);

  return useMemo(() => {
    objectUrls.current.forEach(URL.revokeObjectURL);
    objectUrls.current = [];

    const createLiveUrl = (file?: File | null): string | null => {
      if (file) {
        const url = URL.createObjectURL(file);
        objectUrls.current.push(url);
        return url;
      }
      return null;
    };

    const contentForPreview: ApiContentBlock[] = formData.content.map(formBlock => {
      switch (formBlock.type) {
        case 'image':
        case 'video':
        case 'audio':
          return { ...formBlock, src: createLiveUrl(formBlock.file) ?? formBlock.src } as ApiContentBlock;
        case 'album':
        case 'slider':
          return {
            ...formBlock,
            src: (formBlock.items || []).map(item => createLiveUrl(item.file) ?? item.url).filter(Boolean) as string[],
          } as ApiContentBlock;
        default:
          return formBlock as ApiContentBlock;
      }
    });

    return {
      title: formData.title || (formData.page_number ? `Страница №${formData.page_number}` : ''),
      description: formData.description,
      mainImage: createLiveUrl(formData.preview_file ?? formData.image_file) ?? (formData.preview_url ?? formData.image_url),
      backgroundImage: createLiveUrl(formData.background_file) ?? formData.background_url,
      content: contentForPreview,
    };
  }, [formData]);
};