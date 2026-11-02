import { JsonImportControl } from '../../../features/JsonImport/JsonImportControl';
// src/components/admin/AchievementsManagement/AchievementForm.tsx
import React from 'react';
import { useAchievementForm } from '../../../hooks/admin/AchievementsManagement/useAchievementForm';
import type { Achievement } from '../../../types/admin/Achievements/achievement.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
import { ImageUpload } from '../../ui/ImageUpload/ImageUpload';
import { Select } from '../../ui/Select/Select';
import type { SelectOption } from '../../ui/Select/Select'; // Предполагаем, что у Select есть тип SelectOption
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { ACHIEVEMENT_TYPE_OPTIONS } from '../../../constants/admin/Achievements/achievements.constants';
import '../../../styles/admin/ui/Form.css';

interface AchievementFormProps {
  onSuccess: (data: Achievement) => void;
  achievementToEdit: Achievement | null;
  setShowForm: (show: boolean) => void;
}

export const AchievementForm: React.FC<AchievementFormProps> = ({
  onSuccess,
  achievementToEdit,
  setShowForm,
}) => {
  const {
    formData, applyFromJson,
    handleChange,
    handleFileChange,
    handleRemoveImage,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
  } = useAchievementForm({ onSuccess, achievementToEdit });

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="form-container">
      <h3 className="form-title">{achievementToEdit ? 'Редактировать достижение' : 'Создать новое'}</h3>
      {formError && <p className="form-error">Ошибка: {formError}</p>}
      
      <form onSubmit={handleSubmit} noValidate>
          <JsonImportControl kind="achievements" onApply={applyFromJson} disabled={isSubmitting}/>
        <div className="form-inputs">

          <div className="form-group">
            <label htmlFor="name">Название*</label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} disabled={isSubmitting} />
          </div>

          <div className="form-group">
            <Select
              label="Тип достижения*"
              id="achievement_type"
              name="achievement_type"
              value={formData.achievement_type}
              onChange={handleChange}
              options={ACHIEVEMENT_TYPE_OPTIONS as SelectOption[]}
              placeholder="Выберите тип"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="criteria_value">Значение критерия*</label>
            <Input id="criteria_value" name="criteria_value" type="number" value={formData.criteria_value} onChange={handleChange} required disabled={isSubmitting} step="any"/>
          </div>

          <div className="form-group">
            <label htmlFor="criteria_unit">Единица измерения*</label>
            <Input id="criteria_unit" name="criteria_unit" value={formData.criteria_unit} onChange={handleChange} required disabled={isSubmitting} />
          </div>

          <div className="form-group">
            <ImageUpload
              id="image_file_achievement"
              name="image_file"
              onChange={handleFileChange}
              previewUrl={formData.image_preview_url}
              label="Изображение"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Чекбокс появляется только при редактировании, если есть старая картинка и не выбран новый файл */}
          {achievementToEdit?.image && !formData.image_file && (
            <div className="form-group">
                 <Checkbox
                    id="remove_image"
                    name="remove_image"
                    label="Удалить текущее изображение"
                    checked={formData.remove_image}
                    onChange={handleRemoveImage}
                    disabled={isSubmitting}
                 />
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting} variant="success">
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </Button>
          <Button type="button" onClick={handleCancel} disabled={isSubmitting} variant="outline">
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
};