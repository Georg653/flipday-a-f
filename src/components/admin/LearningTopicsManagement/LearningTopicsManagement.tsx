// --- Путь: src/components/admin/LearningTopicsManagement/LearningTopicsManagement.tsx ---

import React from 'react';
import { useLearningTopicsManagement } from '../../../hooks/admin/LearningTopicsManagement/useLearningTopicsManagement';
import { LearningTopicsHeader } from './LearningTopicsHeader';
import { LearningTopicsTable } from './LearningTopicsTable';
import { LearningTopicForm } from './LearningTopicForm';
import { Modal } from '../../ui/Modal/Modal';
import '../../../styles/admin/ui/PageLayout.css';

export const LearningTopicsManagement: React.FC = () => {
  const {
    topics,
    loading,
    error,
    handleEdit,
    handleDelete,
    handleShowAddForm,
    handleFormSuccess,
    showForm,
    setShowForm,
    topicToEdit,
    currentPage,
    canGoNext,
    canGoPrevious,
    handleNextPage,
    handlePreviousPage,
  } = useLearningTopicsManagement();

  return (
    <div className="page-container">
      <LearningTopicsHeader
        isLoading={loading}
        onShowForm={handleShowAddForm}
      />

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={topicToEdit ? 'Редактировать тему' : 'Создать новую тему'}
        size="md" // Средний размер модалки для этой формы
      >
        <LearningTopicForm
          topicToEdit={topicToEdit}
          onSuccess={(topic) => {
            handleFormSuccess(topic); 
            // Форма закроется автоматически из handleFormSuccess
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <LearningTopicsTable
        topics={topics}
        isLoading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />
    </div>
  );
};  