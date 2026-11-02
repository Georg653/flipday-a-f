// --- Путь: src/services/admin/api/buildQuery.ts ---

export const buildQueryString = (params: object): string => {
  const query = Object.entries(params)
    // Фильтруем пустые/неопределенные значения, но оставляем boolean `false`
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      let finalValue: string;

      // Специальная обработка для boolean значений
      if (typeof value === 'boolean') {
        // Преобразуем true в строку "true", а false в "false".
        // Это стандартный способ, который понимают большинство бэкендов, включая FastAPI.
        finalValue = value ? 'true' : 'false';
      } else {
        // Все остальное просто превращаем в строку
        finalValue = String(value);
      }
      
      return `${encodeURIComponent(key)}=${encodeURIComponent(finalValue)}`;
    })
    .join('&');

  return query ? `?${query}` : '';
};