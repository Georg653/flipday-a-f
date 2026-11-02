// src/pages/admin/AchievementsPage/AchievementsPage.tsx
import React from 'react';
import { AchievementsManagement } from '../../../components/admin/AchievementsManagement/AchievementsManagement';
// import styles from './AchievementsPage.module.css'; // Если будут специфичные стили для страницы

const AchievementsPage: React.FC = () => {
  return (
    // <div className={styles.achievementsPageContainer}> // Если используешь CSS Modules
    <div>
      <AchievementsManagement />
    </div>
  );
};

export default AchievementsPage; // Используем export default для страниц, как это часто делают