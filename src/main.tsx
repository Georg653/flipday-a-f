// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Или напрямую AppRoutes, если App.tsx простой
import './index.css';
import './styles/admin/theme.css';
import './components/previews/Phone.css'; // Твои глобальные стили
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> {/* App.tsx может содержать AppRoutes */}
      {/* Или если App.tsx не используется для роутинга: <AppRoutes /> */}
    </BrowserRouter>
  </React.StrictMode>
);