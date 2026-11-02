// --- Путь: src/components/admin/LearningSubtopicsManagement/LearningSubtopicsManagement.tsx ---

import React from 'react';
import { useLearningSubtopicsManagement } from '../../../hooks/admin/LearningSubtopicsManagement/useLearningSubtopicsManagement';
import { LearningSubtopicsHeader } from './LearningSubtopicsHeader';
import { LearningSubtopicsTable } from './LearningSubtopicsTable';
import { LearningSubtopicForm } from './LearningSubtopicForm';
import { Modal } from '../../ui/Modal/Modal';
import '../../../styles/admin/ui/PageLayout.css';

export const LearningSubtopicsManagement: React.FC = () => {
  const {
    topics,
    selectedTopicId,
    handleTopicChange,
    subtopics,
    error,
    isLoading,
    handleEdit,
    handleDelete,
    handleShowAddForm,
    handleFormSuccess,
    showForm,
    setShowForm,
    subtopicToEdit,
    currentPage,
    canGoNext,
    canGoPrevious,
    handleNextPage,
    handlePreviousPage,
    parentTopicId, // Получаем ID для новой подтемы из хука
  } = useLearningSubtopicsManagement();

  return (
    <div className="page-container">
      <LearningSubtopicsHeader
        isLoading={isLoading}
        onShowForm={handleShowAddForm}
        topics={topics}
        selectedTopicId={selectedTopicId}
        onTopicChange={handleTopicChange}
        isAddButtonDisabled={!selectedTopicId} // Кнопка неактивна, если тема не выбрана
      />

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={subtopicToEdit ? 'Редактировать подтему' : 'Создать новую подтему'}
        size="md"
      >
        <LearningSubtopicForm
          subtopicToEdit={subtopicToEdit}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
          topics={topics} // Передаем список тем для селекта в форме
          parentTopicIdForNew={parentTopicId} // <--- ВОТ ИСПРАВЛЕНИЕ: передаем ID для нового элемента
        />
      </Modal>

      <LearningSubtopicsTable
        subtopics={subtopics}
        isLoading={isLoading} // Передаем общий флаг загрузки
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