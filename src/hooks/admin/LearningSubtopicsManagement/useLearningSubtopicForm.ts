import { formFields, externalMedia } from '../../../features/JsonImport/schema';
import type { Data } from '../../../features/JsonImport/schema';
import { toRequestError } from '../../../utils/errors';
// --- Путь: src/hooks/admin/LearningSubtopicsManagement/useLearningSubtopicForm.ts ---

import { useState, useEffect } from 'react';
import type {
  LearningSubtopic,
  LearningSubtopicFormData,
  LearningSubtopicCreatePayload,
  LearningSubtopicUpdatePayload,
} from '../../../types/admin/LearningSubtopics/learningSubtopic.types';
import { initialLearningSubtopicFormData } from '../../../types/admin/LearningSubtopics/learningSubtopic.types';
import { LearningSubtopicsApi } from '../../../services/admin/LearningSubtopics/learningSubtopicsApi';
import { createImageUrl } from '../../../utils/media';

interface UseLearningSubtopicFormOptions {
  subtopicToEdit: LearningSubtopic | null;
  onSuccess: (subtopic: LearningSubtopic) => void;
  // Передаем ID родительской темы, чтобы установить его при создании новой подтемы
  parentTopicId: number | null; 
}

export const useLearningSubtopicForm = ({ subtopicToEdit, onSuccess, parentTopicId }: UseLearningSubtopicFormOptions) => {
  // Инициализируем topic_id как пустую строку, чтобы React-Select работал корректно
  const [formData, setFormData] = useState<LearningSubtopicFormData>({ ...initialLearningSubtopicFormData, topic_id: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (subtopicToEdit) {
      // Режим редактирования: заполняем форму данными из subtopicToEdit
      const imageUrl = createImageUrl(subtopicToEdit.image);
      setFormData({
        name: subtopicToEdit.name,
        description: subtopicToEdit.description || '',
        experience_points: String(subtopicToEdit.experience_points),
        order: String(subtopicToEdit.order),
        topic_id: String(subtopicToEdit.topic_id), // Преобразуем в строку для селекта
        image_url: subtopicToEdit.image,
        image_file: null,
        image_local_url: imageUrl,
        remove_image: false,
      });
    } else if (parentTopicId) {
      // Режим создания: сбрасываем форму и устанавливаем ID родительской темы
      setFormData({
        ...initialLearningSubtopicFormData,
        topic_id: String(parentTopicId),
      });
    }
  }, [subtopicToEdit, parentTopicId]);

  // --- ОБРАБОТЧИКИ ИЗМЕНЕНИЙ В ФОРМЕ ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => {
      if (prev.image_local_url && prev.image_local_url.startsWith('blob:')) {
        URL.revokeObjectURL(prev.image_local_url);
      }
      return {
        ...prev,
        image_file: file,
        image_local_url: file ? URL.createObjectURL(file) : prev.image_url,
        remove_image: !file,
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

  const applyFromJson = (data: Data) => { setFormData(previous => ({ ...previous, ...formFields('subtopics', data) })); setFormError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Валидация
    if (!formData.name.trim()) {
      setFormError('Название подтемы не может быть пустым.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.topic_id) {
      setFormError('Необходимо выбрать родительскую тему.');
      setIsSubmitting(false);
      return;
    }

    try {
      let result: LearningSubtopic;
      const topicIdAsNumber = parseInt(formData.topic_id, 10);

      if (subtopicToEdit) {
        // --- Обновление существующей подтемы ---
        const payload: LearningSubtopicUpdatePayload = {
          name: formData.name,
          image_url: formData.image_file || formData.remove_image ? undefined : externalMedia(formData.image_url),
          description: formData.description || null,
          experience_points: parseInt(formData.experience_points, 10),
          order: parseInt(formData.order, 10),
          // Отправляем topic_id, только если он изменился (позволяет перемещать подтему)
          topic_id: topicIdAsNumber !== subtopicToEdit.topic_id ? topicIdAsNumber : undefined,
        };
        result = await LearningSubtopicsApi.updateSubtopic(
          subtopicToEdit.id,
          payload,
          formData.image_file,
          formData.remove_image
        );
      } else {
        // --- Создание новой подтемы ---
        const payload: LearningSubtopicCreatePayload = {
          name: formData.name,
          description: formData.description || null,
          experience_points: parseInt(formData.experience_points, 10),
          order: parseInt(formData.order, 10),
          image_url: formData.image_file || formData.remove_image ? null : externalMedia(formData.image_url) || null,
        };
        // ID родительской темы передается в URL, а не в payload
        result = await LearningSubtopicsApi.createSubtopic(topicIdAsNumber, payload, formData.image_file);
      }
      
      onSuccess(result);

    } catch (cause: unknown) {
      const err = toRequestError(cause);
      const detail = err.response?.data?.detail;
      const errorMessage = typeof detail === 'object' 
        ? JSON.stringify(detail, null, 2) 
        : detail || 'Произошла неизвестная ошибка при сохранении подтемы.';
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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