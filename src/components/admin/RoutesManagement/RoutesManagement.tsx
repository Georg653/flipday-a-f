// --- Путь: src/components/admin/RoutesManagement/RoutesManagement.tsx ---

import React from 'react';
import { useRoutesManagement } from '../../../hooks/admin/Routes/useRoutesManagement';
import { RoutesHeader } from './RoutesHeader';
import { RoutesTable } from './RoutesTable';
import { RouteForm } from './RouteForm';
import { Modal } from '../../ui/Modal/Modal';
import '../../../styles/admin/ui/PageLayout.css';

export const RoutesManagement: React.FC = () => {
  const {
    routes,
    categories,
    loading,
    error,
    handleEdit,
    handleDelete,
    handleShowAddForm,
    handleFormSuccess,
    showForm,
    setShowForm,
    routeToEdit,
    // Пагинация
    currentPage,
    hasNextPage,
    handlePreviousPage,
    handleNextPage,
    // Фильтры
    searchFilter,
    categoryFilter,
    handleCategoryFilterChange,
    handleSearchFilterChange,
  } = useRoutesManagement();

  return (
    <div className="page-container">
      <RoutesHeader
        isLoading={loading}
        onShowForm={handleShowAddForm}
        categories={categories}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={handleCategoryFilterChange}
        searchFilter={searchFilter}
        onSearchFilterChange={handleSearchFilterChange}
      />

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={routeToEdit ? 'Редактировать маршрут' : 'Создать новый маршрут'}
        size="xl" // Большой размер для конструктора
      >
        <RouteForm
          routeToEdit={routeToEdit}
          onSuccess={() => {
            handleFormSuccess();
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <RoutesTable
        routes={routes}
        isLoading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        canGoNext={hasNextPage}
        canGoPrevious={currentPage > 1}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />
    </div>
  );
};