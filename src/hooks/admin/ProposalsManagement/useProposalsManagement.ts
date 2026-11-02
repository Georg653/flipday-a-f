// --- Путь: src/hooks/admin/ProposalsManagement/useProposalsManagement.ts ---

import { useState, useEffect, useCallback } from 'react';
import type { Proposal, ProposalStatus } from '../../../types/admin/Proposals/proposal.types';
import { ProposalsApi } from '../../../services/admin/Proposals/proposalsApi';

const ITEMS_PER_PAGE = 10;

export const useProposalsManagement = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние для пагинации и фильтра
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');

  // Состояние для модального окна
  const [proposalToUpdate, setProposalToUpdate] = useState<Proposal | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Функция загрузки данных
  const fetchProposals = useCallback(async (page: number, filter: ProposalStatus | 'all') => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProposalsApi.getProposals({
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        status_filter: filter,
      });
      setProposals(data);
      setHasNextPage(data.length === ITEMS_PER_PAGE);
    } catch {
      
      setError('Ошибка загрузки предложений.');
      setProposals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Эффект для перезагрузки при смене страницы или фильтра
  useEffect(() => {
    fetchProposals(currentPage, statusFilter);
  }, [currentPage, statusFilter, fetchProposals]);

  // --- Обработчики ---
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1); // Сбрасываем на 1-ю страницу при смене фильтра
    setStatusFilter(e.target.value as ProposalStatus | 'all');
  };
  
  const onOpenStatusModal = (proposal: Proposal) => {
    setProposalToUpdate(proposal);
  };
  
  const onCloseStatusModal = () => {
    setProposalToUpdate(null);
  };

  const handleUpdateStatus = async (newStatus: ProposalStatus) => {
    if (!proposalToUpdate) return;
    
    setIsUpdating(true);
    try {
      const updatedProposal = await ProposalsApi.updateProposalStatus(proposalToUpdate.id, { status: newStatus });
      // Оптимистичное обновление в UI
      setProposals(prev => prev.map(p => p.id === updatedProposal.id ? updatedProposal : p));
      onCloseStatusModal();
    } catch {
      setError('Ошибка обновления статуса.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePreviousPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const handleNextPage = () => { if (hasNextPage) setCurrentPage(p => p + 1); };

  return {
    proposals, loading, error,
    currentPage, canGoNext: hasNextPage, canGoPrevious: currentPage > 1,
    handlePreviousPage, handleNextPage,
    statusFilter, handleFilterChange,
    proposalToUpdate, isUpdating, onOpenStatusModal, onCloseStatusModal, handleUpdateStatus,
  };
};