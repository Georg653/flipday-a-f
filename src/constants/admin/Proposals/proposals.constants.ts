// src/constants/admin/Proposals/proposals.constants.ts
import type { ProposalStatus } from '../../../types/admin/Proposals/proposal.types'; // Импортируем тип для большей безопасности

export const ITEMS_PER_PAGE_PROPOSALS = 10; // Количество предложений на странице по умолчанию

interface ProposalStatusOption {
  value: ProposalStatus | "all"; // "all" для сброса фильтра
  label: string;
}

export const PROPOSAL_STATUS_OPTIONS: ProposalStatusOption[] = [
  { value: "all", label: "Все статусы" },
  { value: "pending", label: "Ожидает" },
  { value: "approved", label: "Одобрено" },
  { value: "needed_feedback", label: "Нужна доработка" },
  { value: "finished", label: "Завершено" },
  { value: "canceled", label: "Отменено" },
];

// Можно также создать объект для отображения статусов на русском в таблице, если нужно
export const PROPOSAL_STATUS_MAP: Record<ProposalStatus, string> = {
  pending: "Ожидает",
  approved: "Одобрено",
  needed_feedback: "Нужна доработка",
  finished: "Завершено",
  canceled: "Отменено",
};