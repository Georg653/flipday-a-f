// --- Путь: src/services/admin/api/endpoints.ts ---

export const ENDPOINTS = {
  // AUTHENTICATION
  LOGIN: ``, // Логин на baseURL /v1/admin/
  REGISTER: `register/`,
  PASSWORD_RESET_CONFIRM: 'password-reset/confirm/',
  TOKEN_REFRESH: `token/refresh/`,
  
  // --- ОБЩИЕ РЕСУРСЫ (здесь везде нужен слеш на конце) ---

  // ACHIEVEMENTS
  ACHIEVEMENTS: `achievements/`,
  ACHIEVEMENT_DETAIL: (id: number) => `achievements/${id}`,

  // NEWS
  NEWS_LIST: `news/`,
  NEWS_DETAIL: (id: number) => `news/${id}`,

  // STORIES
  STORIES: `stories/`,
  STORY_DETAIL: (id: number) => `stories/${id}`,

  // ROUTE CATEGORIES
  ROUTE_CATEGORIES: `route-categories/`,
  ROUTE_CATEGORY_DETAIL: (id: number) => `route-categories/${id}`,

  // --- ИЗМЕНЕННАЯ СЕКЦИЯ ---
  // POINTS
  POINTS: `points/`,
  POINT_DETAIL: (id: number) => `points/${id}`,
POINT_CONTENT: (id: number) => `points/${id}/content`,

  // ROUTES
  ROUTES: `routes/`,
  ROUTE_DETAIL: (id: number) => `routes/${id}`,
  
  // PROPOSALS
  PROPOSALS: `proposals/`,
  PROPOSAL_DETAIL: (id: string) => `proposals/${id}`,
  
  // --- ВЛОЖЕННЫЕ РЕСУРСЫ ---

  // LEARNING TOPICS
  LEARNING_TOPICS_LIST: `topics/`,
  LEARNING_TOPIC_DETAIL: (id: number) => `topics/${id}`,

  // LEARNING SUBTOPICS
  LEARNING_SUBTOPICS_BY_TOPIC: (topicId: number) => `subtopics/topics/${topicId}/subtopics/`,
  LEARNING_SUBTOPIC_DETAIL: (subtopicId: number) => `subtopics/subtopics/${subtopicId}`,

  // LEARNING PAGES
  LEARNING_PAGES_BY_SUBTOPIC: (subtopicId: number) => `learning-pages/subtopics/${subtopicId}/pages/`,
  LEARNING_PAGE_DETAIL: (pageId: number) => `learning-pages/pages/${pageId}`,
};
