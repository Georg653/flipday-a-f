// --- Путь: src/components/admin/RouteCategoriesManagement/RouteCategoriesTable.tsx ---

import React from 'react';
import type { RouteCategoriesTableProps } from '../../../types/admin/RouteCategories/routeCategory_props.types';
import { Button } from '../../ui/Button/Button';
import { createImageUrl } from '../../../utils/media';
import '../../../styles/admin/ui/Table.css';

export const RouteCategoriesTable: React.FC<RouteCategoriesTableProps> = ({
  categories,
  isLoading,
  error,
  onEdit,
  onDelete,
}) => {
  
  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return '—';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return <div className="table-status-message">Загрузка категорий...</div>;
  }

  if (error && !categories.length) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }

  if (!categories.length) {
    return <div className="table-status-message">Категории не найдены. Создайте первую.</div>;
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
              <th className="table-header-cell table-cell-description">Описание</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const imageUrl = createImageUrl(category.image);
              return (
                <tr key={category.id} className="table-body-row">
                  <td className="table-body-cell">{category.id}</td>
                  <td className="table-body-cell">
                    {imageUrl ? (
                      <img src={imageUrl} alt={category.name} className="table-image-thumbnail" />
                    ) : (
                      <span className="table-no-image">Нет</span>
                    )}
                  </td>
                  <td className="table-body-cell">{category.name}</td>
                  <td className="table-body-cell table-cell-description">{truncateText(category.description, 150)}</td>
                  <td className="table-body-cell">
                    <div className="table-actions-container">
                      <Button variant="link" size="sm" onClick={() => onEdit(category)}>Ред.</Button>
                      <Button variant="link" size="sm" className="table-action-button-delete" onClick={() => onDelete(category.id)}>Удал.</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};