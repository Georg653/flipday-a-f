// src/pages/admin/ProposalsPage/ProposalsPage.tsx
import React from 'react';
import { ProposalsManagement } from '../../../components/admin/ProposalsManagement/ProposalsManagement';
// import styles from './ProposalsPage.module.css'; // Если нужны специфичные стили для страницы

const ProposalsPage: React.FC = () => {
  return (
    // <div className={styles.proposalsPageContainer}> // Если используешь CSS Modules
    <div> {/* Простая обертка */}
      <ProposalsManagement />
    </div>
  );
};

export default ProposalsPage;