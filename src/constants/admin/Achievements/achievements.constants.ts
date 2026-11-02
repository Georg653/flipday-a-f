// src/constants/admin/Achievements/achievements.constants.ts

export const ITEMS_PER_PAGE_ACHIEVEMENTS = 10;

// Опции для типа достижения
export const ACHIEVEMENT_TYPE_OPTIONS = [
  { value: "distance", label: "Пройденное расстояние" },
  { value: "points_visited", label: "Посещено точек (общее кол-во)" }, // Предполагаю, что это значит общее кол-во разных точек
  { value: "routes_completed", label: "Пройдено маршрутов" },
  { value: "topic_learned", label: "Изучена тема" }, // Возможно, для этого нужен будет выбор конкретной темы
  { value: "total_topics_learned", label: "Всего изучено тем" },
  { value: "total_subtopics_learned", label: "Всего изучено подтем" },
  { value: "point_visited", label: "Посещена конкретная точка" }, // Возможно, для этого нужен будет выбор конкретной точки
  { value: "route_visited", label: "Посещен конкретный маршрут" }, // Возможно, для этого нужен будет выбор конкретного маршрута
];

// Ты также упоминал criteria_unit. Если для него тоже нужен селект, добавь опции.
// Например:
// export const CRITERIA_UNIT_OPTIONS = [
//   { value: "km", label: "км" },
//   { value: "points", label: "точек" },
//   { value: "routes", label: "маршрутов" },
//   { value: "topics", label: "тем" },
//   // ... и т.д. в зависимости от achievement_type
// ];