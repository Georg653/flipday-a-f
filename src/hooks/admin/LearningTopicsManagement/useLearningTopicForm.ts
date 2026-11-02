import { formFields, externalMedia } from '../../../features/JsonImport/schema';
import type { Data } from '../../../features/JsonImport/schema';
import { toRequestError } from '../../../utils/errors';
// --- Путь: src/hooks/admin/LearningTopicsManagement/useLearningTopicForm.ts ---

import { useState, useEffect } from 'react';
import type {
  LearningTopic,
  LearningTopicFormData,
  LearningTopicCreatePayload,
  LearningTopicUpdatePayload,
} from '../../../types/admin/LearningTopics/learningTopic.types';
import { initialLearningTopicFormData } from '../../../types/admin/LearningTopics/learningTopic.types';
import { LearningTopicsApi } from '../../../services/admin/LearningTopics/learningTopicsApi';
import { createImageUrl } from '../../../utils/media';

interface UseLearningTopicFormOptions {
  topicToEdit: LearningTopic | null;
  onSuccess: (topic: LearningTopic) => void;
}

export const useLearningTopicForm = ({ topicToEdit, onSuccess }: UseLearningTopicFormOptions) => {
  const [formData, setFormData] = useState<LearningTopicFormData>(initialLearningTopicFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Эффект для заполнения формы, когда передается `topicToEdit`
  useEffect(() => {
    if (topicToEdit) {
      const imageUrl = createImageUrl(topicToEdit.image);
      setFormData({
        name: topicToEdit.name,
        description: topicToEdit.description || '',
        experience_points: String(topicToEdit.experience_points),
        order: String(topicToEdit.order),
        image_url: topicToEdit.image,
        image_file: null,
        image_local_url: imageUrl,
        remove_image: false,
      });
    } else {
      // Сбрасываем форму к начальному состоянию при создании новой темы
      setFormData(initialLearningTopicFormData);
    }
  }, [topicToEdit]);

  // --- ОБРАБОТЧИКИ ИЗМЕНЕНИЙ В ФОРМЕ ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => {
      // Если у нас уже было превью из blob, отменяем его, чтобы избежать утечек памяти
      if (prev.image_local_url && prev.image_local_url.startsWith('blob:')) {
        URL.revokeObjectURL(prev.image_local_url);
      }
      return {
        ...prev,
        image_file: file,
        image_local_url: file ? URL.createObjectURL(file) : prev.image_url,
        remove_image: !file, // Если выбрали новый файл, флаг удаления сбрасывается
      };
    });
  };

  const handleRemoveImage = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      remove_image: checked,
      image_file: checked ? null : prev.image_file,
      image_local_url: checked ? null : (prev.image_file ? URL.createObjectURL(prev.image_file) : createImageUrl(prev.image_url)),
    }));
  };

  // --- ЛОГИКА ОТПРАВКИ ФОРМЫ ---

  const applyFromJson = (data: Data) => { setFormData(previous => ({ ...previous, ...formFields('topics', data) })); setFormError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Валидация
    if (!formData.name.trim()) {
      setFormError('Название темы не может быть пустым.');
      setIsSubmitting(false);
      return;
    }

    try {
      let result: LearningTopic;

      if (topicToEdit) {
        // --- Обновление существующей темы ---
        const payload: LearningTopicUpdatePayload = {
          name: formData.name,
          image_url: formData.image_file || formData.remove_image ? undefined : externalMedia(formData.image_url),
          description: formData.description || null,
          experience_points: parseInt(formData.experience_points, 10),
          order: parseInt(formData.order, 10),
          // image_url не отправляем, бэк сам разберется на основе image_file и remove_image
        };
        result = await LearningTopicsApi.updateTopic(
          topicToEdit.id,
          payload,
          formData.image_file,
          formData.remove_image
        );
      } else {
        // --- Создание новой темы ---
        const payload: LearningTopicCreatePayload = {
          name: formData.name,
          description: formData.description || null,
          experience_points: parseInt(formData.experience_points, 10),
          order: parseInt(formData.order, 10),
          image_url: formData.image_file || formData.remove_image ? null : externalMedia(formData.image_url) || null, // Бэк сам разберется с файлом
        };
        result = await LearningTopicsApi.createTopic(payload, formData.image_file);
      }
      
      onSuccess(result);

    } catch (cause: unknown) {
      const err = toRequestError(cause);
      // Улучшенная обработка ошибок, как в твоих примерах
      const detail = err.response?.data?.detail;
      const errorMessage = typeof detail === 'object' 
        ? JSON.stringify(detail, null, 2) 
        : detail || 'Произошла неизвестная ошибка при сохранении темы.';
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Возвращаем все необходимое для компонента формы
  return { applyFromJson,
    formData,
    isSubmitting,
    formError,
    handleChange,
    handleImageFileChange,
    handleRemoveImage,
    handleSubmit,
  };
};