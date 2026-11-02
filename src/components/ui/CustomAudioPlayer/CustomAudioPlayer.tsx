// --- Путь: src/components/ui/CustomAudioPlayer/CustomAudioPlayer.tsx ---
// ПОЛНОСТЬЮ ПЕРЕПИСАННАЯ И УЛУЧШЕННАЯ ВЕРСИЯ

import React, { useState, useRef, useEffect } from 'react';
import './CustomAudioPlayer.css';

// Пути к иконкам
import undoIconSrc from '../../../assets/icons/Undo.png';
import playIconSrc from '../../../assets/icons/Polygon.png';
import stopIconSrc from '../../../assets/icons/stop.png';
import redoIconSrc from '../../../assets/icons/Redo.png';
import settingsIconSrc from '../../../assets/icons/Setting.png';

interface CustomAudioPlayerProps {
  src: string | null; // Принимаем src, может быть null
  title?: string | null; // Разрешаем title быть null
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({ src, title }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null); // Используем input[type=range] для доступности
  
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    isReady: false,
    error: '',
  });

  // --- Основной эффект для управления аудио элементом ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (isFinite(audio.duration)) {
        setPlayerState(prev => ({ ...prev, duration: audio.duration, isReady: true, error: '' }));
      }
    };
    const handleTimeUpdate = () => {
      setPlayerState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };
    const handleEnded = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
      // Возвращаем ползунок в начало, когда трек закончился
      if(progressBarRef.current) progressBarRef.current.value = "0";
    };
    const handleError = () => {
        setPlayerState(prev => ({ ...prev, isReady: false, error: 'Ошибка загрузки аудиофайла.' }));
    };
    const handlePlay = () => setPlayerState(prev => ({...prev, isPlaying: true}));
    const handlePause = () => setPlayerState(prev => ({...prev, isPlaying: false}));

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Очистка при размонтировании
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // --- Эффект для смены источника аудио (src) ---
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Сбрасываем состояние при смене src
      setPlayerState({ isPlaying: false, duration: 0, currentTime: 0, isReady: false, error: '' });
      if (progressBarRef.current) progressBarRef.current.value = "0";
      
      if (src) {
        audio.src = src;
        audio.load(); // Начинаем загрузку нового источника
      } else {
        audio.removeAttribute('src'); // Если src пустой, полностью убираем его
      }
    }
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio && playerState.isReady) {
      if (playerState.isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(e => console.error("Ошибка воспроизведения:", e));
      }
    }
  };
  
  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio && playerState.isReady) {
      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      setPlayerState(prev => ({ ...prev, currentTime: newTime }));
    }
  };
  
  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (audio && playerState.isReady) {
      audio.currentTime = Math.max(0, Math.min(playerState.duration, audio.currentTime + seconds));
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    if (!isFinite(timeInSeconds) || timeInSeconds < 0) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (playerState.error) {
    return <div className="custom-audio-player-error">{playerState.error}</div>;
  }
  
  if (!src) {
      return (
        <div className="custom-audio-player is-disabled">
          <p className="custom-audio-player-title">{title || 'Аудиоплеер'}</p>
          <div className="player-controls"><div className="player-buttons">...</div></div>
          <div className="progress-bar-container is-disabled"></div>
          <div className="time-stamps"><span>--:--</span><span>--:--</span></div>
        </div>
      );
  }

  return (
    <div className={`custom-audio-player ${!playerState.isReady ? 'is-loading' : ''}`}>
      {title && <p className="custom-audio-player-title">{title}</p>}
      <audio ref={audioRef} preload="metadata" />
      <div className="player-controls">
        <div className="player-buttons">
          <button onClick={() => seek(-10)} title="Назад 10с" disabled={!playerState.isReady}>
            <img src={undoIconSrc} alt="Назад" className="player-icon" />
          </button>
          <button onClick={togglePlayPause} title={playerState.isPlaying ? 'Пауза' : 'Воспроизвести'} disabled={!playerState.isReady} className="play-pause-button">
            <img src={playerState.isPlaying ? stopIconSrc : playIconSrc} alt={playerState.isPlaying ? 'Пауза' : 'Воспроизвести'} className="player-icon play-pause-icon" />
          </button>
          <button onClick={() => seek(10)} title="Вперед 10с" disabled={!playerState.isReady}>
            <img src={redoIconSrc} alt="Вперед" className="player-icon" />
          </button>
        </div>
        <div className="player-options-button">
          <button title="Настройки">
            <img src={settingsIconSrc} alt="Настройки" className="player-icon options-icon" />
          </button>
        </div>
      </div>
      <div className="progress-bar-container">
          <input
            type="range"
            ref={progressBarRef}
            value={playerState.currentTime}
            max={playerState.duration || 0}
            onChange={handleScrub}
            disabled={!playerState.isReady}
            className="progress-bar-slider"
          />
      </div>
      <div className="time-stamps">
        <span>{formatTime(playerState.currentTime)}</span>
        <span>{formatTime(playerState.duration)}</span>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;