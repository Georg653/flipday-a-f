// --- Путь: src/components/admin/LearningPagesManagement/LearningPagesHeader.tsx ---

import React from 'react';
import { Button } from '../../ui/Button/Button';
import { Select } from '../../ui/Select/Select';
import type { LearningPagesHeaderProps } from '../../../types/admin/LearningPages/learningPage_props.types';
import '../../../styles/admin/ui/Header.css';

export const LearningPagesHeader: React.FC<LearningPagesHeaderProps> = ({
  isLoading,
  onShowForm,
  topics,
  subtopics,
  selectedTopicId,
  selectedSubtopicId,
  onTopicChange,
  onSubtopicChange,
  isAddButtonDisabled,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Управление Страницами Обучения</h2>
        <Button 
          onClick={onShowForm} 
          disabled={isLoading || isAddButtonDisabled} 
          variant="success"
          title={isAddButtonDisabled ? "Сначала выберите подтему" : "Добавить новую страницу"}
        >
          Добавить страницу
        </Button>
      </div>
      
      <div className="page-header-filters">
        <Select
          id="topic-selector"
          label="Выберите Тему"
          options={topics}
          value={selectedTopicId || ''}
          onChange={onTopicChange}
          disabled={isLoading}
          className="filter-item"
          placeholder={isLoading ? "Загрузка тем..." : "Все темы"}
        />
        <Select
          id="subtopic-selector"
          label="Выберите Подтему"
          options={subtopics}
          value={selectedSubtopicId || ''}
          onChange={onSubtopicChange}
          disabled={isLoading || !selectedTopicId || subtopics.length === 0}
          className="filter-item"
          placeholder={isLoading ? "Загрузка подтем..." : "Все подтемы"}
        />
      </div>
    </div>
  );
};