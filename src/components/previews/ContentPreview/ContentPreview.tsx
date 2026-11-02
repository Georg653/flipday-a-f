import { PhoneStatusBar } from '../PhoneStatusBar';
// --- Путь: src/components/previews/ContentPreview/ContentPreview.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React from 'react';
import { createImageUrl } from '../../../utils/media';
import CustomAudioPlayer from '../../ui/CustomAudioPlayer/CustomAudioPlayer';
import './ContentPreview.css';
import type { ApiContentBlock, TestBlock } from '../../../types/common/content.types';

export interface ContentPreviewData {
  title?: string | null;
  description?: string | null;
  mainImage?: string | null;
  backgroundImage?: string | null;
  content: ApiContentBlock[];
}

interface ContentPreviewProps {
  data: Partial<ContentPreviewData>;
}

const renderContentBlock = (block: ApiContentBlock, index: number): React.ReactElement => {
  const key = `preview-block-${index}`;

  switch (block.type) {
    case 'heading':
      return <h2 key={key} className="preview-heading">{block.content}</h2>;
    case 'text':
      return <p key={key} className="preview-text">{block.content}</p>;
    case 'image': {
      const imgSrc = createImageUrl(block.src);
      return (
        <figure key={key} className="preview-image-block">
          {imgSrc ? <img src={imgSrc} alt="Изображение" className="preview-image"/> : <div className="preview-image-placeholder">Изображение</div>}
          {block.text && <figcaption className="preview-image-caption">{block.text}</figcaption>}
        </figure>
      );
    }
    case 'audio': {
      const audioSrc = createImageUrl(block.src);
      return <div key={key} className="preview-audio-block">{audioSrc ? <CustomAudioPlayer src={audioSrc} title={block.text} /> : null}</div>;
    }
    case 'video': {
        const videoSrc = createImageUrl(block.src);
        return <div key={key} className="preview-video-block">{videoSrc ? <video src={videoSrc} controls className="preview-video-player" /> : null}</div>;
    }
    case 'album':
    case 'slider': {
      const items = (block.src || []).map(createImageUrl);
      return (
        <div key={key} className="preview-album-block">
          <h5 className="preview-album-title">{block.type === 'album' ? 'Альбом' : 'Слайдер'}</h5>
          <div className="preview-album-images">
            {items.map((itemSrc, i) => itemSrc ? <img key={i} src={itemSrc} alt="" className="preview-album-image"/> : null)}
          </div>
        </div>
      );
    }
    case 'test': {
      const test = block as TestBlock;
      return (
        <div key={key} className="preview-test-block">
          {test.question && <p className="preview-test-question">{test.question}</p>}
          <div className="preview-test-options">
            {test.options.map((opt, i) => (
              <span key={opt.id} className={`preview-test-option ${test.correct_option_id === opt.id || (!test.correct_option_id && i === 0) ? 'simulated-correct' : ''}`}>{opt.text}</span>
            ))}
          </div>
          {test.message && <p className="preview-test-message">{test.message}</p>}
        </div>
      );
    }
    default:
      
      return <div key={key} className="preview-unknown-block">Неподдерживаемый блок</div>;
  }
};


export const ContentPreview: React.FC<ContentPreviewProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="content-preview-container preview-placeholder" data-phone-size="320x660"><PhoneStatusBar/>
        <div className="preview-header-bar">
          <span className="preview-back-button-placeholder">‹</span>
          <h1 className="preview-main-title">[Превью]</h1>
        </div>
        <div className="news-preview-screen-content">Нет данных для предпросмотра.</div>
      </div>
    );
  }
  
  const title = data.title || '[Заголовок]';
  const description = data.description || '';
  const content = data.content || [];
  
  const mainImageUrl = createImageUrl(data.mainImage);
  const backgroundImageUrl = createImageUrl(data.backgroundImage);

  const previewScreenStyle: React.CSSProperties = backgroundImageUrl ? {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImageUrl})`,
  } : {};
  
  const screenContentClasses = `news-preview-screen-content ${backgroundImageUrl ? 'has-background' : ''}`;

  return (
    <div className="content-preview-container" data-phone-size="320x660"><PhoneStatusBar/>
        <div className="preview-header-bar">
            <span className="preview-back-button-placeholder">‹</span>
            <h1 className="preview-main-title">{title}</h1>
        </div>
        <div className={screenContentClasses} style={previewScreenStyle}>
            {mainImageUrl && <img src={mainImageUrl} alt={title} className="preview-main-image" />}
            {description && <p className="preview-description">{description}</p>}
            <div className="preview-content-blocks">
                {content.length > 0 ? content.map(renderContentBlock) : <div className="preview-no-content">Контент пуст. Добавьте блоки.</div>}
            </div>
        </div>
    </div>
  );
};
