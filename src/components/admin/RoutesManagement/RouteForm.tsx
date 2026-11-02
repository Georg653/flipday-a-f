import { JsonImportControl } from '../../../features/JsonImport/JsonImportControl';
// --- Путь: src/components/admin/RoutesManagement/RouteForm.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React from 'react';
import { useRouteForm } from '../../../hooks/admin/Routes/useRouteForm';
import type { RouteFormProps } from '../../../types/admin/Routes/route_props.types';
import type { SelectOption } from '../../ui/Select/Select';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Select } from '../../ui/Select/Select';
import { RoutePointsManager } from './RoutePointsManager';

import '../../../styles/admin/ui/Form.css';
import './RouteForm.css';

export const RouteForm: React.FC<RouteFormProps> = ({
  routeToEdit,
  onSuccess,
  onCancel,
}) => {
  const {
    formData, applyFromJson, isSubmitting, formError, allCategories, allPoints,
    isLoading, handleChange, handleFileChange, handleRemoveImage,
    handlePointsChange, handleSubmit,
  } = useRouteForm({ routeToEdit, onSuccess });

  const categoryOptions: SelectOption[] = allCategories
    .filter(cat => !cat.name.toLowerCase().includes('auto'))
    .map(cat => ({ value: String(cat.id), label: cat.name }));

  if (isLoading) {
    return <div className="form-loading-message">Загрузка данных для формы...</div>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="form-container route-form">
          <JsonImportControl kind="routes" onApply={applyFromJson} disabled={isSubmitting}/>
      {formError && <p className="form-error">{formError}</p>}
      
      <div className="route-form-grid">
        {/* Левая колонка с основными настройками */}
        <div className="form-column form-column-meta">
          <h4>Основные данные</h4>
          <div className="form-group">
            <label htmlFor="name">Название*</label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
          </div>
          <div className="form-group">
            <label htmlFor="route_category_id">Категория*</label>
            <Select id="route_category_id" name="route_category_id"
              options={categoryOptions} value={formData.route_category_id}
              onChange={handleChange} required disabled={isSubmitting} placeholder="Выберите категорию..." />
          </div>
          <div className="form-group">
            <label htmlFor="description">Описание*</label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required disabled={isSubmitting} rows={4}/>
          </div>
          <div className="form-group-inline">
            <div className="form-group"><label htmlFor="distance">Дистанция (м)</label><Input id="distance" name="distance" type="number" value={formData.distance} onChange={handleChange} disabled={isSubmitting} /></div>
            <div className="form-group"><label htmlFor="estimated_time">Время (мин)</label><Input id="estimated_time" name="estimated_time" type="number" value={formData.estimated_time} onChange={handleChange} disabled={isSubmitting} /></div>
            <div className="form-group"><label htmlFor="budget">Бюджет</label><Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleChange} disabled={isSubmitting} /></div>
          </div>
          <div className="form-group">
            <ImageUpload
              id="route_image" name="image_file" label="Изображение маршрута"
              onChange={handleFileChange}
              previewUrl={formData.image_preview_url}
              disabled={isSubmitting || formData.remove_image}
              buttonPosition="right"
            />
            {routeToEdit?.image && (
              <Checkbox id="remove_image_route" label="Удалить изображение" checked={formData.remove_image} onChange={handleRemoveImage} disabled={isSubmitting}/>
            )}
          </div>
        </div>

        {/* Правая колонка с менеджером точек */}
        <div className="form-column">
           <RoutePointsManager
             allPoints={allPoints}
             selectedPoints={formData.points}
             onPointsChange={handlePointsChange}
             disabled={isSubmitting}
           />
        </div>
      </div>
      
      <div className="form-actions">
        <Button type="submit" disabled={isSubmitting} variant="success">
          {isSubmitting ? 'Сохранение...' : 'Сохранить маршрут'}
        </Button>
        <Button type="button" onClick={onCancel} disabled={isSubmitting} variant="outline">
          Отмена
        </Button>
      </div>
    </form>
  );
};