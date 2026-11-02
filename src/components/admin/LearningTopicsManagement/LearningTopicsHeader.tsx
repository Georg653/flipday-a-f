// --- Путь: src/components/admin/LearningTopicsManagement/LearningTopicsHeader.tsx ---

import React from 'react';
import { Button } from '../../ui/Button/Button';
import type { LearningTopicsHeaderProps } from '../../../types/admin/LearningTopics/learningTopic_props.types';
import '../../../styles/admin/ui/Header.css';

export const LearningTopicsHeader: React.FC<LearningTopicsHeaderProps> = ({
  isLoading,
  onShowForm,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <h2 className="page-header-title">Управление Темами Обучения</h2>
        <Button onClick={onShowForm} disabled={isLoading} variant="success">
          Добавить тему
        </Button>
      </div>
      
      {/* Место для будущих фильтров, если понадобятся */}
      {/* <div className="page-header-filters">
        <Input placeholder="Фильтр по названию..." />
      </div> */}
    </div>
  );
};