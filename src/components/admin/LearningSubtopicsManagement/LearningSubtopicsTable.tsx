// --- Путь: src/components/admin/LearningSubtopicsManagement/LearningSubtopicsTable.tsx ---

import React from 'react';
import type { LearningSubtopicsTableProps } from '../../../types/admin/LearningSubtopics/learningSubtopic_props.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import { createImageUrl } from '../../../utils/media';
import '../../../styles/admin/ui/Table.css';

export const LearningSubtopicsTable: React.FC<LearningSubtopicsTableProps> = ({
  subtopics,
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
    return <div className="table-status-message">Загрузка подтем...{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
  }

  if (error && !subtopics.length) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }
  
  // Сообщение зависит от того, выбрана ли тема (это неявно проверяется по isLoading)
  if (!subtopics.length) {
    return <div className="table-status-message">Подтемы не найдены. Выберите другую тему или создайте первую подтему для текущей.{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
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
              <th className="table-header-cell">Род. тема (ID)</th>
              <th className="table-header-cell" style={{ textAlign: 'center' }}>Порядок</th>
              <th className="table-header-cell" style={{ textAlign: 'center' }}>Опыт</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {subtopics.map((subtopic) => {
              const imageUrl = createImageUrl(subtopic.image);
              return (
                <tr key={subtopic.id} className="table-body-row">
                  <td className="table-body-cell">{subtopic.id}</td>
                  <td className="table-body-cell">
                    {imageUrl ? (
                      <img src={imageUrl} alt={subtopic.name} className="table-image-thumbnail" />
                    ) : (
                      <span className="table-no-image">Нет</span>
                    )}
                  </td>
                  <td className="table-body-cell">{subtopic.name}</td>
                  <td className="table-body-cell" style={{ textAlign: 'center' }}>{subtopic.topic_id}</td>
                  <td className="table-body-cell" style={{ textAlign: 'center' }}>{subtopic.order}</td>
                  <td className="table-body-cell" style={{ textAlign: 'center' }}>{subtopic.experience_points}</td>
                  <td className="table-body-cell">
                    <div className="table-actions-container">
                      <Button variant="link" size="sm" onClick={() => onEdit(subtopic)}>Ред.</Button>
                      <Button variant="link" size="sm" className="table-action-button-delete" onClick={() => onDelete(subtopic.id)}>Удал.</Button>
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