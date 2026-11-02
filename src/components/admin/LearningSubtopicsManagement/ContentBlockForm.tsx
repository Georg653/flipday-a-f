// --- Путь: src/components/admin/NewsManagement/ContentBlockForm.tsx ---

import React from 'react';
import type { ContentBlockFormProps } from '../../../types/admin/News/news_props.types';
import type { CollectionItemFormData } from '../../../types/admin/News/news.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Select } from '../../ui/Select/Select';
import { createImageUrl } from '../../../utils/media';
import './ContentBlockForm.css';

// --- НОВЫЙ КОМПОНЕНТ ДЛЯ РЕДАКТИРОВАНИЯ КОЛЛЕКЦИЙ (АЛЬБОМ/СЛАЙДЕР) ---
const CollectionEditor: React.FC<{
  block: ContentBlockFormProps['block'];
  onUpdateBlock: ContentBlockFormProps['onUpdateBlock'];
}> = ({ block, onUpdateBlock }) => {
    
    // Обработчик изменения файла для конкретного элемента коллекции
    const handleItemFileChange = (itemId: string, file: File | null) => {
        const newItems = (block.items || []).map(item => 
            item.id === itemId 
                ? { ...item, file, preview: file ? URL.createObjectURL(file) : item.url } 
                : item
        );
        onUpdateBlock(block.id, { items: newItems });
    };

    // Добавление нового пустого элемента в коллекцию
    const handleAddItem = () => {
        const newItem: CollectionItemFormData = { id: crypto.randomUUID(), url: null, file: null, preview: null };
        const newItems = [...(block.items || []), newItem];
        onUpdateBlock(block.id, { items: newItems });
    };

    // Удаление элемента из коллекции
    const handleRemoveItem = (itemId: string) => {
        const newItems = (block.items || []).filter(item => item.id !== itemId);
        onUpdateBlock(block.id, { items: newItems });
    };

    return (
        <div className="collection-editor">
            <div className="collection-items-grid">
                {(block.items || []).map(item => (
                    <div key={item.id} className="collection-item">
                        <ImageUpload
                            id={`file-collection-${item.id}`}
                            name="collection_item_file"
                            previewUrl={item.preview || createImageUrl(item.url)}
                            onChange={(e) => handleItemFileChange(item.id, e.target.files?.[0] || null)}
                        />
                        <Button size="icon" variant="destructive" onClick={() => handleRemoveItem(item.id)} className="collection-item-delete" aria-label="Удалить изображение">×</Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>+ Добавить изображение</Button>
        </div>
    );
};


export const ContentBlockForm: React.FC<ContentBlockFormProps> = ({
  block,
  index,
  isSubmitting,
  onRemoveBlock,
  onUpdateBlock,
  onMoveBlockUp,
  onMoveBlockDown,
}) => {

  const renderBlockFields = () => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="heading-editor">
            <Input name="content" value={block.content || ''} onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })} disabled={isSubmitting} placeholder="Текст заголовка..."/>
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
        return <Textarea name="content" value={block.content || ''} onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })} disabled={isSubmitting} rows={5} placeholder="Введите текст..."/>;

      case 'image':
      case 'video':
        return (
          <ImageUpload
            id={`file-${block.id}`} name="file"
            onChange={(e) => onUpdateBlock(block.id, { file: e.target.files?.[0] || null })}
            previewUrl={block.file ? URL.createObjectURL(block.file) : createImageUrl(block.src)}
            label={block.type === 'image' ? "Изображение" : "Видео"}
          />
        );

      case 'audio':
        return (
          <>
            <p>Текущий файл: {block.src || 'не выбран'}</p>
            <Input type="file" id={`file-${block.id}`} name="file" onChange={(e) => onUpdateBlock(block.id, { file: e.target.files?.[0] || null })} accept="audio/*"/>
          </>
        );
      
      // ИЗМЕНЕНО: Подключаем новый редактор для альбомов и слайдеров
      case 'album':
      case 'slider':
        return <CollectionEditor block={block} onUpdateBlock={onUpdateBlock} />;
      
      case 'test':
        return <p>Редактор для типа "test" еще в разработке.</p>;

      default: return null;
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