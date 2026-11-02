// --- Путь: src/components/admin/LearningPagesManagement/LearningPagesTable.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React from 'react';
import type { LearningPage } from '../../../types/admin/LearningPages/learningPage.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import '../../../styles/admin/ui/Table.css';

export interface LearningPagesTableProps {
  pages: LearningPage[];
  isLoading: boolean;
  error: string | null;
  onEdit: (page: LearningPage) => void;
  onDelete: (id: number) => void;
  onPreview: (page: LearningPage) => void;
  activePreviewId?: number | null;
  currentPage: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
}

export const LearningPagesTable: React.FC<LearningPagesTableProps> = ({
  pages,
  isLoading,
  error,
  onEdit,
  onDelete,
  onPreview,
  activePreviewId,
  currentPage,
  canGoNext,
  canGoPrevious,
  handleNextPage,
  handlePreviousPage,
}) => {
  if (isLoading) {
    return <div className="table-status-message">Загрузка страниц...{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
  }
  if (error && !pages.length) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }
  if (!pages.length) {
    return <div className="table-status-message">Страницы не найдены.{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
  }

  return (
    <div className="table-container">
      {error && <div role="alert" className="table-status-message table-status-error">{error}</div>}
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Номер страницы</th>
              <th className="table-header-cell">Род. подтема (ID)</th>
              <th className="table-header-cell">Кол-во блоков</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => {
              const isActive = activePreviewId === page.id;
              return (
                <tr
                  key={page.id}
                  className={`table-body-row ${isActive ? 'is-active-for-preview' : ''}`}
                  onClick={() => onPreview(page)}
                  data-has-preview="true"
                >
                  <td className="table-body-cell">{page.id}</td>
                  <td className="table-body-cell" style={{ textAlign: 'center' }}>{page.page_number}</td>
                  <td className="table-body-cell" style={{ textAlign: 'center' }}>{page.subtopic_id}</td>
                  <td className="table-body-cell" style={{ textAlign: 'center' }}>{page.content?.length ?? 0}</td>
                  <td className="table-body-cell">
                    <div className="table-actions-container">
                      <Button variant="link" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(page); }}>Ред.</Button>
                      <Button variant="link" size="sm" className="table-action-button-delete" onClick={(e) => { e.stopPropagation(); onDelete(page.id); }}>Удал.</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {(canGoPrevious || canGoNext) && (
        <div className="table-pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            isLoading={isLoading}
            totalItems={-1}
            itemsPerPage={0}
          />
        </div>
      )}
    </div>
  );
};