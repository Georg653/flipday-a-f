import { JsonImportControl } from '../../../features/JsonImport/JsonImportControl';
// --- Путь: src/components/admin/RouteCategoriesManagement/RouteCategoryForm.tsx ---

import React from 'react';
import { useRouteCategoryForm } from '../../../hooks/admin/RouteCategories/useRouteCategoryForm';
import type { RouteCategoryFormProps } from '../../../types/admin/RouteCategories/routeCategory_props.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import '../../../styles/admin/ui/Form.css';

export const RouteCategoryForm: React.FC<RouteCategoryFormProps> = ({
  categoryToEdit,
  onSuccess,
  onCancel,
}) => {
  const {
    formData, applyFromJson,
    isSubmitting,
    formError,
    handleChange,
    handleFileChange,
    handleRemoveImageChange,
    handleSubmit,
  } = useRouteCategoryForm({ categoryToEdit, onSuccess });

  return (
    <form onSubmit={handleSubmit} noValidate className="form-container">
          <JsonImportControl kind="categories" onApply={applyFromJson} disabled={isSubmitting}/>
      {formError && <p className="form-error">Ошибка: {formError}</p>}
      
      <div className="form-inputs">
        <div className="form-group">
          <label htmlFor="name">Название*</label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} disabled={isSubmitting} />
        </div>

        <div className="form-group">
          <ImageUpload
            id="category_image"
            name="image_file"
            label="Изображение"
            onChange={handleFileChange}
            previewUrl={formData.image_preview_url}
            disabled={isSubmitting || formData.remove_image}
          />
        </div>
        
        {/* Показываем чекбокс только при редактировании, если есть старая картинка */}
        {categoryToEdit?.image && (
          <div className="form-group">
            <Checkbox
              id="remove_image_category"
              label="Удалить текущее изображение"
              checked={formData.remove_image}
              onChange={handleRemoveImageChange}
              disabled={isSubmitting}
            />
          </div>
        )}
      </div>
      
      <div className="form-actions">
        <Button type="submit" disabled={isSubmitting} variant="success">
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </Button>
        <Button type="button" onClick={onCancel} disabled={isSubmitting} variant="outline">
          Отмена
        </Button>
      </div>
    </form>
  );
};