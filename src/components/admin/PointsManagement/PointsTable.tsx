// --- Путь: src/components/admin/PointsManagement/PointsTable.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React from 'react';
import type { PointsTableProps } from '../../../types/admin/Points/point_props.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import { createImageUrl } from '../../../utils/media';
import '../../../styles/admin/ui/Table.css';

export const PointsTable: React.FC<PointsTableProps> = ({
  points,
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
    return <div className="table-status-message">Загрузка точек...{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
  }
  if (error && !points.length) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }
  if (!points.length) {
    return <div className="table-status-message">Точки не найдены. Создайте первую.{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
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
              <th className="table-header-cell">Координаты</th>
              <th className="table-header-cell">Партнерская</th>
              <th className="table-header-cell">Бюджет</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => {
              const imageUrl = createImageUrl(point.image);
              const isActive = activePreviewId === point.id;
              return (
                <tr
                  key={point.id}
                  className={`table-body-row ${isActive ? 'is-active-for-preview' : ''}`}
                  onClick={() => onPreview(point)}
                  data-has-preview="true"
                >
                  <td className="table-body-cell">{point.id}</td>
                  <td className="table-body-cell">
                    {imageUrl ? (
                      <img src={imageUrl} alt={point.name} className="table-image-thumbnail" />
                    ) : (
                      <span className="table-no-image">Нет</span>
                    )}
                  </td>
                  <td className="table-body-cell">{point.name}</td>
                  <td className="table-body-cell table-description">
                    {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                  </td>
                  <td className="table-body-cell" style={{ textAlign: 'center' }}>
                    {point.is_partner ? 'Да' : 'Нет'}
                  </td>
                  <td className="table-body-cell" style={{ textAlign: 'center' }}>
                    {point.budget}
                  </td>
                  <td className="table-body-cell">
                    <div className="table-actions-container">
                      <Button variant="link" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(point); }}>Ред.</Button>
                      <Button variant="link" size="sm" className="table-action-button-delete" onClick={(e) => { e.stopPropagation(); onDelete(point.id); }}>Удал.</Button>
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