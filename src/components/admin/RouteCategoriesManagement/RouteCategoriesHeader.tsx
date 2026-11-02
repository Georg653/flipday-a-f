// --- Путь: src/components/admin/RouteCategoriesManagement/RouteCategoriesHeader.tsx ---

import React from 'react';
import { Button } from '../../ui/Button/Button';
import type { RouteCategoriesHeaderProps } from '../../../types/admin/RouteCategories/routeCategory_props.types';
import '../../../styles/admin/ui/Header.css';

export const RouteCategoriesHeader: React.FC<RouteCategoriesHeaderProps> = ({
  isLoading,
  onShowForm,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Категории маршрутов</h2>
        <Button onClick={onShowForm} disabled={isLoading} variant="success">
          Добавить категорию
        </Button>
      </div>
    </div>
  );
};