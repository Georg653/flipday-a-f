// src/pages/admin/NewsPage/NewsPage.tsx
import React from 'react';
import { NewsManagement } from '../../../components/admin/NewsManagement/NewsManagement';
// import styles from './NewsPage.module.css'; // Если нужны специфичные стили

const NewsPage: React.FC = () => {
  return (
    // <div className={styles.newsPageContainer}> // Если используешь CSS Modules
    <div>
      <NewsManagement />
    </div>
    // </div>
  );
};

export default NewsPage;