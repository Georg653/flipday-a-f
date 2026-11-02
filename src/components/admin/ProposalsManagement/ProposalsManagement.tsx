// --- Путь: src/components/admin/ProposalsManagement/ProposalsManagement.tsx ---

import React from 'react';
import { useProposalsManagement } from '../../../hooks/admin/ProposalsManagement/useProposalsManagement';
import { ProposalsHeader } from './ProposalsHeader';
import { ProposalsTable } from './ProposalsTable';
import { ProposalStatusUpdateModal } from './ProposalStatusUpdateModal';
import { Modal } from '../../ui/Modal/Modal';
import '../../../styles/admin/ui/PageLayout.css';

export const ProposalsManagement: React.FC = () => {
  const {
    proposals, loading, error,
    currentPage, canGoNext, canGoPrevious, handlePreviousPage, handleNextPage,
    statusFilter, handleFilterChange,
    proposalToUpdate, isUpdating, onOpenStatusModal, onCloseStatusModal, handleUpdateStatus,
  } = useProposalsManagement();

  return (
    <div className="page-container">
      <ProposalsHeader
        isLoading={loading}
        activeFilter={statusFilter}
        onFilterChange={handleFilterChange}
      />

      <Modal
        isOpen={!!proposalToUpdate}
        onClose={onCloseStatusModal}
        title="Обновить статус предложения"
        size="md"
      >
        <ProposalStatusUpdateModal
          proposal={proposalToUpdate}
          isUpdating={isUpdating}
          onUpdate={handleUpdateStatus}
          onClose={onCloseStatusModal}
        />
      </Modal>

      <ProposalsTable
        proposals={proposals}
        isLoading={loading}
        error={error}
        onOpenStatusModal={onOpenStatusModal}
        currentPage={currentPage}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />
    </div>
  );
};