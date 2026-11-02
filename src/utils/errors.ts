import axios from 'axios';

function detailText(detail: unknown): string {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map(item => {
    if (typeof item !== 'object' || item === null) return String(item);
    const error = item as { loc?: unknown[]; msg?: unknown };
    const field = error.loc?.filter(part => part !== 'body' && part !== 'query').join('.');
    return `${field ? field + ': ' : ''}${typeof error.msg === 'string' ? error.msg : JSON.stringify(item)}`;
  }).join('; ');
  return detail ? JSON.stringify(detail) : '';
}

export function toRequestError(cause: unknown): { message: string; response?: { status: number; data: { detail: string } } } {
  if (axios.isAxiosError(cause) || (typeof cause === 'object' && cause !== null && 'response' in cause)) {
    const error = cause as { message?: string; response?: { status?: number; data?: { detail?: unknown } } };
    const message = detailText(error.response?.data?.detail) || error.message || 'Ошибка запроса.';
    return { message, ...(error.response ? { response: { status: error.response.status || 0, data: { detail: message } } } : {}) };
  }
  return { message: cause instanceof Error ? cause.message : 'Неизвестная ошибка.' };
}
