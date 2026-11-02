import { formFields, externalMedia } from '../../../features/JsonImport/schema';
import type { Data } from '../../../features/JsonImport/schema';
import { toRequestError } from '../../../utils/errors';
// --- Путь: src/hooks/admin/Points/usePointForm.ts ---
// ПОЛНАЯ ВЕРСИЯ

import { serializeContent } from '../../../features/ContentEditor/serializeContent';
import { useState, useEffect } from 'react';
import { PointsApi } from '../../../services/admin/Points/pointsApi';
import { usePreviewData } from '../../previews/usePreviewData';
import { createImageUrl } from '../../../utils/media';
import { createInitialBlock } from '../../../features/ContentEditor/contentEditor.helpers';
import type { ContentBlockFormData, TestBlock } from '../../../types/common/content.types';
import type { Point, PointBase, PointFormData, PointCreateUpdatePayload } from '../../../types/admin/Points/point.types';

interface UsePointFormOptions {
  pointToEdit: Point | null;
  onSuccess: (point: PointBase) => void;
}

const initialPointFormData: PointFormData = {
  name: '', description: '', latitude: '', longitude: '',
  is_partner: false, budget: '0', image_url: null, image_file: null,
  remove_image: false, manageContent: false, content: [],
};

export const usePointForm = ({ pointToEdit, onSuccess }: UsePointFormOptions) => {
  const [formData, setFormData] = useState<PointFormData>(initialPointFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const previewData = usePreviewData({
    title: formData.name,
    description: formData.description,
    preview_file: formData.image_file,
    preview_url: formData.image_url,
    content: formData.content,
  });

  useEffect(() => {
    if (pointToEdit) {
      const hasContent = !!(pointToEdit.content && pointToEdit.content.length > 0);
      const contentForForm = (pointToEdit.content || []).map(apiBlock => {
        const baseBlock: Partial<ContentBlockFormData> = { ...apiBlock, options: apiBlock.type === 'test' ? apiBlock.options.map(opt => ({ ...opt, isCorrect: apiBlock.correct_option_id === opt.id })) : undefined, src: typeof ('src' in apiBlock ? ('src' in apiBlock ? apiBlock.src as string : null) : null) === 'string' ? ('src' in apiBlock ? apiBlock.src as string : null) : null, id: crypto.randomUUID(), file: null };
        if (apiBlock.type === 'album' || apiBlock.type === 'slider') {
          baseBlock.items = (apiBlock.src as string[] || []).map((url: string) => ({
            id: crypto.randomUUID(), url: url, file: null, preview: createImageUrl(url),
          }));
          delete baseBlock.src;
        } else if (apiBlock.type === 'test') {
            const testBlock = apiBlock as TestBlock;
            baseBlock.options = (testBlock.options || []).map(opt => ({
                ...opt,
                isCorrect: testBlock.correct_option_id === opt.id,
            }));
        }
        return baseBlock as ContentBlockFormData;
      });

      setFormData({
        name: pointToEdit.name,
        description: pointToEdit.description,
        latitude: String(pointToEdit.latitude),
        longitude: String(pointToEdit.longitude),
        is_partner: pointToEdit.is_partner,
        budget: String(pointToEdit.budget),
        image_url: pointToEdit.image,
        image_file: null,
        remove_image: false,
        manageContent: hasContent,
        content: hasContent ? contentForForm : [createInitialBlock('text')],
      });
    } else {
      setFormData(initialPointFormData);
    }
  }, [pointToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string | boolean; type?: string } }) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const finalValue = isCheckbox ? ((e as React.ChangeEvent<HTMLInputElement>).nativeEvent ? (e.target as HTMLInputElement).checked : value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };
  
  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, image_file: file, remove_image: file ? false : prev.remove_image }));
  };
  const handleRemoveImage = (checked: boolean) => {
    setFormData(prev => ({ ...prev, remove_image: checked, image_file: checked ? null : prev.image_file }));
  };
  
  const addBlock = (type: ContentBlockFormData['type']) => setFormData(prev => ({ ...prev, content: [...prev.content, createInitialBlock(type)] }));
  const removeBlock = (id: string) => setFormData(prev => ({ ...prev, content: prev.content.filter(b => b.id !== id) }));
  const updateBlock = (id: string, data: Partial<ContentBlockFormData>) => setFormData(prev => ({ ...prev, content: prev.content.map(b => b.id === id ? { ...b, ...data } : b) }));
  const moveBlock = (from: number, to: number) => {
      const newContent = [...formData.content];
      const [moved] = newContent.splice(from, 1);
      newContent.splice(to, 0, moved);
      setFormData(prev => ({...prev, content: newContent}));
  };

  const applyFromJson = (data: Data) => { setFormData(previous => ({ ...previous, ...formFields('points', data) })); setFormError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const latitude = Number(formData.latitude), longitude = Number(formData.longitude), budget = Number(formData.budget);
      if (!formData.name.trim() || !formData.description.trim()) throw new Error('Заполните название и описание.');
      if (!formData.latitude.trim() || !formData.longitude.trim() || !Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) throw new Error('Укажите корректные координаты.');
      if (!Number.isFinite(budget) || budget < 0) throw new Error('Укажите корректный бюджет.');
      const { content, files } = serializeContent(formData.manageContent ? formData.content : []);
      const payload: PointCreateUpdatePayload = {
        name: formData.name.trim(), description: formData.description.trim(), latitude, longitude,
        is_partner: formData.is_partner, budget, content_data: { content }, image_url: formData.image_file || formData.remove_image ? undefined : externalMedia(formData.image_url),
      };
      const result = pointToEdit
        ? await PointsApi.updatePoint(pointToEdit.id, payload, formData.image_file, files, formData.remove_image)
        : await PointsApi.createPoint(payload, formData.image_file, files);
      onSuccess(result);
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      const detail = err.response?.data?.detail;
      setFormError(typeof detail === 'object' ? JSON.stringify(detail) : detail || err.message || 'Ошибка сохранения точки');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { applyFromJson, 
      formData, isSubmitting, formError, handleChange, handleFileChange, handleRemoveImage, 
      addBlock, removeBlock, updateBlock, moveBlock, handleSubmit,
      previewData
  };
};