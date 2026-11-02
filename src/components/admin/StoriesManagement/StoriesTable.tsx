// --- Путь: src/components/admin/StoriesManagement/StoriesTable.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React from 'react';
import type { Story } from '../../../types/admin/Stories/story.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import { createImageUrl } from '../../../utils/media';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import '../../../styles/admin/ui/Table.css';

// Обновленный интерфейс пропсов
interface StoriesTableProps {
  stories: Story[];
  updatingIds?: number[];
  isLoading: boolean;
  error: string | null;
  onEdit: (story: Story) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (story: Story) => void;
  onPreview: (story: Story) => void;
  activePreviewId?: number | null;
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const StoriesTable: React.FC<StoriesTableProps> = ({
  stories,
  updatingIds = [],
  isLoading,
  error,
  onEdit,
  onDelete,
  onToggleStatus,
  onPreview,
  activePreviewId,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  canGoNext,
  canGoPrevious,
}) => {
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString.includes('Z') ? dateString : dateString + 'Z');
      if (isNaN(date.getTime())) {
        return 'Неверная дата';
      }
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return 'Ошибка даты';
    }
  };

  if (isLoading) {
    return <div className="table-status-message">Загрузка историй...{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
  }
  if (error && !stories.length) return <div role="alert" className="table-status-message table-status-error">{error}</div>;
  if (!stories.length && !isLoading) {
    return <div className="table-status-message">Истории не найдены. Попробуйте изменить фильтры или создайте новую.{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
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
              <th className="table-header-cell">Название</th>
              <th className="table-header-cell">Статус</th>
              <th className="table-header-cell" style={{textAlign: 'center'}}>Активна</th>
              <th className="table-header-cell">Слайдов</th>
              <th className="table-header-cell">Просмотров</th>
              <th className="table-header-cell">Истекает</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => {
              const imageUrl = createImageUrl(story.preview);
              const isActiveForPreview = activePreviewId === story.id;
              return (
                <tr
                  key={story.id}
                  className={`table-body-row ${isActiveForPreview ? 'is-active-for-preview' : ''}`}
                  onClick={() => onPreview(story)}
                  data-has-preview="true"
                >
                  <td className="table-body-cell">{story.id}</td>
                  <td className="table-body-cell">
                    {imageUrl ? (
                      <img src={imageUrl} alt={story.name || 'Превью'} className="table-image-thumbnail" />
                    ) : (
                      <span className="table-no-image">Нет</span>
                    )}
                  </td>
                  <td className="table-body-cell">{story.name || 'Без названия'}</td>
                  <td className="table-body-cell">
                    <span className={`status-badge ${story.is_active ? 'status-active' : 'status-inactive'}`}>
                      {story.is_active ? 'Активна' : 'Неактивна'}
                    </span>
                  </td>
                  <td className="table-body-cell story-toggle-cell" style={{textAlign: 'center'}} onClick={event => event.stopPropagation()}>
                    <Checkbox
                      id={`toggle-${story.id}`}
                      label={`Активность истории ${story.name || story.id}`}
                      checked={story.is_active}
                      disabled={updatingIds.includes(story.id)}
                      onChange={() => onToggleStatus(story)}
                    />
                  </td>
                  <td className="table-body-cell" style={{textAlign: 'center'}}>{story.content_items?.length ?? 0}</td>
                  <td className="table-body-cell" style={{textAlign: 'center'}}>{story.views ?? 0}</td>
                  <td className="table-body-cell">{formatDate(story.expires_at)}</td>
                  <td className="table-body-cell">
                    <div className="table-actions-container">
                      <Button variant="link" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(story); }}>Ред.</Button>
                      <Button variant="link" size="sm" className="table-action-button-delete" onClick={(e) => { e.stopPropagation(); onDelete(story.id); }}>Удал.</Button>
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