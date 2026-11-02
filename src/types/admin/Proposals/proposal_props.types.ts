// --- Путь: src/types/admin/Proposals/proposal_props.types.ts ---

import type { Proposal, ProposalStatus } from './proposal.types';

export interface ProposalsTableProps {
  proposals: Proposal[];
  isLoading: boolean;
  error: string | null;
  onOpenStatusModal: (proposal: Proposal) => void;
  // Пагинация
  currentPage: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
}

export interface ProposalsHeaderProps {
  isLoading: boolean;
  activeFilter: ProposalStatus | 'all';
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

// Пропсы для модального окна обновления статуса
export interface ProposalStatusUpdateModalProps {
  proposal: Proposal | null;
  isUpdating: boolean;
  onUpdate: (newStatus: ProposalStatus) => void;
  onClose: () => void;
}