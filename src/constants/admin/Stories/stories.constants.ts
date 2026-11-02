// src/constants/admin/Stories/stories.constants.ts

export const ITEMS_PER_PAGE_STORIES = 10; // Количество элементов на странице по умолчанию

// Типы для StoryContentItem (если их больше, можно расширить)
export const STORY_CONTENT_ITEM_TYPES = [
  { value: "image", label: "Изображение (URL)" },
  { value: "video", label: "Видео (URL)" },
  // { value: "text", label: "Текст" }, // Если появится такой тип
];

// Опции для фильтра активности
export const STORY_IS_ACTIVE_FILTER_OPTIONS = [
  { value: "all", label: "Все" },
  { value: "true", label: "Активные" },
  { value: "false", label: "Неактивные" },
];