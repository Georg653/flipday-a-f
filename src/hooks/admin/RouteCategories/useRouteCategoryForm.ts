import { formFields, externalMedia } from '../../../features/JsonImport/schema';
import type { Data } from '../../../features/JsonImport/schema';
import { toRequestError } from '../../../utils/errors';
// --- Путь: src/hooks/admin/RouteCategories/useRouteCategoryForm.ts ---

import { useState, useEffect } from 'react';
import type {
  RouteCategory,
  RouteCategoryFormData,
  RouteCategoryPayload,
} from '../../../types/admin/RouteCategories/routeCategory.types';
import { RouteCategoriesApi } from '../../../services/admin/RouteCategories/routeCategoriesApi';

// Начальное, пустое состояние для формы
const initialFormData: RouteCategoryFormData = {
  name: '',
  description: '',
  image_file: null,
  image_preview_url: null,
  remove_image: false,
};

// ИСПРАВЛЕННЫЙ ИНТЕРФЕЙС
interface UseRouteCategoryFormOptions {
  categoryToEdit: RouteCategory | null;
  onSuccess: () => void; // onSuccess теперь не принимает аргументов
}

export const useRouteCategoryForm = ({ categoryToEdit, onSuccess }: UseRouteCategoryFormOptions) => {
  const [formData, setFormData] = useState<RouteCategoryFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name,
        description: categoryToEdit.description || '',
        image_file: null,
        image_preview_url: categoryToEdit.image,
        remove_image: false,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [categoryToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      image_file: file,
      image_preview_url: file ? URL.createObjectURL(file) : prev.image_preview_url,
      remove_image: file ? false : prev.remove_image,
    }));
  };
  
  const handleRemoveImageChange = (checked: boolean) => {
      setFormData(prev => ({ 
        ...prev, 
        remove_image: checked,
        image_file: checked ? null : prev.image_file,
        image_preview_url: checked ? null : (prev.image_file ? URL.createObjectURL(prev.image_file) : (categoryToEdit?.image || null)),
      }));
  };

  const applyFromJson = (data: Data) => { setFormData(previous => ({ ...previous, ...formFields('categories', data) })); setFormError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Название не может быть пустым.');
      setIsSubmitting(false);
      return;
    }

    const payload: Partial<RouteCategoryPayload> = {
      name: formData.name,
      description: formData.description || null,
    };
    
    payload.image_url = formData.image_file || formData.remove_image ? undefined : externalMedia(formData.image_preview_url);

    try {
      if (categoryToEdit) {
        await RouteCategoriesApi.updateRouteCategory(
          categoryToEdit.id,
          payload,
          formData.image_file,
          formData.remove_image
        );
      } else {
        await RouteCategoriesApi.createRouteCategory(
          payload as RouteCategoryPayload, 
          formData.image_file
        );
      }
      onSuccess();
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      const message = err.response?.data?.detail || 'Произошла ошибка при сохранении.';
      setFormError(typeof message === 'string' ? message : JSON.stringify(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { applyFromJson,
    formData,
    isSubmitting,
    formError,
    handleChange,
    handleFileChange,
    handleRemoveImageChange,
    handleSubmit,
  };
};