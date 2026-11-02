import axiosInstance from './axios';
import { buildQueryString } from './buildQuery';

// Large selector requests are split into pages accepted by the backend.
export async function getList<T>(url: string, params: object = {}): Promise<T[]> {
  const query = params as Record<string, unknown>;
  const requested = typeof query.limit === 'number' ? query.limit : 50;
  const initialOffset = typeof query.offset === 'number' ? query.offset : 0;
  const items: T[] = [];
  while (items.length < requested) {
    const limit = Math.min(200, requested - items.length);
    const response = await axiosInstance.get<T[]>(`${url}${buildQueryString({ ...query, limit, offset: initialOffset + items.length })}`);
    if (!Array.isArray(response.data)) throw new Error('Сервер вернул некорректный список данных.');
    items.push(...response.data);
    if (response.data.length < limit) break;
  }
  return items;
}
