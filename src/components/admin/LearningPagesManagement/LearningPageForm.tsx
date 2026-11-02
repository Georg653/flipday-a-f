import { JsonImportControl } from '../../../features/JsonImport/JsonImportControl';
// --- Путь: src/components/admin/LearningPagesManagement/LearningPageForm.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

import { useLearningPageForm } from '../../../hooks/admin/LearningPagesManagement/useLearningPageForm';
import type { LearningPageFormProps } from '../../../types/admin/LearningPages/learningPage_props.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Select } from '../../ui/Select/Select';

import { ContentBlockForm } from '../NewsManagement/ContentBlockForm';
import { AddBlockPanel } from '../NewsManagement/AddBlockPanel';
import { ContentPreview } from '../../previews/ContentPreview/ContentPreview';

import '../../../styles/admin/ui/Form.css';
import '../../../styles/admin/ui/Layouts.css';
import '../../../styles/admin/ui/ContentFormLayout.css'; // Используем ОБЩИЙ layout

export const LearningPageForm: React.FC<LearningPageFormProps> = ({
  pageToEdit,
  onSuccess,
  onCancel,
  parentSubtopicId,
}) => {
  const {
    formData, applyFromJson, isSubmitting, formError, handleSubmit, handleChange,
    addBlock, removeBlock, updateBlock, moveBlock,
    topics, subtopics, selectedTopicInForm, isCascadeLoading,
    handleTopicInFormChange, handleSubtopicInFormChange,
    previewData,
  } = useLearningPageForm({ pageToEdit, onSuccess, parentSubtopicId });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    moveBlock(result.source.index, result.destination.index);
  };

  const isLoading = isSubmitting || isCascadeLoading;

  return (
    <div className="form-with-preview-layout">
      <div className="form-with-preview-main">
        <form onSubmit={handleSubmit} noValidate className="form-container">
          <JsonImportControl kind="pages" onApply={applyFromJson} disabled={isSubmitting}/>
          <div className="content-form-grid">
            <div className="form-column-meta">
              <h4>Основные настройки</h4>
              <div className="form-group-cascade">
                <div className="form-group">
                    <label htmlFor="topic-in-form">Тема*</label>
                    <Select
                        id="topic-in-form"
                        name="topic-in-form"
                        options={topics}
                        value={selectedTopicInForm || ''}
                        onChange={handleTopicInFormChange}
                        disabled={isLoading}
                        placeholder="Выберите тему..."
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="subtopic_id">Подтема*</label>
                    <Select
                        id="subtopic_id"
                        name="subtopic_id"
                        options={subtopics}
                        value={formData.subtopic_id}
                        onChange={handleSubtopicInFormChange}
                        disabled={isLoading || !selectedTopicInForm}
                        required
                        placeholder={!selectedTopicInForm ? "Сначала выберите тему" : "Выберите подтему..."}
                    />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="page_number">Номер страницы*</label>
                <Input id="page_number" name="page_number" type="number" value={formData.page_number} onChange={handleChange} required disabled={isLoading} />
              </div>
            </div>
            <div className="form-column-content">
              <h4>Конструктор контента</h4>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="learning-page-content-blocks">
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
              <AddBlockPanel onAddBlock={addBlock} />
            </div>
          </div>
          {formError && <div role="alert" className="form-error">{formError}</div>}
          <div className="form-actions">
            <Button type="submit" disabled={isLoading} variant="success">{isLoading ? 'Сохранение...' : 'Сохранить страницу'}</Button>
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