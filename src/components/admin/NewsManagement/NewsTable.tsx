// --- Путь: src/components/admin/NewsManagement/NewsTable.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React from 'react';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import { createImageUrl } from '../../../utils/media';
import type { News } from '../../../types/admin/News/news.types';
import '../../../styles/admin/ui/Table.css';

// Изменяем пропсы, чтобы включить onPreview и activePreviewId
export interface NewsTableProps {
  newsItems: News[];
  isLoading: boolean;
  error: string | null;
  onEdit: (newsItem: News) => void;
  onDelete: (id: number) => void;
  onPreview: (newsItem: News) => void;
  activePreviewId?: number | null;
  currentPage: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
}

export const NewsTable: React.FC<NewsTableProps> = ({
  newsItems,
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
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return <div className="table-status-message">Загрузка новостей...{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
  }
  if (error && !newsItems.length) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }
  if (!newsItems.length) {
    return <div className="table-status-message">Новости не найдены.{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
  }

  return (
    <div className="table-container">
      {error && <div role="alert" className="table-status-message table-status-error">{error}</div>}
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Превью</th>
              <th className="table-header-cell">Заголовок</th>
              <th className="table-header-cell table-cell-description">Описание</th>
              <th className="table-header-cell">Дата создания</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {newsItems.map((news) => {
              const imageUrl = createImageUrl(news.preview);
              const isActive = activePreviewId === news.id;
              return (
                <tr
                  key={news.id}
                  className={`table-body-row ${isActive ? 'is-active-for-preview' : ''}`}
                  onClick={() => onPreview(news)}
                  data-has-preview="true"
                >
                  <td className="table-body-cell">{news.id}</td>
                  <td className="table-body-cell">
                    {imageUrl ? (
                      <img src={imageUrl} alt={news.title} className="table-image-thumbnail" />
                    ) : (
                      <span className="table-no-image">Нет</span>
                    )}
                  </td>
                  <td className="table-body-cell">{truncateText(news.title, 50)}</td>
                  <td className="table-body-cell table-cell-description">{truncateText(news.description, 100)}</td>
                  <td className="table-body-cell">{formatDate(news.created_at)}</td>
                  <td className="table-body-cell">
                    <div className="table-actions-container">
                      <Button variant="link" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(news); }}>Ред.</Button>
                      <Button variant="link" size="sm" className="table-action-button-delete" onClick={(e) => { e.stopPropagation(); onDelete(news.id); }}>Удал.</Button>
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
            totalItems={-1}
            itemsPerPage={0}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};