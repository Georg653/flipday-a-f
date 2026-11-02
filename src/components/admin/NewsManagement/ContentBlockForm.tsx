// --- Путь: src/components/admin/NewsManagement/ContentBlockForm.tsx ---
// ПОЛНАЯ ПЕРЕПИСАННАЯ ВЕРСИЯ

import React from 'react';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Select } from '../../ui/Select/Select';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { createImageUrl } from '../../../utils/media';
import type {
  ContentBlockFormData,
  CollectionItemFormData,
  TestOptionFormData,
} from '../../../types/common/content.types';
import './ContentBlockForm.css';

// Компонент для коллекций (альбом/слайдер)
const CollectionEditor: React.FC<{
  block: ContentBlockFormData;
  onUpdateBlock: (id: string, data: Partial<ContentBlockFormData>) => void;
}> = ({ block, onUpdateBlock }) => {
  const handleItemFileChange = (itemId: string, file: File | null) => {
    const newItems = (block.items || []).map((item) =>
      item.id === itemId
        ? { ...item, file, preview: file ? URL.createObjectURL(file) : item.url }
        : item
    );
    onUpdateBlock(block.id, { items: newItems });
  };
  const handleAddItem = () => {
    const newItem: CollectionItemFormData = { id: crypto.randomUUID(), url: null, file: null, preview: null };
    onUpdateBlock(block.id, { items: [...(block.items || []), newItem] });
  };
  const handleRemoveItem = (itemId: string) => {
    onUpdateBlock(block.id, { items: (block.items || []).filter((item) => item.id !== itemId) });
  };

  return (
    <div className="collection-editor">
      <div className="collection-items-grid">
        {(block.items || []).map((item) => (
          <div key={item.id} className="collection-item">
            <ImageUpload
              id={`file-collection-${item.id}`} name="collection_item_file"
              previewUrl={item.preview || createImageUrl(item.url)}
              onChange={(e) => handleItemFileChange(item.id, e.target.files?.[0] || null)}
            />
            <Button size="icon" variant="destructive" onClick={() => handleRemoveItem(item.id)} className="collection-item-delete" aria-label="Удалить">×</Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>+ Добавить</Button>
    </div>
  );
};

// Компонент для редактирования тестов
const TestEditor: React.FC<{
  block: ContentBlockFormData;
  onUpdateBlock: (id: string, data: Partial<ContentBlockFormData>) => void;
}> = ({ block, onUpdateBlock }) => {
  const handleFieldChange = (field: 'question' | 'message', value: string) => {
    onUpdateBlock(block.id, { [field]: value });
  };
  const handleOptionTextChange = (optionId: string, text: string) => {
    onUpdateBlock(block.id, { options: (block.options || []).map((opt) => opt.id === optionId ? { ...opt, text } : opt) });
  };
  const handleCorrectOptionChange = (optionId: string) => {
    onUpdateBlock(block.id, { options: (block.options || []).map((opt) => ({ ...opt, isCorrect: opt.id === optionId })) });
  };
  const handleAddOption = () => {
    const newOption: TestOptionFormData = { id: crypto.randomUUID(), text: '', isCorrect: false };
    onUpdateBlock(block.id, { options: [...(block.options || []), newOption] });
  };
  const handleRemoveOption = (optionId: string) => {
    if ((block.options?.length ?? 0) <= 1) return;
    onUpdateBlock(block.id, { options: (block.options || []).filter((opt) => opt.id !== optionId) });
  };

  return (
    <div className="test-editor">
      <div className="form-group">
        <label>Вопрос теста*</label>
        <Input value={block.question || ''} onChange={(e) => handleFieldChange('question', e.target.value)} placeholder="Введите вопрос..." />
      </div>
      <label>Варианты ответов (отметьте правильный)</label>
      <div className="test-options-list">
        {(block.options || []).map((option, index) => (
          <div key={option.id} className="test-option-item">
            <Checkbox id={`correct-${option.id}`} label="" checked={option.isCorrect} onChange={() => handleCorrectOptionChange(option.id)} title="Отметить как правильный ответ" />
            <Input value={option.text} onChange={(e) => handleOptionTextChange(option.id, e.target.value)} placeholder={`Вариант ${index + 1}`} className="test-option-input" />
            <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveOption(option.id)} disabled={(block.options?.length ?? 0) <= 1}>-</Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>+ Добавить вариант</Button>
      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label>Сообщение после ответа (опционально)</label>
        <Textarea value={block.message || ''} onChange={(e) => handleFieldChange('message', e.target.value)} rows={2} placeholder="Объяснение правильного ответа..." />
      </div>
    </div>
  );
};

// Пропсы для главной формы
interface ContentBlockFormProps {
  block: ContentBlockFormData;
  index: number;
  isSubmitting: boolean;
  onRemoveBlock: (id: string) => void;
  onUpdateBlock: (id: string, newBlockData: Partial<ContentBlockFormData>) => void;
  onMoveBlockUp: () => void;
  onMoveBlockDown: () => void;
  onAddBlock: (type: ContentBlockFormData['type'], index: number) => void;
}

export const ContentBlockForm: React.FC<ContentBlockFormProps> = ({
  block, index, isSubmitting, onRemoveBlock, onUpdateBlock, onMoveBlockUp, onMoveBlockDown
}) => {
  const renderBlockFields = () => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="heading-editor">
            <Input name="content" value={block.content || ''} onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })} disabled={isSubmitting} placeholder="Текст заголовка..." />
            <Select
              label="Уровень"
              value={block.level}
              onChange={(e) => onUpdateBlock(block.id, { level: Number(e.target.value) as 1 | 2 | 3 | 4 })}
              options={[{ value: 1, label: 'H1' }, { value: 2, label: 'H2' }, { value: 3, label: 'H3' }, { value: 4, label: 'H4' }]}
              disabled={isSubmitting}
            />
          </div>
        );
      case 'text':
        return <Textarea name="content" value={block.content || ''} onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })} disabled={isSubmitting} rows={5} placeholder="Введите текст..." />;
      case 'image':
      case 'video':
        return (
          <>
            <ImageUpload id={`file-${block.id}`} name="file" onChange={(e) => onUpdateBlock(block.id, { file: e.target.files?.[0] || null })} mediaType={block.type} previewUrl={block.file ? URL.createObjectURL(block.file) : createImageUrl(block.src)} label={block.type === 'image' ? "Изображение" : "Видео"} />
            <Input name="text" value={block.text || ''} onChange={(e) => onUpdateBlock(block.id, { text: e.target.value })} disabled={isSubmitting} placeholder="Подпись (опционально)..." style={{ marginTop: '0.5rem' }} />
          </>
        );
      case 'audio':
        return (
          <>
            <Input name="text" value={block.text || ''} onChange={(e) => onUpdateBlock(block.id, { text: e.target.value })} disabled={isSubmitting} placeholder="Заголовок аудио (опционально)..." style={{ marginBottom: '0.5rem' }} />
            <p>Текущий файл: {block.src || 'не выбран'}</p>
            <Input type="file" id={`file-${block.id}`} name="file" onChange={(e) => onUpdateBlock(block.id, { file: e.target.files?.[0] || null })} accept="audio/*" />
          </>
        );
      case 'album':
      case 'slider':
        return <CollectionEditor block={block} onUpdateBlock={onUpdateBlock} />;
      case 'test':
        return <TestEditor block={block} onUpdateBlock={onUpdateBlock} />;
      default:
        return null;
    }
  };

  return (
    <div className="content-block-form">
      <div className="block-header">
        <span className="block-title">Блок: {block.type}</span>
        <div className="block-controls">
          <Button type="button" size="sm" variant="outline" onClick={onMoveBlockUp} disabled={index === 0}>↑</Button>
          <Button type="button" size="sm" variant="outline" onClick={onMoveBlockDown}>↓</Button>
          <Button type="button" size="sm" variant="destructive" onClick={() => onRemoveBlock(block.id)}>Удалить</Button>
        </div>
      </div>
      <div className="block-fields">
        {renderBlockFields()}
      </div>
    </div>
  );
};