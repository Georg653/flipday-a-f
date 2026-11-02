import React, { useRef, useState } from 'react';
import { Button } from '../Button/Button';
import { createImageUrl } from '../../../utils/media';
import './ImageUpload.css';

interface ImageUploadProps {
  id: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string | null;
  label?: string;
  disabled?: boolean;
  buttonPosition?: 'bottom' | 'right';
  mediaType?: 'image' | 'video';
}

export const ImageUpload: React.FC<ImageUploadProps> = ({id,name,onChange,previewUrl,label,disabled,buttonPosition='right',mediaType='image'}) => {
  const input=useRef<HTMLInputElement>(null);
  const [failedUrl,setFailedUrl]=useState<string|null>(null);
  const src=createImageUrl(previewUrl);
  const usable=src && src!==failedUrl;
  return <div className={`image-upload-container layout-${buttonPosition}`}>
    {label && <label htmlFor={id} className="image-upload-label">{label}</label>}
    <div className="image-upload-main-area">
      <button type="button" className="image-upload-preview-area" onClick={()=>input.current?.click()} disabled={disabled} aria-label={label ? `Выбрать файл: ${label}` : 'Выбрать файл'}>
        {usable ? mediaType==='video'
          ? <video src={src} muted preload="metadata" className="image-upload-preview" onError={()=>setFailedUrl(src)}/>
          : <img src={src} alt="Предпросмотр файла" className="image-upload-preview" onError={()=>setFailedUrl(src)}/>
          : <span className="image-upload-placeholder"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.5"/><path d="m4 18 5-6 4 4 3-4 5 6"/></svg></span>}
      </button>
      <div className="image-upload-button-wrapper">
        <input type="file" id={id} name={name} ref={input} onChange={onChange} accept={mediaType==='video'?'video/mp4':'image/jpeg,image/png,image/webp'} hidden disabled={disabled}/>
        <span className="image-upload-hint">{src && failedUrl===src?'Не удалось загрузить файл':src?'Файл выбран':'Добавьте '+(mediaType==='video'?'видео':'изображение')}</span>
        <span className="image-upload-formats">{mediaType==='video'?'MP4':'JPG, PNG или WebP'}</span>
        <Button type="button" onClick={()=>input.current?.click()} variant="outline" size="sm" disabled={disabled}>{src?'Заменить файл':'Выбрать файл'}</Button>
      </div>
    </div>
  </div>;
};
