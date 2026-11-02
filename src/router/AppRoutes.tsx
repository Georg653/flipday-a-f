// src/router/AppRoutes.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import PrivateRoute from './PrivateRoute'; // Наш охранник

// --- Страницы ---
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage/RegisterPage'));
const AchievementsPage = lazy(() => import('../pages/admin/AchievementsPage/AchievementsPage'));
const NewsPage = lazy(() => import('../pages/admin/NewsPage/NewsPage'));
const StoriesPage = lazy(() => import('../pages/admin/StoriesPage/StoriesPage'));
const ProposalsPage = lazy(() => import('../pages/admin/ProposalsPage/ProposalsPage'));
const RouteCategoriesPage = lazy(() => import('../pages/admin/RouteCategoriesPage/RouteCategoriesPage'));
const PointsPage = lazy(() => import('../pages/admin/PointsPage/PointsPage'));
const RoutesPage = lazy(() => import('../pages/admin/RoutesPage/RoutesPage'));
const LearningTopicsPage = lazy(() => import('../pages/admin/LearningTopicsPage/LearningTopicsPage'));
const LearningSubtopicsPage = lazy(() => import('../pages/admin/LearningSubtopicsPage/LearningSubtopicsPage'));
const LearningPagesPage = lazy(() => import('../pages/admin/LearningPagesPage/LearningPagesPage'));

const JsonImportPage = lazy(() => import('../features/JsonImport/JsonImportPage'));

// --- Компоненты-заглушки ---
const LoadingFallback = () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Загрузка...</div>;

const NotFoundPage = () => (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
        <h1>404 - Страница не найдена</h1>
        <p>Извините, запрашиваемая страница не существует.</p>
        <Link to="/admin" style={{color: '#007bff', fontWeight: 'bold'}}>
            Вернуться в админку
        </Link>
    </div>
);


const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        
        {/* --- ПУБЛИЧНЫЕ РОУТЫ (вход без токена) --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* --- ЗАЩИЩЕННЫЕ АДМИНСКИЕ РОУТЫ --- */}
        {/* Сначала срабатывает охранник <PrivateRoute />. Если все ок, он рендерит <Outlet/>, */}
        {/* куда подставляется все, что вложено ниже. */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="proposals" replace />} /> 
            <Route path="import-json" element={<JsonImportPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="stories" element={<StoriesPage />} />
            <Route path="proposals" element={<ProposalsPage />} />
            <Route path="route-categories" element={<RouteCategoriesPage />} />
            <Route path="points" element={<PointsPage />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="topics" element={<LearningTopicsPage />} />
            <Route path="learning-subtopics" element={<LearningSubtopicsPage />} />
            <Route path="learning-pages" element={<LearningPagesPage />} />
          </Route>
        </Route>
        
        {/* --- ВСПОМОГАТЕЛЬНЫЕ РОУТЫ (Редиректы и 404) --- */}
        {/* Редирект с главной страницы на логин, если пользователь не залогинен, */}
        {/* или на админку, если он попытается зайти на / после логина (PrivateRoute его не пустит, а сюда он попадет) */}
        <Route path="/" element={<Navigate to="/login" replace />} /> 
        
        {/* Ловим все остальные пути и показываем страницу 404 */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;