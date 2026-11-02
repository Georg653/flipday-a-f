import { JsonImportControl } from '../../../features/JsonImport/JsonImportControl';
// --- Путь: src/components/admin/PointsManagement/PointForm.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

import { usePointForm } from '../../../hooks/admin/Points/usePointForm';
import type { PointFormProps } from '../../../types/admin/Points/point_props.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { ContentBlockForm } from '../NewsManagement/ContentBlockForm';
import { AddBlockPanel } from '../NewsManagement/AddBlockPanel';
import { ContentPreview } from '../../previews/ContentPreview/ContentPreview';

import '../../../styles/admin/ui/Form.css';
import '../../../styles/admin/ui/Layouts.css';
import '../NewsManagement/NewsForm.css';
import './PointForm.css';

export const PointForm: React.FC<PointFormProps> = ({
  pointToEdit,
  onSuccess,
  onCancel,
  isFetchingContent,
}) => {
  const {
    formData, applyFromJson, isSubmitting, formError, handleChange, handleFileChange, handleRemoveImage,
    addBlock, removeBlock, updateBlock, moveBlock, handleSubmit,
    previewData,
  } = usePointForm({ pointToEdit, onSuccess });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    moveBlock(result.source.index, result.destination.index);
  };

  const isLoading = isSubmitting || isFetchingContent;

  if (isFetchingContent) {
    return <div className="form-loading-message">Загрузка контента точки...</div>;
  }

  return (
    <div className="form-with-preview-layout">
      <div className="form-with-preview-main">
        <form onSubmit={handleSubmit} noValidate className="point-form-container">
          <JsonImportControl kind="points" onApply={applyFromJson} disabled={isSubmitting}/>
          <div className="point-form-grid">
            <div className="point-form-column-meta">
              <h4>Основные настройки</h4>
              <div className="form-group">
                <label htmlFor="name">Название точки*</label>
                <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required disabled={isLoading} />
              </div>
              <div className="form-group">
                <label htmlFor="description">Описание*</label>
                <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} required disabled={isLoading} rows={4}/>
              </div>
              <div className="form-grid two-columns">
                <div className="form-group">
                  <label htmlFor="latitude">Широта (Latitude)*</label>
                  <Input id="latitude" name="latitude" type="number" value={formData.latitude || ''} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div className="form-group">
                  <label htmlFor="longitude">Долгота (Longitude)*</label>
                  <Input id="longitude" name="longitude" type="number" value={formData.longitude || ''} onChange={handleChange} required disabled={isLoading} />
                </div>
              </div>
              <div className="form-grid two-columns">
                <div className="form-group">
                    <label htmlFor="budget">Бюджет*</label>
                    <Input id="budget" name="budget" type="number" value={formData.budget || '0'} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div className="form-group" style={{justifyContent: 'center'}}>
                    <Checkbox
                      id="is_partner" name="is_partner" label="Партнерская точка" checked={formData.is_partner || false}
                      onChange={(checked: boolean) => handleChange({ target: { name: 'is_partner', value: checked, type: 'checkbox' } })}
                      disabled={isLoading} />
                </div>
              </div>
              <div className="form-group">
                <ImageUpload
                  id="point_image" name="image_file" label="Основное изображение"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  previewUrl={previewData.mainImage}
                  disabled={isLoading || formData.remove_image}
                  buttonPosition="right" />
                {pointToEdit?.image && (
                  <Checkbox id="remove_image" label="Удалить изображение" checked={formData.remove_image} onChange={handleRemoveImage} disabled={isLoading}/>
                )}
              </div>
            </div>

            <div className="point-form-column-content">
              <h4>Конструктор контента</h4>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="point-content-blocks">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="content-blocks-list">
                      {(formData.content || []).map((block, index) => (
                        <Draggable key={block.id} draggableId={block.id} index={index}>
                          {(p) => (<div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}><ContentBlockForm block={block} index={index} isSubmitting={isLoading} onRemoveBlock={removeBlock} onUpdateBlock={updateBlock} onMoveBlockUp={()=>moveBlock(index, index-1)} onMoveBlockDown={()=>moveBlock(index, index+1)} onAddBlock={(type)=>addBlock(type)} /></div>)}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <AddBlockPanel onAddBlock={(type) => addBlock(type)} />
            </div>
          </div>
          {formError && <div role="alert" className="form-error">{formError}</div>}
          <div className="form-actions">
            <Button type="submit" disabled={isLoading} variant="success">{isLoading ? 'Сохранение...' : 'Сохранить точку'}</Button>
            <Button type="button" onClick={onCancel} disabled={isLoading} variant="outline">Отмена</Button>
          </div>
        </form>
      </div>
      <aside className="form-with-preview-aside">
        <div className="preview-sticky-container">
          <ContentPreview data={previewData} />
        </div>
      </aside>
    </div>
  );
};