// src/components/admin/AchievementsManagement/AchievementsHeader.tsx
import React from 'react';
import { Button } from '../../ui/Button/Button';
import '../../../styles/admin/ui/Header.css'; // Общие стили для заголовков страниц, создай если нет

interface AchievementsHeaderProps {
  isLoading: boolean; // Может понадобиться для блокировки кнопки "Добавить" во время загрузки
  onShowForm: () => void;
  // filterNameInput?: string; // Для примера, если будет фильтр по имени
  // onNameFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AchievementsHeader: React.FC<AchievementsHeaderProps> = ({
  isLoading,
  onShowForm,
  // filterNameInput,
  // onNameFilterChange,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Достижения</h2>
        <Button onClick={onShowForm} disabled={isLoading} customVariant="save">
         Добавить достижение
        </Button>
      </div>

      {/* Место для фильтров, если они понадобятся */}
      {/* <div className="page-header-filters grid-filters">
        <Input
          type="text"
          name="name_filter_achievement"
          placeholder="Filter by Name"
          value={filterNameInput}
          onChange={onNameFilterChange}
          disabled={isLoading}
          className="filter-item"
        />
        // Другие фильтры здесь
      </div> */}
    </div>
  );
};