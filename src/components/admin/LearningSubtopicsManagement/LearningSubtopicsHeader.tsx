// --- Путь: src/components/admin/LearningSubtopicsManagement/LearningSubtopicsHeader.tsx ---

import React from 'react';
import { Button } from '../../ui/Button/Button';
import { Select } from '../../ui/Select/Select';
import type { LearningSubtopicsHeaderProps } from '../../../types/admin/LearningSubtopics/learningSubtopic_props.types';
import '../../../styles/admin/ui/Header.css';

export const LearningSubtopicsHeader: React.FC<LearningSubtopicsHeaderProps> = ({
  isLoading,
  onShowForm,
  topics,
  selectedTopicId,
  onTopicChange,
  isAddButtonDisabled,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Управление Подтемами</h2>
        <Button 
          onClick={onShowForm} 
          disabled={isLoading || isAddButtonDisabled} 
          variant="success"
          title={isAddButtonDisabled ? "Сначала выберите тему" : "Добавить новую подтему"}
        >
          Добавить подтему
        </Button>
      </div>
      
      <div className="page-header-filters">
        <Select
          id="topic-selector"
          label="Выберите тему для просмотра подтем"
          options={topics}
          value={selectedTopicId || ''}
          onChange={onTopicChange}
          disabled={isLoading}
          className="filter-item"
          placeholder="Загрузка тем..."
        />
      </div>
    </div>
  );
};