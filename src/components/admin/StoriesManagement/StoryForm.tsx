import { JsonImportControl } from '../../../features/JsonImport/JsonImportControl';
// --- Путь: src/components/admin/StoriesManagement/StoryForm.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React, { useMemo } from 'react'; // <--- Добавлен useMemo
import { useStoryForm } from '../../../hooks/admin/Stories/useStoryForm';
import type { StoryFormProps } from '../../../types/admin/Stories/story_props.types';
import type { StoryContentItemFormData } from '../../../types/admin/Stories/story.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Select } from '../../ui/Select/Select';
import type { SelectOption } from '../../ui/Select/Select';
import { StoryPreview } from '../../previews/StoryPreview/StoryPreview';

import '../../../styles/admin/ui/Form.css';
import '../../../styles/admin/ui/Layouts.css';
import './StoryForm.css';

const contentTypeOptions: SelectOption[] = [
  { value: 'image', label: 'Изображение' },
  { value: 'video', label: 'Видео' },
];

// --- Вложенный компонент для одного слайда (без изменений) ---
interface ContentItemFormProps {
  item: StoryContentItemFormData;
  index: number;
  isSubmitting: boolean;
  onRemove: () => void;
  onItemChange: (id: string, field: keyof StoryContentItemFormData, value: StoryContentItemFormData[keyof StoryContentItemFormData]) => void;
  onFileChange: (id: string, file: File | null) => void;
}

const ContentItemForm: React.FC<ContentItemFormProps> = ({
  item,
  index,
  isSubmitting,
  onRemove,
  onItemChange,
  onFileChange,
}) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(item.id, e.target.files?.[0] || null);
  };
  
  return (
    <div className="story-content-item">
      <div className="content-item-header">
        <h5>Слайд {index + 1}</h5>
        <Button type="button" variant="destructive" size="sm" onClick={onRemove} disabled={isSubmitting}>
          Удалить
        </Button>
      </div>
      <div className="form-group">
        <Select
          label="Тип контента"
          id={`type-${item.id}`}
          options={contentTypeOptions}
          value={item.type}
          onChange={(e) => onItemChange(item.id, 'type', e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <label htmlFor={`duration-${item.id}`}>Длительность (сек)</label>
        <Input
          id={`duration-${item.id}`}
          type="number"
          value={item.duration}
          onChange={(e) => onItemChange(item.id, 'duration', e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <ImageUpload
          id={`content_file-${item.id}`}
          name="content_file"
          label="Файл контента (картинка/видео)"
          onChange={handleFile}
          previewUrl={item.content_preview}
          mediaType={item.type}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};


export const StoryForm: React.FC<StoryFormProps> = ({
  storyToEdit,
  onSuccess,
  onCancel,
}) => {
  const {
    formData, applyFromJson,
    isSubmitting,
    formError,
    handleChange, handleActiveChange,
    handlePreviewFileChange,
    handleRemovePreview,
    addContentItem,
    removeContentItem,
    handleContentItemChange,
    handleContentItemFileChange,
    handleSubmit,
  } = useStoryForm({ storyToEdit, onSuccess });

  // --- ИСПРАВЛЕНИЕ ОШИБКИ ТИПОВ ---
  const slidesForPreview = useMemo(() => {
    return formData.content_items.map(item => ({
      type: item.type,
      duration: parseFloat(item.duration) || 5,
      // Преобразуем `string | null` в `string | undefined`
      content: item.content_url ?? undefined,
      file: item.content_file,
    }));
  }, [formData.content_items]);

  return (
    <div className="form-with-preview-layout story-editor">
      {/* 1. Левая колонка с формой */}
      <div className="form-with-preview-main">
        <form onSubmit={handleSubmit} noValidate className="form-container">
          <JsonImportControl kind="stories" onApply={applyFromJson} disabled={isSubmitting}/>
          {formError && <p className="form-error">Ошибка: {formError}</p>}
          
          {/* Убираем лишний grid, чтобы колонки управлялись CSS формы */}
          {/* <div className="story-form-grid"> */}
            <section className="form-column editor-section">
              <h4>Основные настройки</h4>
              <div className="form-group">
                <label htmlFor="name">Название истории</label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={isSubmitting} />
              </div>

              <div className="form-group">
                <label htmlFor="expires_at">Дата и время истечения</label>
                <Input id="expires_at" name="expires_at" type="datetime-local" value={formData.expires_at} onChange={handleChange} disabled={isSubmitting} />
              </div>

              <div className="form-group">
                <Checkbox
                  id="is_active" name="is_active" label="История активна"
                  checked={formData.is_active}
                  onChange={handleActiveChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <ImageUpload
                  id="story_preview" name="preview_file" label="Превью истории"
                  onChange={handlePreviewFileChange}
                  previewUrl={formData.preview_local_url}
                  disabled={isSubmitting || formData.remove_preview}
                  buttonPosition="right"
                />
              </div>

              {storyToEdit?.preview && (
                <div className="form-group">
                  <Checkbox
                    id="remove_preview" name="remove_preview" label="Удалить текущее превью"
                    checked={formData.remove_preview}
                    onChange={handleRemovePreview}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </section>

            <section className="form-column editor-section">
              <h4>Слайды истории</h4>
              <div className="story-content-items-list">
                {formData.content_items.map((item, index) => (
                  <ContentItemForm
                    key={item.id} item={item} index={index} isSubmitting={isSubmitting}
                    onRemove={() => removeContentItem(item.id)}
                    onItemChange={handleContentItemChange}
                    onFileChange={handleContentItemFileChange}
                  />
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addContentItem} disabled={isSubmitting}>
                + Добавить слайд
              </Button>
            </section>
          {/* </div> */}
          
          <div className="form-actions">
            <Button type="submit" disabled={isSubmitting} variant="success">
              {isSubmitting ? 'Сохранение...' : 'Сохранить историю'}
            </Button>
            <Button type="button" onClick={onCancel} disabled={isSubmitting} variant="outline">
              Отмена
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Правая колонка с предпросмотром */}
      <aside className="form-with-preview-aside">
        <div className="preview-sticky-container">
          <StoryPreview slides={slidesForPreview} />
        </div>
      </aside>
    </div>
  );
};