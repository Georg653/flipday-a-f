import type { ApiContentBlock, ContentBlockFormData } from '../../types/common/content.types';

export function serializeContent(blocks: ContentBlockFormData[]) {
  const files: File[] = [];
  const content: ApiContentBlock[] = blocks.map(block => {
    switch (block.type) {
      case 'text': return { type: block.type, content: block.content || '' };
      case 'heading': return { type: block.type, content: block.content || '', level: block.level || 2 };
      case 'image': case 'video': case 'audio':
        if (block.file) files.push(block.file);
        if (!block.file && !block.src) throw new Error('Выберите файл для медиа-блока.');
        return { type: block.type, src: block.file ? '' : block.src!, text: block.text };
      case 'album': case 'slider':
        return { type: block.type, src: (block.items || []).map(item => {
          if (item.file) { files.push(item.file); return ''; }
          if (!item.url) throw new Error('Выберите файл для элемента альбома.');
          return item.url;
        }) };
      case 'test': {
        const options = block.options || [];
        const correct = options.find(option => option.isCorrect);
        if (!block.question?.trim() || options.length < 2 || !correct || options.some(option => !option.text.trim())) {
          throw new Error('Укажите вопрос, минимум два ответа и правильный ответ.');
        }
        return { type: block.type, question: block.question, options: options.map(({id, text}) => ({id, text})), message: block.message || '', correct_option_id: correct.id };
      }
    }
  });
  return { content, files };
}
