// src/components/admin/AchievementsManagement/AchievementsManagement.tsx
import React from 'react';
import { AchievementsHeader } from './AchievementsHeader';
import { AchievementsTable } from './AchievementsTable';
import { AchievementForm } from './AchievementForm';
import { useAchievementsManagement } from '../../../hooks/admin/AchievementsManagement/useAchievementsManagement';
import '../../../styles/admin/ui/PageLayout.css';

// КОММЕНТАРИЙ: Мы используем `export const` (именованный экспорт). 
// Это решает твою прошлую ошибку "does not provide an export named..."
export const AchievementsManagement: React.FC = () => {
  // 1. Вызываем наш главный хук. Вся логика, state, запросы - внутри него.
  const {
    achievements,
    loading,
    error,
    currentPage,
    handlePreviousPage,
    handleNextPage,
    canGoNext,
    canGoPrevious,
    handleEdit,
    handleShowAddForm,
    handleDelete,
    handleFormSuccess,
    showForm,
    setShowForm,
    achievementToEdit,
  } = useAchievementsManagement();

  // 2. Рендерим UI, просто передавая данные и функции из хука в дочерние компоненты.
  return (
    <div className="page-container">
      {/* Хедер получает колбэк для показа формы и флаг загрузки */}
      <AchievementsHeader
        isLoading={loading}
        onShowForm={handleShowAddForm}
      />

      {/* Форма показывается по условию showForm */}
      {showForm && (
        <AchievementForm
          setShowForm={setShowForm}
          achievementToEdit={achievementToEdit}
          onSuccess={handleFormSuccess}
        />
      )}
      
      {/* 
        Улучшаем UX: таблица скрывается, когда мы создаем новый элемент, 
        но остается видимой, когда мы редактируем существующий.
      */}
      {(!showForm || achievementToEdit) && (
        <AchievementsTable
          achievements={achievements}
          isLoading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
        />
      )}
    </div>
  );
};