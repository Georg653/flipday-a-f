// --- Путь: src/components/admin/NewsManagement/AddBlockPanel.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React from 'react';
import type { ContentBlockFormData } from '../../../types/common/content.types';
import { Button } from '../../ui/Button/Button';
import './AddBlockPanel.css';

interface AddBlockPanelProps {
  onAddBlock: (type: ContentBlockFormData['type'], index?: number) => void;
}

const blockTypes: { label: string; type: ContentBlockFormData['type'] }[] = [
  { label: 'Текст', type: 'text' },
  { label: 'Заголовок', type: 'heading' },
  { label: 'Изображение', type: 'image' },
  { label: 'Видео', type: 'video' },
  { label: 'Аудио', type: 'audio' },
  { label: 'Альбом', type: 'album' },
  { label: 'Слайдер', type: 'slider' },
  { label: 'Тест', type: 'test' },
];

export const AddBlockPanel: React.FC<AddBlockPanelProps> = ({ onAddBlock }) => {
  return (
    <div className="add-block-panel">
      <span className="add-block-panel-title">Добавить новый блок:</span>
      <div className="add-block-buttons">
        {blockTypes.map(({ label, type }) => (
          <Button
            key={type}
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onAddBlock(type)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};