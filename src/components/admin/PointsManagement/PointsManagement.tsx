import { toRequestError } from '../../../utils/errors';
// --- Путь: src/components/admin/PointsManagement/PointsManagement.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React, { useState } from 'react';
import { usePointsManagement } from '../../../hooks/admin/Points/usePointsManagement';
import { PointsHeader } from './PointsHeader';
import { PointsTable } from './PointsTable';
import { PointForm } from './PointForm';
import { Modal } from '../../ui/Modal/Modal';
import { ContentPreview } from '../../previews/ContentPreview/ContentPreview';
import { PointsApi } from '../../../services/admin/Points/pointsApi';
import type { Point, PointBase } from '../../../types/admin/Points/point.types';

import '../../../styles/admin/ui/PageLayout.css';
import '../../../styles/admin/ui/Layouts.css';

export const PointsManagement: React.FC = () => {
  const {
    points, loading, error, handleEdit, handleDelete, handleShowAddForm, handleFormSuccess,
    showForm, setShowForm, pointToEdit, isFetchingContent,
    currentPage, canGoNext, canGoPrevious, handleNextPage, handlePreviousPage,
    searchFilter, handleSearchChange,
  } = usePointsManagement();

  const [itemToPreview, setItemToPreview] = useState<Point | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const handlePreview = async (point: PointBase) => {
    if (itemToPreview?.id === point.id) {
      setItemToPreview(null);
      return;
    }
    setIsPreviewLoading(true);
    setItemToPreview({ ...point, content: [] }); 
    
    try {
      const contentData = await PointsApi.getPointContent(point.id);
      setItemToPreview({ ...point, ...contentData });
    } catch (cause: unknown) {
      const error = toRequestError(cause);
      if (error.response && error.response.status === 404) {
        setItemToPreview({ ...point, content: [] });
      } else {
        console.error("Ошибка загрузки контента для превью:", error);
        setItemToPreview(null);
      }
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const layoutClasses = `page-container ${itemToPreview || isPreviewLoading ? "main-with-aside-layout" : ""}`;

  return (
    <div className={layoutClasses}>
      <div className="main-content-column">
        <PointsHeader
          isLoading={loading}
          onShowForm={handleShowAddForm}
          searchFilter={searchFilter}
          onSearchChange={handleSearchChange}
        />
        <PointsTable
          points={points}
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

      {(itemToPreview || isPreviewLoading) && (
        <aside className="aside-content-column">
          <div className="preview-sticky-container">
            {isPreviewLoading ? (
              <div className="form-loading-message">Загрузка предпросмотра...</div>
            ) : itemToPreview && (
              <>
                <div className="aside-preview-header">
                  <h4 className="preview-title">Предпросмотр</h4>
                  <button onClick={() => setItemToPreview(null)} className="aside-close-btn" title="Закрыть">×</button>
                </div>
                <ContentPreview 
                  data={{
                      title: itemToPreview.name,
                      description: itemToPreview.description,
                      mainImage: itemToPreview.image,
                      content: itemToPreview.content,
                  }} 
                />
              </>
            )}
          </div>
        </aside>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={pointToEdit ? 'Редактировать точку' : 'Создать новую точку'}
        size="fullscreen"
      >
        <PointForm
          pointToEdit={pointToEdit}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
          isFetchingContent={isFetchingContent}
        />
      </Modal>
    </div>
  );
};