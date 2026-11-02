// src/pages/admin/RouteCategoriesPage/RouteCategoriesPage.tsx
import React from 'react';
import { RouteCategoriesManagement } from '../../../components/admin/RouteCategoriesManagement/RouteCategoriesManagement';
// import styles from './RouteCategoriesPage.module.css'; // Если нужны специфичные стили

const RouteCategoriesPage: React.FC = () => {
  return (
    // <div className={styles.pageContainer}> // Если используешь CSS Modules
    <div>
      <RouteCategoriesManagement />
    </div>
  );
};

export default RouteCategoriesPage;