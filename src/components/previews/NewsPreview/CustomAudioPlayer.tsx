// src/components/previews/NewsPreview/CustomAudioPlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import './CustomAudioPlayer.css';

// --- ИСПРАВЛЕННЫЕ ПУТИ ИМПОРТА ИЗОБРАЖЕНИЙ ---
import undoIconSrc from '../../../assets/icons/Undo.png';    // Было: ../../../../assets/...
import playIconSrc from '../../../assets/icons/Polygon.png'; // Стало: ../../../assets/...
import stopIconSrc from '../../../assets/icons/stop.png';
import redoIconSrc from '../../../assets/icons/Redo.png';
import settingsIconSrc from '../../../assets/icons/Setting.png';
// --- КОНЕЦ ИСПРАВЛЕННЫХ ПУТЕЙ ---

interface CustomAudioPlayerProps {
  src?: string;
  title?: string;
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({ src, title }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        if (isFinite(audio.duration)) { 
            setDuration(audio.duration);
        }
        setCurrentTime(audio.currentTime);
      };
      const setAudioTime = () => setCurrentTime(audio.currentTime);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener('loadedmetadata', setAudioData);
      audio.addEventListener('durationchange', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleEnded);

      // Перезагружаем аудио, если src изменился и он не пустой
      if (src && audio.src !== src) { // Проверяем audio.src, а не audio.currentSrc для начальной установки
        audio.src = src; // Устанавливаем новый src
        audio.load();    // Запускаем загрузку
      } else if (!src) { // Если src стал пустым, сбрасываем
        audio.removeAttribute('src');
        audio.load(); // Перезагружаем, чтобы очистить буфер
        setDuration(0);
        setCurrentTime(0);
        setIsPlaying(false);
      }
      
      return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('durationchange', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [src]); // Зависимость от src

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio && src) { // Проверяем, что есть src перед попыткой воспроизведения
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(error => {
            console.error("Error playing audio:", error);
            setIsPlaying(false); // Сбрасываем состояние, если воспроизведение не удалось
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const audio = audioRef.current;
    if (progressBar && audio && duration > 0 && isFinite(duration)) {
      const rect = progressBar.getBoundingClientRect();
      const clickPositionInPixels = e.clientX - rect.left;
      const clickPositionInPercentage = clickPositionInPixels / rect.width;
      const newTime = duration * clickPositionInPercentage;
      if (isFinite(newTime)) {
          audio.currentTime = newTime;
          setCurrentTime(newTime);
      }
    }
  };
  
  const rewind = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    }
  };

  const forward = () => {
    const audio = audioRef.current;
    if (audio && duration > 0 && isFinite(duration)) {
      audio.currentTime = Math.min(duration, audio.currentTime + 10);
    }
  };

  const progressPercentage = duration > 0 && isFinite(duration) ? (currentTime / duration) * 100 : 0;

  if (!src) {
    // Можно отобразить какой-то плейсхолдер или сообщение, если нет src,
    // вместо простого текста ошибки, чтобы сохранить разметку плеера.
    // Но для блока контента, если нет src, он не должен ломать страницу.
    return <div className="custom-audio-player-error">[Источник аудио не указан для плеера]</div>;
  }

  return (
    <div className="custom-audio-player">
      {title && <p className="custom-audio-player-title">{title}</p>}
      <audio ref={audioRef} preload="metadata" /> {/* src устанавливается в useEffect */}
      <div className="player-controls">
        <div className="player-buttons">
          <button onClick={rewind} title="Назад 10с" aria-label="Перемотать назад на 10 секунд">
            <img src={undoIconSrc} alt="Перемотать назад" className="player-icon" />
          </button>
          <button onClick={togglePlayPause} title={isPlaying ? 'Пауза' : 'Воспроизвести'} aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'} className="play-pause-button">
            <img src={isPlaying ? stopIconSrc : playIconSrc} alt={isPlaying ? 'Пауза' : 'Воспроизвести'} className="player-icon play-pause-icon" />
          </button>
          <button onClick={forward} title="Вперед 10с" aria-label="Перемотать вперед на 10 секунд">
            <img src={redoIconSrc} alt="Перемотать вперед" className="player-icon" />
          </button>
        </div>
        <div className="player-options-button">
          <button title="Настройки" aria-label="Настройки плеера">
            <img src={settingsIconSrc} alt="Настройки" className="player-icon options-icon" />
          </button>
        </div>
      </div>
      <div 
        className="progress-bar-container" 
        onClick={handleProgressClick}
        ref={progressBarRef}
        role="slider" aria-valuenow={currentTime} aria-valuemin={0} aria-valuemax={duration} tabIndex={0}
      >
        <div className="progress-bar-filled" style={{ width: `${progressPercentage}%` }} />
      </div>
      <div className="time-stamps">
        <span>{formatTime(currentTime)}</span>
        <span>{isFinite(duration) ? formatTime(duration) : '00:00'}</span>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;