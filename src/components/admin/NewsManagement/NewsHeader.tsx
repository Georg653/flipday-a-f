// --- Путь: src/components/admin/NewsManagement/NewsHeader.tsx ---

import React from 'react';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import type { NewsHeaderProps } from '../../../types/admin/News/news_props.types';
import '../../../styles/admin/ui/Header.css';

export const NewsHeader: React.FC<NewsHeaderProps> = ({
  isLoading,
  onShowForm,
  filterValue,
  onFilterChange,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Новости</h2>
        <Button onClick={onShowForm} disabled={isLoading} variant="success">
          Добавить новость
        </Button>
      </div>
      
      <div className="page-header-filters">
        <Input
          type="text"
          name="title_filter"
          placeholder="Фильтр по названию..."
          value={filterValue}
          onChange={onFilterChange}
          disabled={isLoading}
          className="filter-item"
        />
      </div>
    </div>
  );
};