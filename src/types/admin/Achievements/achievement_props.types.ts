// src/types/admin/Achievements/achievement_props.types.ts
// Этот файл ТОЛЬКО описывает пропсы для UI-компонентов. Он ничего сам не объявляет.

import type { Achievement } from './achievement.types';

// Пропсы для компонента ТАБЛИЦЫ
export interface AchievementsTableProps {
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: number) => void;
}

// Пропсы для компонента ХЕДЕРА
export interface AchievementsHeaderProps {
  isLoading: boolean;
  onShowForm: () => void;
}