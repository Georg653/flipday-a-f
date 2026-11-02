import { PhoneStatusBar } from '../PhoneStatusBar';
// --- Путь: src/components/previews/StoryPreview/StoryPreview.tsx ---
// ПОЛНАЯ ВЕРСИЯ

import React, { useState, useEffect, useMemo } from 'react';
import { createImageUrl } from '../../../utils/media';
import './StoryPreview.css';
import type { StoryContentItem } from '../../../types/admin/Stories/story.types';

// Используем сырые данные из формы, которые могут содержать File
// --- ИСПРАВЛЕНИЕ: Разрешаем file быть null ---
type StoryContentItemForPreview = Partial<StoryContentItem> & { file?: File | null };

interface StoryPreviewProps {
  slides: StoryContentItemForPreview[];
}

export const StoryPreview: React.FC<StoryPreviewProps> = ({ slides }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const slideUrls=useMemo(()=>slides.map(slide=>slide.file?URL.createObjectURL(slide.file):createImageUrl(slide.content)),[slides]);
  useEffect(()=>()=>slideUrls.forEach(url=>{if(url?.startsWith('blob:'))URL.revokeObjectURL(url);}),[slideUrls]);

  const activeSlide = slides[activeSlideIndex];
  const slideDuration = (activeSlide?.duration || 5) * 1000; // в миллисекундах

  useEffect(() => {
    // Сбрасываем на первый слайд, если набор слайдов изменился
    setActiveSlideIndex(0);
  }, [slides]);
  
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setTimeout(() => {
        setActiveSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, slideDuration);

      return () => clearTimeout(timer);
    }
  }, [activeSlideIndex, slides, slideDuration]);

  if (!slides || slides.length === 0) {
    return (
      <div className="story-preview-container" data-phone-size="320x660"><PhoneStatusBar/>
        <div className="story-preview-placeholder">Нет слайдов для предпросмотра</div>
      </div>
    );
  }

  return (
    <div className="story-preview-container" data-phone-size="320x660"><PhoneStatusBar/>
      <div className="story-progress-bars">
        {slides.map((_, index) => (
          <div key={index} className="progress-bar-wrapper">
            <div
              className="progress-bar-fill"
              style={{ animationDuration: `${(slides[index]?.duration || 5)}s` }}
              data-active={index === activeSlideIndex}
              data-seen={index < activeSlideIndex}
            />
          </div>
        ))}
      </div>

      <div className="story-slide-content">
        {slides.map((slide, index) => {
          const url = slideUrls[index];
          if (!url) return null;
          
          const isActive = index === activeSlideIndex;
          
          return (
            <div key={index} className={`story-slide ${isActive ? 'active' : ''}`}>
              {slide.type === 'image' && <img src={url} alt={`Слайд ${index + 1}`} />}
              {slide.type === 'video' && <video src={url} autoPlay muted loop playsInline />}
            </div>
          );
        })}
      </div>
    </div>
  );
};