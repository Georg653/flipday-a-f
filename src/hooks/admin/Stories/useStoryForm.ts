import { formFields, externalMedia } from '../../../features/JsonImport/schema';
import type { Data } from '../../../features/JsonImport/schema';
import { toRequestError } from '../../../utils/errors';
// --- Путь: src/hooks/admin/Stories/useStoryForm.ts ---

import { toLocalDateTime } from '../../../utils/dates';
import { useState, useEffect } from 'react';
import type {
  Story,
  StoryFormData,
  StoryContentItemFormData,
  StoryCreateUpdatePayload,
} from '../../../types/admin/Stories/story.types';
import { initialStoryFormData, createInitialStoryContentItem } from '../../../types/admin/Stories/story.types';
import { StoriesApi } from '../../../services/admin/Stories/storiesApi';

interface UseStoryFormOptions {
  storyToEdit: Story | null;
  onSuccess: (story: Story) => void;
}

// --- НОВАЯ ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ---
/**
 * Преобразует строку из <input type="datetime-local"> в строку UTC формата "YYYY-MM-DD HH:MM:SS"
 * @param localDateTimeString - строка вида "2025-07-07T14:00"
 * @returns строка вида "2025-07-07 11:00:00" (если локальное время было UTC+3) или null
 */
const formatToUtcStringForBackend = (localDateTimeString: string): string | null => {
  if (!localDateTimeString) {
    return null;
  }
  const date = new Date(localDateTimeString);
  // Проверка на случай, если дата невалидна
  if (isNaN(date.getTime())) {
    return null;
  }
  
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


export const useStoryForm = ({ storyToEdit, onSuccess }: UseStoryFormOptions) => {
  const [formData, setFormData] = useState<StoryFormData>(initialStoryFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (storyToEdit) {
      // При редактировании преобразуем дату из UTC в формат для input
      const localExpiresAt = storyToEdit.expires_at 
        ? toLocalDateTime(storyToEdit.expires_at)
        : '';

      const formReadyData: StoryFormData = {
        name: storyToEdit.name || '',
        is_active: storyToEdit.is_active,
        expires_at: localExpiresAt,
        preview_url: storyToEdit.preview,
        preview_file: null,
        preview_local_url: storyToEdit.preview,
        remove_preview: false,
        content_items: storyToEdit.content_items.map(item => ({
          id: crypto.randomUUID(),
          type: item.type,
          duration: String(item.duration || 5),
          content_url: item.content,
          content_file: null,
          content_preview: item.content,
        })),
      };
      setFormData(formReadyData);
    } else {
      setFormData(initialStoryFormData);
    }
  }, [storyToEdit]);

  // Остальные хендлеры без изменений
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleActiveChange = (checked: boolean) => setFormData(prev => ({ ...prev, is_active: checked }));
  const handlePreviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({...prev, preview_file: file, preview_local_url: file ? URL.createObjectURL(file) : prev.preview_url, remove_preview: false,}));
  };
  const handleRemovePreview = (checked: boolean) => {
    setFormData(prev => ({...prev, remove_preview: checked, preview_file: checked ? null : prev.preview_file, preview_local_url: checked ? null : (prev.preview_file ? URL.createObjectURL(prev.preview_file) : prev.preview_url),}));
  };
  const addContentItem = () => {
    setFormData(prev => ({ ...prev, content_items: [...prev.content_items, createInitialStoryContentItem()] }));
  };
  const removeContentItem = (id: string) => {
    setFormData(prev => ({ ...prev, content_items: prev.content_items.filter(item => item.id !== id) }));
  };
  const handleContentItemChange = (id: string, field: keyof StoryContentItemFormData, value: StoryContentItemFormData[keyof StoryContentItemFormData]) => {
    setFormData(prev => ({...prev, content_items: prev.content_items.map(item => (item.id === id ? { ...item, [field]: value } : item)),}));
  };
  const handleContentItemFileChange = (id: string, file: File | null) => {
    setFormData(prev => ({ ...prev, content_items: prev.content_items.map(item => { if (item.id === id) { if (item.content_preview && item.content_preview.startsWith('blob:')) { URL.revokeObjectURL(item.content_preview); } return { ...item, content_file: file, content_preview: file ? URL.createObjectURL(file) : item.content_url }; } return item; }),}));
  };


  const applyFromJson = (data: Data) => { setFormData(previous => ({ ...previous, ...formFields('stories', data) })); setFormError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const payload: StoryCreateUpdatePayload = {
      name: formData.name || null,
      preview_url: formData.preview_file || formData.remove_preview ? undefined : externalMedia(formData.preview_url),
      is_active: formData.is_active,
      
      // ИСПОЛЬЗУЕМ НАШУ НОВУЮ ФУНКЦИЮ
      expires_at: formatToUtcStringForBackend(formData.expires_at),

      content_items: formData.content_items.map(item => ({
        type: item.type,
        duration: parseFloat(item.duration) || 5,
        content: item.content_file ? '' : (item.content_url || ''),
      })),
    };
    
    const contentMediaFiles = formData.content_items.map(item => item.content_file).filter((file): file is File => file !== null);

    try {
      let result: Story;
      if (storyToEdit) {
        result = await StoriesApi.updateStory(storyToEdit.id, payload, formData.preview_file, contentMediaFiles, formData.remove_preview);
      } else {
        result = await StoriesApi.createStory(payload, formData.preview_file, contentMediaFiles);
      }
      onSuccess(result);
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      const message = err.response?.data?.detail || 'Произошла ошибка при сохранении.';
      setFormError(typeof message === 'string' ? message : JSON.stringify(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { applyFromJson, formData, isSubmitting, formError, handleChange, handleActiveChange, handlePreviewFileChange, handleRemovePreview, addContentItem, removeContentItem, handleContentItemChange, handleContentItemFileChange, handleSubmit };
};