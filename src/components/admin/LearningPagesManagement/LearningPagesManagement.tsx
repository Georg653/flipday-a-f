// --- Путь: src/components/admin/LearningPagesManagement/LearningPagesManagement.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React, { useState, useEffect } from 'react';
import { useLearningPagesManagement } from '../../../hooks/admin/LearningPagesManagement/useLearningPagesManagement';
import { LearningPagesHeader } from './LearningPagesHeader';
import { LearningPagesTable } from './LearningPagesTable';
import { LearningPageForm } from './LearningPageForm';
import { Modal } from '../../ui/Modal/Modal';
import { ContentPreview } from '../../previews/ContentPreview/ContentPreview';
import type { LearningPage } from '../../../types/admin/LearningPages/learningPage.types';

import '../../../styles/admin/ui/PageLayout.css';
import '../../../styles/admin/ui/Layouts.css';

export const LearningPagesManagement: React.FC = () => {
  const {
    topics, selectedTopicId, handleTopicChange,
    subtopics, selectedSubtopicId, handleSubtopicChange,
    pages, error, isLoading,
    handleEdit, handleDelete, handleShowAddForm, handleFormSuccess,
    showForm, setShowForm, pageToEdit,
    currentPage, canGoNext, canGoPrevious, handleNextPage, handlePreviousPage,
    parentSubtopicId,
  } = useLearningPagesManagement();

  const [itemToPreview, setItemToPreview] = useState<LearningPage | null>(null);

  useEffect(() => {
    if (!itemToPreview) return;
    const current = pages.find(item => item.id === itemToPreview.id);
    if (!current) setItemToPreview(null);
    else if (current !== itemToPreview) setItemToPreview(current);
  }, [pages, itemToPreview]);

  const handlePreview = (item: LearningPage) => {
    setItemToPreview(prev => (prev?.id === item.id ? null : item));
  };

  const layoutClasses = `page-container ${itemToPreview ? "main-with-aside-layout" : ""}`;

  return (
    <div className={layoutClasses}>
      <div className="main-content-column">
        <LearningPagesHeader
          isLoading={isLoading}
          onShowForm={handleShowAddForm}
          topics={topics}
          subtopics={subtopics}
          selectedTopicId={selectedTopicId}
          selectedSubtopicId={selectedSubtopicId}
          onTopicChange={handleTopicChange}
          onSubtopicChange={handleSubtopicChange}
          isAddButtonDisabled={!selectedSubtopicId}
        />
        <LearningPagesTable
          pages={pages}
          isLoading={isLoading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          activePreviewId={itemToPreview?.id}
          currentPage={currentPage}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
        />
      </div>

      {itemToPreview && (
        <aside className="aside-content-column">
          <div className="preview-sticky-container">
            <div className="aside-preview-header">
              <h4 className="preview-title">Предпросмотр</h4>
              <button onClick={() => setItemToPreview(null)} className="aside-close-btn" title="Закрыть">×</button>
            </div>
            <ContentPreview 
              data={{
                  title: `Страница №${itemToPreview.page_number}`,
                  content: itemToPreview.content,
              }} 
            />
          </div>
        </aside>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={pageToEdit ? 'Редактировать страницу' : 'Создать новую страницу'}
        size="fullscreen"
      >
        <LearningPageForm
          pageToEdit={pageToEdit}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
          parentSubtopicId={parentSubtopicId}
        />
      </Modal>
    </div>
  );
};