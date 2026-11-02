import { JsonImportControl } from '../../../features/JsonImport/JsonImportControl';
// --- Путь: src/components/admin/LearningSubtopicsManagement/LearningSubtopicForm.tsx ---
// ИСПРАВЛЕННАЯ ВЕРСИЯ

import React from 'react';
import { useLearningSubtopicForm } from '../../../hooks/admin/LearningSubtopicsManagement/useLearningSubtopicForm';
import type { LearningSubtopicFormProps } from '../../../types/admin/LearningSubtopics/learningSubtopic_props.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { Select } from '../../ui/Select/Select';
import '../../../styles/admin/ui/Form.css';

// ВАЖНО: Мы теперь принимаем parentTopicId извне для режима создания
interface CorrectedFormProps extends LearningSubtopicFormProps {
  parentTopicIdForNew: number | null;
}

export const LearningSubtopicForm: React.FC<CorrectedFormProps> = ({
  subtopicToEdit,
  onSuccess,
  onCancel,
  topics,
  parentTopicIdForNew, // Используем новый пропс
}) => {
  // --- ВОТ ИСПРАВЛЕНИЕ ---
  // Логика определения parentTopicId теперь находится ВНЕ вызова хука.
  // Если мы редактируем, parentTopicId не нужен, хук возьмет его из subtopicToEdit.
  // Если создаем, берем его из нового пропса.
  const parentTopicId = subtopicToEdit ? null : parentTopicIdForNew;

  const {
    formData, applyFromJson,
    isSubmitting,
    formError,
    handleChange,
    handleImageFileChange,
    handleRemoveImage,
    handleSubmit,
  } = useLearningSubtopicForm({ 
    subtopicToEdit, 
    onSuccess, 
    parentTopicId, // Теперь здесь простая переменная, а не сложное выражение
  });

  // Определяем, заблокирован ли селект темы
  const isTopicSelectDisabled = isSubmitting || !subtopicToEdit;

  return (
    <form onSubmit={handleSubmit} noValidate className="form-container">
          <JsonImportControl kind="subtopics" onApply={applyFromJson} disabled={isSubmitting}/>
      {formError && <p className="form-error">Ошибка: {formError}</p>}
      
      <div className="form-group">
        <label htmlFor="topic_id">Родительская тема*</label>
        <Select
          id="topic_id"
          name="topic_id"
          options={topics}
          value={formData.topic_id}
          onChange={handleChange}
          disabled={isTopicSelectDisabled}
          required
        />
        {isTopicSelectDisabled && !subtopicToEdit && (
          <small className="form-hint">Тема выбрана автоматически. Для смены темы отредактируйте подтему после создания.</small>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="name">Название подтемы*</label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
      </div>

      <div className="form-group">
        <label htmlFor="description">Описание</label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} disabled={isSubmitting} rows={3}/>
      </div>
      
      <div className="form-grid two-columns">
        <div className="form-group">
          <label htmlFor="order">Порядок</label>
          <Input id="order" name="order" type="number" value={formData.order} onChange={handleChange} disabled={isSubmitting} />
        </div>
        <div className="form-group">
          <label htmlFor="experience_points">Опыт</label>
          <Input id="experience_points" name="experience_points" type="number" value={formData.experience_points} onChange={handleChange} disabled={isSubmitting} />
        </div>
      </div>

      <div className="form-group">
        <ImageUpload
          id="subtopic_image" name="image_file" label="Изображение подтемы"
          onChange={handleImageFileChange} previewUrl={formData.image_local_url}
          disabled={isSubmitting || formData.remove_image}
        />
      </div>

      {subtopicToEdit?.image && (
        <div className="form-group">
          <Checkbox
            id="remove_image" name="remove_image" label="Удалить текущее изображение"
            checked={formData.remove_image} onChange={handleRemoveImage}
            disabled={isSubmitting}
          />
        </div>
      )}

      <div className="form-actions">
        <Button type="submit" disabled={isSubmitting} variant="success">
          {isSubmitting ? 'Сохранение...' : 'Сохранить подтему'}
        </Button>
        <Button type="button" onClick={onCancel} disabled={isSubmitting} variant="outline">
          Отмена
        </Button>
      </div>
    </form>
  );
};