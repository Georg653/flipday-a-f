// --- Путь: src/components/ui/Pagination/Pagination.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React from 'react';
import { Button } from '../Button/Button';
import './Pagination.css'; // Убедись, что стили подключены

interface PaginationProps {
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  isLoading?: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  handlePreviousPage,
  handleNextPage,
  isLoading,
  canGoNext,
  canGoPrevious,
}) => {
  // --- ЖЕЛЕЗОБЕТОННАЯ ЛОГИКА ---
  // Компонент должен исчезнуть ТОЛЬКО в одном случае:
  // когда мы на первой странице И точно знаем, что следующей страницы НЕТ.
  if (currentPage === 1 && !canGoNext) {
    return null;
  }

  // Логика блокировки кнопок. Она простая и правильная.
  const isPrevDisabled = isLoading || !canGoPrevious;
  const isNextDisabled = isLoading || !canGoNext;

  return (
    <div className="pagination-container">
      <p className="pagination-info">
        Страница {currentPage}
      </p>
      
      <div className="pagination-buttons">
        <Button
          onClick={handlePreviousPage}
          disabled={isPrevDisabled}
          variant="outline"
          size="sm"
        >
          Назад
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={isNextDisabled}
          variant="outline"
          size="sm"
        >
          Вперед
        </Button>
      </div>
    </div>
  );
};