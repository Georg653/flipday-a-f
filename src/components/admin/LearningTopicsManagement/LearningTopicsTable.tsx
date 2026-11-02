// --- Путь: src/components/admin/LearningTopicsManagement/LearningTopicsTable.tsx ---

import React from 'react';
import type { LearningTopicsTableProps } from '../../../types/admin/LearningTopics/learningTopic_props.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import { createImageUrl } from '../../../utils/media';
import '../../../styles/admin/ui/Table.css';

export const LearningTopicsTable: React.FC<LearningTopicsTableProps> = ({
  topics,
  isLoading,
  error,
  onEdit,
  onDelete,
  currentPage,
  canGoNext,
  canGoPrevious,
  handleNextPage,
  handlePreviousPage,
}) => {
  if (isLoading) {
    return <div className="table-status-message">Загрузка тем...{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
  }

  if (error && !topics.length) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }

  if (!topics.length) {
    return <div className="table-status-message">Темы обучения не найдены. Создайте первую тему.{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
  }

  return (
    <div className="table-container">
      {error && <div role="alert" className="table-status-message table-status-error">{error}</div>}
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Изображение</th>
              <th className="table-header-cell">Название</th>
              <th className="table-header-cell">Описание</th>
              <th className="table-header-cell" style={{ textAlign: 'center' }}>Порядок</th>
              <th className="table-header-cell" style={{ textAlign: 'center' }}>Опыт</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => {
              const imageUrl = createImageUrl(topic.image);
              return (
                <tr key={topic.id} className="table-body-row">
                  <td className="table-body-cell">{topic.id}</td>
                  <td className="table-body-cell">
                    {imageUrl ? (
                      <img src={imageUrl} alt={topic.name} className="table-image-thumbnail" />
                    ) : (
                      <span className="table-no-image">Нет</span>
                    )}
                  </td>
                  <td className="table-body-cell">{topic.name}</td>
                  <td className="table-body-cell table-cell-description">
                    {topic.description ? `${topic.description.substring(0, 80)}...` : '—'}
                  </td>
                  <td className="table-body-cell" style={{ textAlign: 'center' }}>{topic.order}</td>
                  <td className="table-body-cell" style={{ textAlign: 'center' }}>{topic.experience_points}</td>
                  <td className="table-body-cell">
                    <div className="table-actions-container">
                      <Button variant="link" size="sm" onClick={() => onEdit(topic)}>Ред.</Button>
                      <Button variant="link" size="sm" className="table-action-button-delete" onClick={() => onDelete(topic.id)}>Удал.</Button>
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
            totalItems={-1} // -1 для "слепой" пагинации
            itemsPerPage={0} // не используется в "слепой" пагинации
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