// --- Путь: src/components/admin/StoriesManagement/StoriesHeader.tsx ---

import React from 'react';
import { Button } from '../../ui/Button/Button';
import { Select } from '../../ui/Select/Select';
// ИСПРАВЛЕН ИМПОРТ: добавлено ключевое слово 'type'
import type { SelectOption } from '../../ui/Select/Select';
import '../../../styles/admin/ui/Header.css';
import type { StoriesHeaderProps } from '../../../types/admin/Stories/story_props.types';


const filterOptions: SelectOption[] = [
  { value: 'all', label: 'Все статусы' },
  { value: 'true', label: 'Только активные' },
  { value: 'false', label: 'Только неактивные' },
];

export const StoriesHeader: React.FC<StoriesHeaderProps> = ({
  isLoading,
  onShowForm,
  activeFilter,
  onFilterChange,
}) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      onFilterChange(undefined);
    } else {
      onFilterChange(value === 'true');
    }
  };

  const getFilterValue = () => {
    if (activeFilter === true) return 'true';
    if (activeFilter === false) return 'false';
    return 'all';
  }

  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Истории</h2>
        <Button onClick={onShowForm} disabled={isLoading} variant="success">
          Добавить историю
        </Button>
      </div>

      <div className="page-header-filters">
        <Select
          id="story-status-filter"
          label="Фильтр по статусу"
          options={filterOptions}
          value={getFilterValue()}
          onChange={handleSelectChange}
          disabled={isLoading}
          className="filter-item"
        />
      </div>
    </div>
  );
};