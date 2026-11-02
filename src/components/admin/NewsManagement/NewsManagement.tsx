// --- Путь: src/components/admin/NewsManagement/NewsManagement.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React, { useState, useEffect } from 'react';
import { useNewsManagement } from '../../../hooks/admin/News/useNewsManagement';
import { NewsHeader } from './NewsHeader';
import { NewsTable } from './NewsTable';
import { NewsForm } from './NewsForm';
import { Modal } from '../../ui/Modal/Modal';
import { ContentPreview } from '../../previews/ContentPreview/ContentPreview';
import '../../../styles/admin/ui/Layouts.css';
import '../../../styles/admin/ui/PageLayout.css';
import type { News } from '../../../types/admin/News/news.types';

export const NewsManagement: React.FC = () => {
  const {
    newsItems, loading, error, handleEdit, handleDelete, handleShowAddForm,
    handleFormSuccess, showForm, setShowForm, newsToEdit,
    currentPage, canGoNext, canGoPrevious, handleNextPage, handlePreviousPage,
    titleFilter, handleFilterChange,
  } = useNewsManagement();

  const [itemToPreview, setItemToPreview] = useState<News | null>(null);

  useEffect(() => {
    if (!itemToPreview) return;
    const current = newsItems.find(item => item.id === itemToPreview.id);
    if (!current) setItemToPreview(null);
    else if (current !== itemToPreview) setItemToPreview(current);
  }, [newsItems, itemToPreview]);

  const handlePreview = (item: News) => {
    setItemToPreview(prev => (prev?.id === item.id ? null : item));
  };
  
  const layoutClasses = `page-container ${itemToPreview ? "main-with-aside-layout" : ""}`;

  return (
    <div className={layoutClasses}>
      {/* Левая колонка - основной контент */}
      <div className="main-content-column">
        <NewsHeader
          isLoading={loading}
          onShowForm={handleShowAddForm}
          filterValue={titleFilter}
          onFilterChange={handleFilterChange}
        />
        <NewsTable
          newsItems={newsItems}
          isLoading={loading}
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

      {/* Правая колонка - предпросмотр */}
      {itemToPreview && (
        <aside className="aside-content-column">
          <div className="preview-sticky-container"><div className="preview-panel-heading"><div>Предпросмотр<span>Тема приложения</span></div><button type="button" onClick={() => setItemToPreview(null)}>Закрыть</button></div>
            <ContentPreview 
              data={{
                  title: itemToPreview.title,
                  description: itemToPreview.description,
                  mainImage: itemToPreview.preview,
                  backgroundImage: itemToPreview.background,
                  content: itemToPreview.content,
              }} 
            />
          </div>
        </aside>
      )}

      {/* Модалка для формы */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={newsToEdit ? 'Редактировать новость' : 'Создать новую новость'}
        size="fullscreen"
      >
        <NewsForm
          newsToEdit={newsToEdit}
          onSuccess={(newsItem) => {
            handleFormSuccess(newsItem);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
};