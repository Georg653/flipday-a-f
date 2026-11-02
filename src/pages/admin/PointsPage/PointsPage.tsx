// src/pages/admin/PointsPage/PointsPage.tsx
import React from 'react';
import { PointsManagement } from '../../../components/admin/PointsManagement/PointsManagement';
// import styles from './PointsPage.module.css'; // Если нужны специфичные стили

const PointsPage: React.FC = () => {
  return (
    // <div className={styles.pageContainer}> // Если используешь CSS Modules
    <div>
      <PointsManagement />
    </div>
  );
};

export default PointsPage;