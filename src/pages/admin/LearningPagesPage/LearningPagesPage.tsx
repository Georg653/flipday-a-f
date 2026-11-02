// src/pages/admin/LearningPagesPage/LearningPagesPage.tsx
import React from 'react';
import { LearningPagesManagement } from '../../../components/admin/LearningPagesManagement/LearningPagesManagement';
// import styles from './LearningPagesPage.module.css'; // Если нужны специфичные стили для этой страницы

const LearningPagesPage: React.FC = () => {
  return (
    // <div className={styles.learningPagesContainer}> // Если используешь CSS Modules
    <div>
      <LearningPagesManagement />
    </div>
  );
};

export default LearningPagesPage;