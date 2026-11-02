// --- Путь: src/components/admin/RouteCategoriesManagement/RouteCategoriesManagement.tsx ---

import React from 'react';
import { useRouteCategoriesManagement } from '../../../hooks/admin/RouteCategories/useRouteCategoriesManagement';
import { RouteCategoriesHeader } from './RouteCategoriesHeader';
import { RouteCategoriesTable } from './RouteCategoriesTable';
import { RouteCategoryForm } from './RouteCategoryForm';
import { Modal } from '../../ui/Modal/Modal';
import '../../../styles/admin/ui/PageLayout.css';

export const RouteCategoriesManagement: React.FC = () => {
  const {
    categories,
    loading,
    error,
    handleEdit,
    handleDelete,
    handleShowAddForm,
    handleFormSuccess,
    showForm,
    setShowForm,
    categoryToEdit,
  } = useRouteCategoriesManagement();

  return (
    <div className="page-container">
      <RouteCategoriesHeader
        isLoading={loading}
        onShowForm={handleShowAddForm}
      />

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={categoryToEdit ? 'Редактировать категорию' : 'Создать новую категорию'}
        size="md" // Средний размер для простой формы
      >
        <RouteCategoryForm
          categoryToEdit={categoryToEdit}
          onSuccess={() => {
            handleFormSuccess();
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <RouteCategoriesTable
        categories={categories}
        isLoading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};