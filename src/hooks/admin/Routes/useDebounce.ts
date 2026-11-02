// --- Путь: src/hooks/admin/Routes/useDebounce.ts ---
// ПОЛНАЯ ВЕРСИЯ

import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймаут при каждом новом значении или при размонтировании
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};