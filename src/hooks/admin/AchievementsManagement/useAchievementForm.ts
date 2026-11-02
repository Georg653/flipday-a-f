import { formFields, externalMedia } from '../../../features/JsonImport/schema';
import type { Data } from '../../../features/JsonImport/schema';
import { toRequestError } from '../../../utils/errors';
// src/hooks/admin/AchievementsManagement/useAchievementForm.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  Achievement,
  AchievementCreatePayload,
  AchievementUpdatePayload,
  AchievementFormData,
  AchievementFormOptions,
} from '../../../types/admin/Achievements/achievement.types';
import { initialAchievementFormData } from '../../../types/admin/Achievements/achievement.types';
import { AchievementsApi } from '../../../services/admin/Achievements/achievementsApi';

export const useAchievementForm = (options: AchievementFormOptions) => {
  const { onSuccess, achievementToEdit } = options;
  const [formData, setFormData] = useState<AchievementFormData>(initialAchievementFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Этот код без изменений
  const resetForm = useCallback(() => {
    setFormData(initialAchievementFormData);
    setFormError(null);
  }, []);

  useEffect(() => {
    if (achievementToEdit) {
      setFormData({
        name: achievementToEdit.name,
        description: achievementToEdit.description || '',
        achievement_type: achievementToEdit.achievement_type,
        criteria_value: String(achievementToEdit.criteria_value),
        criteria_unit: achievementToEdit.criteria_unit || '',
        image_file: null,
        image_preview_url: achievementToEdit.image,
        remove_image: false, // Теперь TS знает это свойство
      });
    } else {
      resetForm();
    }
  }, [achievementToEdit, resetForm]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;
  
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      image_file: file,
      image_preview_url: file ? URL.createObjectURL(file) : prev.image_preview_url,
      remove_image: file ? false : prev.remove_image, // Теперь TS знает это свойство
    }));
  };
  
  const handleRemoveImage = (checked: boolean) => setFormData(prev => ({ ...prev, remove_image: checked, image_file: checked ? null : prev.image_file }));

  const applyFromJson = (data: Data) => { setFormData(previous => ({ ...previous, ...formFields('achievements', data) })); setFormError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const criteriaValueNumber = parseFloat(formData.criteria_value);
    if (!Number.isInteger(criteriaValueNumber) || criteriaValueNumber <= 0) {
      setFormError('Значение критерия должно быть положительным целым числом.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const isEditing = !!achievementToEdit;
      const payload: AchievementCreatePayload | AchievementUpdatePayload = {
        name: formData.name,
        image_url: formData.image_file || formData.remove_image ? undefined : externalMedia(formData.image_preview_url),
        description: formData.description,
        achievement_type: formData.achievement_type,
        criteria_value: criteriaValueNumber,
        criteria_unit: formData.criteria_unit,
      };

      let result: Achievement;
      if (isEditing) {
        result = await AchievementsApi.updateAchievement(
          achievementToEdit.id,
          payload,
          formData.image_file,
          formData.remove_image // Теперь TS знает это свойство
        );
      } else {
        result = await AchievementsApi.createAchievement(payload as AchievementCreatePayload, formData.image_file);
      }
      onSuccess?.(result); // ИСПРАВЛЕНО: Добавлен `?` для безопасного вызова, на всякий случай
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      const message = err.response?.data?.detail || 'Произошла неизвестная ошибка.';
      setFormError(typeof message === 'string' ? message : JSON.stringify(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { applyFromJson, formData, handleRemoveImage, handleChange, handleFileChange, handleSubmit, isSubmitting, formError, resetForm };
};