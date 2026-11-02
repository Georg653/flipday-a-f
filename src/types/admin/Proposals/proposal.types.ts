// --- Путь: src/types/admin/Proposals/proposal.types.ts ---

// Определяем все возможные статусы для строгой типизации
export type ProposalStatus = 'pending' | 'approved' | 'needed_feedback' | 'finished' | 'canceled';

// Тип, как данные приходят с бэкенда
export interface Proposal {
  id: string; // UUID
  title: string;
  description: string;
  status: ProposalStatus;
  votes: number;
  user_vote: number; // В админке может не использоваться, но пусть будет
  user_id: number;
}

// =============================================================================
// ТИПЫ ДЛЯ API
// =============================================================================

// Параметры для фильтрации списка
export interface ProposalFilterParams {
  limit?: number;
  offset?: number;
  status_filter?: ProposalStatus | 'all'; // 'all' для фронтенда, чтобы сбросить фильтр
}

// Payload для обновления статуса (PATCH-запрос)
export interface UpdateProposalStatusPayload {
  status: ProposalStatus;
}