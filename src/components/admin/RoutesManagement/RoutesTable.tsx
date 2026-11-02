// --- Путь: src/components/admin/RoutesManagement/RoutesTable.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React from 'react';
import type { RoutesTableProps } from '../../../types/admin/Routes/route_props.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import { createImageUrl } from '../../../utils/media';
import '../../../styles/admin/ui/Table.css';

export const RoutesTable: React.FC<RoutesTableProps> = ({
  routes,
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
    return <div className="table-status-message">Загрузка маршрутов...{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
  }
  if (error && !routes.length) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }
  if (!routes.length) {
    return <div className="table-status-message">Маршруты не найдены. Попробуйте изменить фильтры или создайте новый.{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
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
              <th className="table-header-cell">Категория ID</th>
              <th className="table-header-cell" style={{textAlign: 'center'}}>Точек</th>
              <th className="table-header-cell">Дистанция (м)</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => {
              const imageUrl = createImageUrl(route.image);
              return (
                <tr key={route.id} className="table-body-row">
                  <td className="table-body-cell">{route.id}</td>
                  <td className="table-body-cell">
                    {imageUrl ? (
                      <img src={imageUrl} alt={route.name} className="table-image-thumbnail" />
                    ) : (
                      <span className="table-no-image">Нет</span>
                    )}
                  </td>
                  <td className="table-body-cell">{route.name}</td>
                  <td className="table-body-cell" style={{textAlign: 'center'}}>{route.route_category_id}</td>
                  <td className="table-body-cell" style={{textAlign: 'center'}}>{route.points.length}</td>
                  <td className="table-body-cell">{route.distance}</td>
                  <td className="table-body-cell">
                    <div className="table-actions-container">
                      <Button variant="link" size="sm" onClick={() => onEdit(route)}>Ред.</Button>
                      <Button variant="link" size="sm" className="table-action-button-delete" onClick={() => onDelete(route.id)}>Удал.</Button>
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