// --- Путь: src/components/admin/StoriesManagement/StoriesManagement.tsx ---
// ПОЛНАЯ ПЕРЕПИСАННАЯ ВЕРСИЯ

import React, { useState, useEffect } from 'react';
import { useStoriesManagement } from '../../../hooks/admin/Stories/useStoriesManagement';
import { StoriesHeader } from './StoriesHeader';
import { StoriesTable } from './StoriesTable';
import { StoryForm } from './StoryForm';
import { Modal } from '../../ui/Modal/Modal';
import { StoryPreview } from '../../previews/StoryPreview/StoryPreview'; // Импорт превью для историй
import '../../../styles/admin/ui/PageLayout.css';
import '../../../styles/admin/ui/Layouts.css'; // <--- ПОДКЛЮЧАЕМ НАШИ ЛЕЙАУТЫ
import type { Story } from '../../../types/admin/Stories/story.types';

export const StoriesManagement: React.FC = () => {
  const {
    stories, updatingIds, loading, error, handleEdit, handleDelete, handleShowAddForm,
    handleFormSuccess, showForm, setShowForm, storyToEdit,
    currentPage, canGoNext, canGoPrevious, handleNextPage, handlePreviousPage,
    activeFilter, handleFilterChange, handleToggleStatus,
  } = useStoriesManagement();

  const [itemToPreview, setItemToPreview] = useState<Story | null>(null);

  useEffect(() => {
    if (!itemToPreview) return;
    const current = stories.find(item => item.id === itemToPreview.id);
    if (!current) setItemToPreview(null);
    else if (current !== itemToPreview) setItemToPreview(current);
  }, [stories, itemToPreview]);

  const handlePreview = (item: Story) => {
    setItemToPreview(prev => (prev?.id === item.id ? null : item));
  };

  const layoutClasses = `page-container ${itemToPreview ? "main-with-aside-layout" : ""}`;

  return (
    <div className={layoutClasses}>
      {/* 1. Левая колонка - основной контент */}
      <div className="main-content-column">
        <StoriesHeader
          isLoading={loading}
          onShowForm={handleShowAddForm}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
        <StoriesTable
          stories={stories}
          updatingIds={updatingIds}
          isLoading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onPreview={handlePreview} // <--- ПЕРЕДАЕМ ОБРАБОТЧИК
          activePreviewId={itemToPreview?.id} // <--- ПЕРЕДАЕМ ID ДЛЯ ПОДСВЕТКИ
          currentPage={currentPage}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
        />
      </div>

      {/* 2. Правая колонка - предпросмотр */}
      {itemToPreview && (
        <aside className="aside-content-column">
          <div className="preview-sticky-container"><div className="preview-panel-heading"><div>Предпросмотр<span>Тема приложения</span></div><button type="button" onClick={() => setItemToPreview(null)}>Закрыть</button></div>
            <StoryPreview slides={itemToPreview.content_items} />
          </div>
        </aside>
      )}

      {/* Модалка для формы */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={storyToEdit ? 'Редактировать историю' : 'Создать новую историю'}
        size="fullscreen" // Используем большой размер
      >
        <StoryForm
          storyToEdit={storyToEdit}
          onSuccess={(story) => {
            handleFormSuccess(story); 
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
};