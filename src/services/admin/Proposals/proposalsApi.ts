// --- Путь: src/services/admin/Proposals/proposalsApi.ts ---
// ПОЛНАЯ ВЕРСИЯ

import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { getList } from '../api/list';

import type {
  Proposal,
  ProposalFilterParams,
  UpdateProposalStatusPayload,
  ProposalStatus
} from '../../../types/admin/Proposals/proposal.types';

export const ProposalsApi = {
  /**
   * Получение списка предложений с пагинацией и фильтрацией.
   */
  getProposals: async (params: ProposalFilterParams = {}): Promise<Proposal[]> => {
    // Создаем копию параметров, чтобы не мутировать исходный объект
    const apiParams: { limit?: number; offset?: number; status_filter?: ProposalStatus } = {
        limit: params.limit,
        offset: params.offset,
    };

    // Бэкенд не понимает 'all', поэтому мы отправляем `status_filter`
    // только если он не равен 'all'.
    if (params.status_filter && params.status_filter !== 'all') {
      apiParams.status_filter = params.status_filter;
    }
    
    return getList<Proposal>((`${ENDPOINTS.PROPOSALS}`), apiParams);
  },

  /**
   * Получение одного предложения по его ID (UUID в виде строки).
   */
  getProposalById: async (proposalId: string): Promise<Proposal> => {
    const response = await axiosInstance.get<Proposal>(ENDPOINTS.PROPOSAL_DETAIL(proposalId));
    return response.data;
  },

  /**
   * Обновление статуса предложения.
   * Использует PATCH-запрос на специальный эндпоинт /status.
   */
  updateProposalStatus: async (
    proposalId: string,
    payload: UpdateProposalStatusPayload
  ): Promise<Proposal> => {
    const url = `${ENDPOINTS.PROPOSAL_DETAIL(proposalId)}/status`;
    const response = await axiosInstance.patch<Proposal>(url, payload);
    return response.data;
  },
};