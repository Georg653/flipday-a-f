// src/components/admin/AchievementsManagement/AchievementsTable.tsx
import React from 'react';
import type { Achievement } from '../../../types/admin/Achievements/achievement.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import { createImageUrl } from '../../../utils/media'; // Важнейший импорт!
import '../../../styles/admin/ui/Table.css';

interface AchievementsTableProps {
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const AchievementsTable: React.FC<AchievementsTableProps> = ({
  achievements,
  isLoading,
  error,
  onEdit,
  onDelete,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  canGoNext,
  canGoPrevious
}) => {
  
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (isLoading) {
    return <div className="table-status-message">Загрузка...{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
  }

  if (error && !achievements.length) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }

  if (!achievements.length) {
    return <div className="table-status-message">Достижения не найдены. Создайте первое.{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
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
              <th className="table-header-cell">Тип</th>
              <th className="table-header-cell">Критерий</th>
              <th className="table-header-cell table-cell-description">Описание</th>
              <th className="table-header-cell">Обновлено</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((ach) => {
              // Вот здесь мы собираем правильную ссылку для КАЖДОЙ картинки
              const imageUrl = createImageUrl(ach.image);

              return (
                <tr key={ach.id} className="table-body-row">
                  <td className="table-body-cell">{ach.id}</td>
                  <td className="table-body-cell">
                    {imageUrl ? (
                      <img src={imageUrl} alt={ach.name} className="table-image-thumbnail" />
                    ) : (
                      <span className="table-no-image">Нет</span>
                    )}
                  </td>
                  <td className="table-body-cell">{ach.name}</td>
                  <td className="table-body-cell">{ach.achievement_type}</td>
                  <td className="table-body-cell">{`${ach.criteria_value} ${ach.criteria_unit}`}</td>
                  <td className="table-body-cell table-cell-description">{ach.description}</td>
                  <td className="table-body-cell">{formatDate(ach.updated_at)}</td>
                  <td className="table-body-cell">
                    <div className="table-actions-container">
                      <Button variant="link" size="sm" onClick={() => onEdit(ach)}>Ред.</Button>
                      <Button variant="link" size="sm" className="table-action-button-delete" onClick={() => onDelete(ach.id)}>Удал.</Button>
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
            currentPage={currentPage} totalItems={-1} itemsPerPage={0}
            handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage}
            canGoNext={canGoNext} canGoPrevious={canGoPrevious} isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};