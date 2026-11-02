import { JsonImportControl } from '../../../features/JsonImport/JsonImportControl';
// --- Путь: src/components/admin/LearningTopicsManagement/LearningTopicForm.tsx ---

import React from 'react';
import { useLearningTopicForm } from '../../../hooks/admin/LearningTopicsManagement/useLearningTopicForm';
import type { LearningTopicFormProps } from '../../../types/admin/LearningTopics/learningTopic_props.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import '../../../styles/admin/ui/Form.css';

export const LearningTopicForm: React.FC<LearningTopicFormProps> = ({
  topicToEdit,
  onSuccess,
  onCancel,
}) => {
  const {
    formData, applyFromJson,
    isSubmitting,
    formError,
    handleChange,
    handleImageFileChange,
    handleRemoveImage,
    handleSubmit,
  } = useLearningTopicForm({ topicToEdit, onSuccess });

  return (
    <form onSubmit={handleSubmit} noValidate className="form-container">
          <JsonImportControl kind="topics" onApply={applyFromJson} disabled={isSubmitting}/>
      {formError && <p className="form-error">Ошибка: {formError}</p>}
      
      <div className="form-group">
        <label htmlFor="name">Название темы*</label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
      </div>

      <div className="form-group">
        <label htmlFor="description">Описание</label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} disabled={isSubmitting} rows={4}/>
      </div>
      
      <div className="form-grid two-columns">
        <div className="form-group">
          <label htmlFor="order">Порядок сортировки</label>
          <Input id="order" name="order" type="number" value={formData.order} onChange={handleChange} disabled={isSubmitting} />
        </div>
        <div className="form-group">
          <label htmlFor="experience_points">Количество опыта</label>
          <Input id="experience_points" name="experience_points" type="number" value={formData.experience_points} onChange={handleChange} disabled={isSubmitting} />
        </div>
      </div>

      <div className="form-group">
        <ImageUpload
          id="topic_image"
          name="image_file"
          label="Изображение темы"
          onChange={handleImageFileChange}
          previewUrl={formData.image_local_url}
          disabled={isSubmitting || formData.remove_image}
        />
      </div>

      {topicToEdit?.image && (
        <div className="form-group">
          <Checkbox
            id="remove_image"
            name="remove_image"
            label="Удалить текущее изображение"
            checked={formData.remove_image}
            onChange={handleRemoveImage}
            disabled={isSubmitting}
          />
        </div>
      )}

      <div className="form-actions">
        <Button type="submit" disabled={isSubmitting} variant="success">
          {isSubmitting ? 'Сохранение...' : 'Сохранить тему'}
        </Button>
        <Button type="button" onClick={onCancel} disabled={isSubmitting} variant="outline">
          Отмена
        </Button>
      </div>
    </form>
  );
};