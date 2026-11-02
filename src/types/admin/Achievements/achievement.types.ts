// src/types/admin/Achievements/achievement.types.ts

// Тип данных, который приходит с бэкенда. 1-в-1 как в API.
export interface Achievement {
  id: number;
  name: string;
  description: string;
  achievement_type: string;
  criteria_value: number;
  criteria_unit: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

// Тип для состояния НАШЕЙ ФОРМЫ в React. Он может отличаться от API.
export interface AchievementFormData {
  name: string;
  description: string;
  achievement_type: string;
  criteria_value: string;       // В input'ах формы значения всегда строки.
  criteria_unit: string;
  image_file: File | null;      // Локальный файл, который выбрал юзер.
  image_preview_url: string | null; // URL для превью картинки в интерфейсе.
  remove_image: boolean;        // Флаг для удаления картинки на бэке. ЭТО ПОЛЕ ОБЯЗАТЕЛЬНО.
}

// Начальное (пустое) состояние для этой формы.
export const initialAchievementFormData: AchievementFormData = {
  name: "",
  description: "",
  achievement_type: "",
  criteria_value: "0",
  criteria_unit: "",
  image_file: null,
  image_preview_url: null,
  remove_image: false, // Инициализируем как false.
};

// Тип для JSON-объекта, который мы отправляем на бэк при СОЗДАНИИ.
export interface AchievementCreatePayload {
  image_url?: string;
  name: string;
  description: string;
  achievement_type: string;
  criteria_value: number; // Здесь значение уже должно быть числом.
  criteria_unit: string;
}

// Тип для JSON-объекта при ОБНОВЛЕНИИ (все поля необязательны).
export type AchievementUpdatePayload = Partial<AchievementCreatePayload>;


// --- Вспомогательные типы для пропсов хуков ---

// Опции для хука useAchievementForm.
export interface AchievementFormOptions {
  onSuccess: (achievement: Achievement) => void;
  achievementToEdit: Achievement | null;
}

// Параметры для фильтрации/пагинации списка.
export interface AchievementFilterParams {
  limit?: number;
  offset?: number;
}