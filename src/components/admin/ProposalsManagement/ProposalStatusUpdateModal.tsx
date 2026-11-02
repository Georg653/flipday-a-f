// --- Путь: src/components/admin/ProposalsManagement/ProposalStatusUpdateModal.tsx ---

import React, { useState, useEffect } from 'react';
import type { ProposalStatusUpdateModalProps } from '../../../types/admin/Proposals/proposal_props.types';
import type { ProposalStatus } from '../../../types/admin/Proposals/proposal.types';
import { Select } from '../../ui/Select/Select';
import { Button } from '../../ui/Button/Button';
import '../../../styles/admin/ui/Form.css';

const statusOptions = [
  { value: 'pending', label: 'В ожидании' },
  { value: 'approved', label: 'Одобрить' },
  { value: 'needed_feedback', label: 'Запросить доработку' },
  { value: 'finished', label: 'Отметить как "Реализовано"' },
  { value: 'canceled', label: 'Отменить' },
];

export const ProposalStatusUpdateModal: React.FC<ProposalStatusUpdateModalProps> = ({
  proposal, isUpdating, onUpdate, onClose,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ProposalStatus>('pending');

  useEffect(() => {
    if (proposal) {
      setSelectedStatus(proposal.status);
    }
  }, [proposal]);

  if (!proposal) return null;

  const handleSave = () => {
    onUpdate(selectedStatus);
  };

  return (
    <div className="form-container" style={{ padding: '0', boxShadow: 'none', marginBottom: 0 }}>
      <p>Изменение статуса для предложения: <strong>"{proposal.title}"</strong></p>
      <div className="form-group">
        <label htmlFor="status-update-select">Новый статус</label>
        <Select
          id="status-update-select"
          options={statusOptions}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as ProposalStatus)}
          disabled={isUpdating}
        />
      </div>
      <div className="form-actions">
        <Button onClick={handleSave} disabled={isUpdating} variant="success">
          {isUpdating ? 'Сохранение...' : 'Сохранить'}
        </Button>
        <Button onClick={onClose} disabled={isUpdating} variant="outline">
          Отмена
        </Button>
      </div>
    </div>
  );
};