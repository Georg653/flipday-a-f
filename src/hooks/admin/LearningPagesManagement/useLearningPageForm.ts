import { formFields } from '../../../features/JsonImport/schema';
import type { Data } from '../../../features/JsonImport/schema';
import { toRequestError } from '../../../utils/errors';
// --- Путь: src/hooks/admin/LearningPagesManagement/useLearningPageForm.ts ---
// ПОЛНАЯ ВЕРСИЯ

import { serializeContent } from '../../../features/ContentEditor/serializeContent';
import { useState, useEffect } from 'react';
import { LearningPagesApi } from '../../../services/admin/LearningPages/learningPagesApi';
import { LearningTopicsApi } from '../../../services/admin/LearningTopics/learningTopicsApi';
import { LearningSubtopicsApi } from '../../../services/admin/LearningSubtopics/learningSubtopicsApi';
import { createImageUrl } from '../../../utils/media';
import { usePreviewData } from '../../previews/usePreviewData';
import { createInitialBlock } from '../../../features/ContentEditor/contentEditor.helpers';
import type { ContentBlockFormData, TestBlock } from '../../../types/common/content.types';
import type { 
    LearningPage, LearningPageFormData, LearningPageCreateUpdatePayload,
    TopicOption, SubtopicOption 
} from '../../../types/admin/LearningPages/learningPage.types';

interface UseLearningPageFormOptions {
  pageToEdit: LearningPage | null;
  onSuccess: (page: LearningPage) => void;
  parentSubtopicId: number | null;
}

export const useLearningPageForm = ({ pageToEdit, onSuccess, parentSubtopicId }: UseLearningPageFormOptions) => {
  const [formData, setFormData] = useState<LearningPageFormData>({ page_number: '1', subtopic_id: '', content: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [subtopics, setSubtopics] = useState<SubtopicOption[]>([]);
  const [selectedTopicInForm, setSelectedTopicInForm] = useState<string | null>(null);
  const [isCascadeLoading, setIsCascadeLoading] = useState(false);

  const previewData = usePreviewData({
    title: `Страница №${formData.page_number || ''}`,
    content: formData.content,
  });

  useEffect(() => {
    setIsCascadeLoading(true);
    LearningTopicsApi.getTopics({ limit: 1000 })
      .then(data => setTopics(data.map(t => ({ value: String(t.id), label: t.name }))))
      .catch(() => setFormError('Ошибка загрузки тем.'))
      .finally(() => setIsCascadeLoading(false));
  }, []);

  useEffect(() => {
    if (selectedTopicInForm) {
      setIsCascadeLoading(true);
      setSubtopics([]);
      LearningSubtopicsApi.getSubtopicsByTopicId(Number(selectedTopicInForm), { limit: 1000 })
        .then(data => setSubtopics(data.map(st => ({ value: String(st.id), label: st.name }))))
        .catch(() => setFormError('Ошибка загрузки подтем.'))
        .finally(() => setIsCascadeLoading(false));
    } else {
      setSubtopics([]);
    }
  }, [selectedTopicInForm]);

  useEffect(() => {
    const setInitialState = async () => {
      if (pageToEdit && topics.length > 0) {
        setIsCascadeLoading(true);
        try {
          const parentSubtopic = await LearningSubtopicsApi.getSubtopicById(pageToEdit.subtopic_id);
          const parentTopicId = String(parentSubtopic.topic_id);
          setSelectedTopicInForm(parentTopicId);
        } catch (error) {
          console.error("Ошибка при поиске родительской темы:", error);
        } finally {
          setIsCascadeLoading(false);
        }
      }
    };
    setInitialState();
  }, [pageToEdit, topics]);

  useEffect(() => {
    if (pageToEdit) {
      const contentForForm: ContentBlockFormData[] = (pageToEdit.content || []).map(apiBlock => {
        const { type, ...restOfApiBlock } = apiBlock;
        let baseBlock: Partial<ContentBlockFormData> = { ...restOfApiBlock, options: apiBlock.type === 'test' ? apiBlock.options.map(opt => ({ ...opt, isCorrect: apiBlock.correct_option_id === opt.id })) : undefined, src: 'src' in apiBlock && typeof apiBlock.src === 'string' ? apiBlock.src : null, type, id: crypto.randomUUID(), file: null };
        if (type === 'album' || type === 'slider') {
          const { src, ...restWithoutSrc } = apiBlock;
          baseBlock = { ...restWithoutSrc, ...baseBlock };
          baseBlock.items = (src as string[] || []).map((url: string) => ({
            id: crypto.randomUUID(), url: url, file: null, preview: createImageUrl(url),
          }));
        } else if (type === 'test') {
            const testBlock = apiBlock as TestBlock;
            baseBlock.options = (testBlock.options || []).map(opt => ({
                ...opt,
                isCorrect: testBlock.correct_option_id === opt.id,
            }));
        }
        return baseBlock as ContentBlockFormData;
      });
      setFormData({
        page_number: String(pageToEdit.page_number),
        subtopic_id: String(pageToEdit.subtopic_id),
        content: contentForForm,
      });
    } else if (parentSubtopicId) {
      setFormData({ page_number: '1', subtopic_id: String(parentSubtopicId), content: [createInitialBlock('text')] });
    }
  }, [pageToEdit, parentSubtopicId]);
  
  const handleTopicInFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const topicId = e.target.value;
    setSelectedTopicInForm(topicId);
    setFormData(prev => ({ ...prev, subtopic_id: '' })); 
  };
  const handleSubtopicInFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, subtopic_id: e.target.value }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  }
  const addBlock = (type: ContentBlockFormData['type']) => setFormData(prev => ({ ...prev, content: [...prev.content, createInitialBlock(type)] }));
  const removeBlock = (id: string) => setFormData(prev => ({ ...prev, content: prev.content.filter(block => block.id !== id) }));
  const updateBlock = (id: string, newBlockData: Partial<ContentBlockFormData>) => setFormData(prev => ({ ...prev, content: prev.content.map(block => (block.id === id ? { ...block, ...newBlockData } : block)) }));
  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newContent = [...formData.content];
    const [movedItem] = newContent.splice(fromIndex, 1);
    newContent.splice(toIndex, 0, movedItem);
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  const applyFromJson = async (data: Data) => {
    if(data.subtopic_id!==undefined){
      if(pageToEdit&&data.subtopic_id!==pageToEdit.subtopic_id)throw new Error('Перенос существующей страницы в другую подтему не поддерживается API.');
      const parent=await LearningSubtopicsApi.getSubtopicById(Number(data.subtopic_id));
      setSelectedTopicInForm(String(parent.topic_id));
    }
    setFormData(previous=>({...previous,...formFields('pages',data)}));setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const pageNumber = parseInt(formData.page_number, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      setFormError('Номер страницы должен быть положительным числом.');
      setIsSubmitting(false); return;
    }
    const subtopicId = parseInt(formData.subtopic_id, 10);
    if (isNaN(subtopicId)) {
        setFormError('Необходимо выбрать подтему.');
        setIsSubmitting(false); return;
    }

    try {
      const { content, files: contentFiles } = serializeContent(formData.content);
      const payload: LearningPageCreateUpdatePayload = { page_number: pageNumber, content };
      let result: LearningPage;
      if (pageToEdit) {
        result = await LearningPagesApi.updatePage(pageToEdit.id, payload, contentFiles);
      } else {
        result = await LearningPagesApi.createPage(subtopicId, payload, contentFiles);
      }
      onSuccess(result);
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      const detail = err.response?.data?.detail;
      setFormError(typeof detail === 'object' ? JSON.stringify(detail, null, 2) : detail || err.message || 'Произошла ошибка.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { applyFromJson,
    formData, isSubmitting, formError, handleSubmit, handleChange, addBlock, removeBlock, updateBlock, moveBlock,
    topics, subtopics, selectedTopicInForm, isCascadeLoading,
    handleTopicInFormChange, handleSubtopicInFormChange,
    previewData,
  };
};