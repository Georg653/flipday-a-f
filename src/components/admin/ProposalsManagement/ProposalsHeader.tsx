// --- Путь: src/components/admin/ProposalsManagement/ProposalsHeader.tsx ---

import React from 'react';
import { Select } from '../../ui/Select/Select';
import type { ProposalsHeaderProps } from '../../../types/admin/Proposals/proposal_props.types';
import '../../../styles/admin/ui/Header.css';

const statusOptions = [
  { value: 'all', label: 'Все статусы' },
  { value: 'pending', label: 'В ожидании' },
  { value: 'approved', label: 'Одобрено' },
  { value: 'needed_feedback', label: 'Нужна доработка' },
  { value: 'finished', label: 'Реализовано' },
  { value: 'canceled', label: 'Отменено' },
];

export const ProposalsHeader: React.FC<ProposalsHeaderProps> = ({
  isLoading,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Управление Предложениями</h2>
      </div>
      <div className="page-header-filters">
        <Select
          id="status-filter"
          label="Фильтр по статусу"
          options={statusOptions}
          value={activeFilter}
          onChange={onFilterChange}
          disabled={isLoading}
          className="filter-item"
        />
      </div>
    </div>
  );
};