// --- Путь: src/features/ContentEditor/contentEditor.helpers.ts ---

import type { ContentBlockFormData } from '../../types/common/content.types';

/**
 * Создает начальный объект блока контента для формы на фронтенде.
 * @param type - Тип создаваемого блока.
 */
export const createInitialBlock = (type: ContentBlockFormData['type']): ContentBlockFormData => {
  const id = crypto.randomUUID();
  switch (type) {
    case 'text':
      return { id, type, content: '' };
    case 'heading':
      return { id, type, content: '', level: 2 };
    case 'image':
      return { id, type, src: null, file: null };
    case 'video':
      return { id, type, src: null, file: null };
    case 'audio':
      return { id, type, src: null, file: null };
    case 'album':
      return { id, type, items: [] };
    case 'slider':
      return { id, type, items: [] };
    case 'test': {
      // Начинаем с одного правильного ответа для удобства
      const firstOptionId = crypto.randomUUID();
      return {
        id,
        type,
        question: '',
        options: [{ id: firstOptionId, text: '', isCorrect: true }],
        message: '',
      };
    }
    default:
      // TypeScript не позволит дойти сюда, если все типы обработаны
      throw new Error(`Неизвестный тип блока: ${type}`);
  }
};
