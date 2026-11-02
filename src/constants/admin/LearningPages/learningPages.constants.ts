// src/constants/admin/LearningPages/learningPages.constants.ts

export const ITEMS_PER_PAGE_LEARNING_PAGES = 10;

// Используем объект как enum
export const LearningPageBlockType = {
  HEADING: "heading",
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  ALBUM: "album",
  SLIDER: "slider",
  TEST: "test",
} as const; // `as const` делает значения литеральными типами и readonly

// Чтобы получить тип объединения (union type) из значений объекта:
export type LearningPageBlockTypeEnum = typeof LearningPageBlockType[keyof typeof LearningPageBlockType];


export const LEARNING_PAGE_BLOCK_TYPE_OPTIONS: { value: LearningPageBlockTypeEnum; label: string }[] = [
  { value: LearningPageBlockType.HEADING, label: "Заголовок" },
  { value: LearningPageBlockType.TEXT, label: "Текст" },
  { value: LearningPageBlockType.IMAGE, label: "Изображение" },
  { value: LearningPageBlockType.VIDEO, label: "Видео" },
  { value: LearningPageBlockType.AUDIO, label: "Аудио" },
  { value: LearningPageBlockType.ALBUM, label: "Альбом изображений" },
  { value: LearningPageBlockType.SLIDER, label: "Слайдер изображений" },
  { value: LearningPageBlockType.TEST, label: "Тест/Квиз" },
];