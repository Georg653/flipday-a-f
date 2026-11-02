// --- Путь: src/types/common/content.types.ts ---
// ПОЛНАЯ ВЕРСИЯ

// =============================================================================
// ТИПЫ ДЛЯ API (как они приходят с бэкенда и уходят на него)
// =============================================================================

export interface HeadingBlock { 
    type: 'heading'; 
    level: 1 | 2 | 3 | 4; 
    content: string; 
}

export interface TextBlock { 
    type: 'text'; 
    content: string; 
}

export interface ImageBlock { 
    type: 'image'; 
    src: string | null;
    text?: string | null;
}

export interface VideoBlock { 
    type: 'video'; 
    src: string | null;
    text?: string | null;
}

export interface AudioBlock { 
    type: 'audio'; 
    src: string | null;
    text?: string | null;
}

export interface AlbumBlock { 
    type: 'album'; 
    src: string[];
}

export interface SliderBlock { 
    type: 'slider'; 
    src: string[];
}

export interface TestOption { 
    id: string; 
    text: string; 
}

export interface TestBlock {
    type: 'test';
    question: string;
    options: TestOption[];
    message: string;
    correct_option_id?: string;
}

export type ApiContentBlock = HeadingBlock | TextBlock | ImageBlock | VideoBlock | AudioBlock | AlbumBlock | SliderBlock | TestBlock;


// =============================================================================
// ТИПЫ ДЛЯ ФОРМЫ (как данные живут на фронте)
// =============================================================================

export type CollectionItemFormData = { 
    id: string; 
    url: string | null; 
    file: File | null; 
    preview: string | null; 
};

export type TestOptionFormData = { 
    id: string; 
    text: string; 
    isCorrect: boolean; 
};

export type ContentBlockFormData = {
  id: string;
  type: ApiContentBlock['type'];
  
  // Поля для разных типов блоков
  level?: 1 | 2 | 3 | 4;
  content?: string;
  question?: string;
  options?: TestOptionFormData[];
  message?: string;
  
  // Поля для медиа
  src?: string | null;
  items?: CollectionItemFormData[];
  file?: File | null;
  text?: string | null; // <--- ДОБАВЛЕНО НЕДОСТАЮЩЕЕ ПОЛЕ
};