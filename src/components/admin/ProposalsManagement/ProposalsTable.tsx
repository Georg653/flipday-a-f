// --- Путь: src/components/admin/ProposalsManagement/ProposalsTable.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React from 'react';
import type { ProposalsTableProps } from '../../../types/admin/Proposals/proposal_props.types';
import type { ProposalStatus } from '../../../types/admin/Proposals/proposal.types';
import { Button } from '../../ui/Button/Button';
import { Pagination } from '../../ui/Pagination/Pagination';
import '../../../styles/admin/ui/Table.css';

// Словарь для красивого отображения статусов и их цветов
const statusMap: Record<ProposalStatus, { text: string; className: string }> = {
  pending: { text: 'В ожидании', className: 'status-pending' },
  approved: { text: 'Одобрено', className: 'status-approved' },
  needed_feedback: { text: 'Нужна доработка', className: 'status-feedback' },
  finished: { text: 'Реализовано', className: 'status-finished' },
  canceled: { text: 'Отменено', className: 'status-canceled' },
};

export const ProposalsTable: React.FC<ProposalsTableProps> = ({
  proposals,
  isLoading,
  error,
  onOpenStatusModal,
  currentPage,
  canGoNext,
  canGoPrevious,
  handleNextPage,
  handlePreviousPage,
}) => {
  if (isLoading) {
    return <div className="table-status-message">Загрузка предложений...{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
  }
  if (error && !proposals.length) {
    return <div className="table-status-message table-status-error">Ошибка: {error}</div>;
  }
  if (!proposals.length) {
    return <div className="table-status-message">Предложения с выбранным статусом не найдены.{canGoPrevious && <Button type="button" onClick={handlePreviousPage}>Предыдущая страница</Button>}</div>;
  }

  const truncateText = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="table-container">
      {error && <div role="alert" className="table-status-message table-status-error">{error}</div>}
      <div className="table-scroll-wrapper">
        <table className="table-main">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell" style={{width: '50%'}}>Заголовок</th>
              <th className="table-header-cell">Статус</th>
              <th className="table-header-cell" style={{ textAlign: 'center' }}>Голоса</th>
              <th className="table-header-cell">ID Пользователя</th>
              <th className="table-header-cell table-header-cell-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) => {
              const statusInfo = statusMap[proposal.status] || { text: proposal.status, className: '' };
              return (
                <tr key={proposal.id} className="table-body-row">
                  <td className="table-body-cell">
                    <strong>{truncateText(proposal.title, 80)}</strong>
                    <p className="table-description">{truncateText(proposal.description, 120)}</p>
                  </td>
                  <td className="table-body-cell">
                    <span className={`status-badge ${statusInfo.className}`}>{statusInfo.text}</span>
                  </td>
                  <td className="table-body-cell" style={{ textAlign: 'center' }}>{proposal.votes}</td>
                  <td className="table-body-cell" style={{ textAlign: 'center' }}>{proposal.user_id}</td>
                  <td className="table-body-cell">
                    <div className="table-actions-container">
                      <Button variant="outline" size="sm" onClick={() => onOpenStatusModal(proposal)}>
                        Изменить статус
                      </Button>
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
                currentPage={currentPage}
                totalItems={-1} // Слепая пагинация
                itemsPerPage={0}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                canGoNext={canGoNext}
                canGoPrevious={canGoPrevious}
                isLoading={isLoading}
            />
        </div>
      )}
    </div>
  );
};