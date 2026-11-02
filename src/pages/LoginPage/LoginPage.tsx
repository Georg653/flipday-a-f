// src/pages/LoginPage/LoginPage.tsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Добавлен Link
import { useLoginForm } from '../../hooks/admin/Auth/useLoginForm';
import type { LoginResponse } from '../../types/admin/Auth/auth.types';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (data: LoginResponse) => {
    localStorage.setItem('authToken', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('refreshToken', data.refresh_token);
    }
    // localStorage.setItem('tokenType', data.token_type); // Если нужно
    
    // Перенаправляем на первую страницу админки (или на ту, с которой пришли, если есть такая логика)
    navigate('/admin/achievements', { replace: true }); 
  };

  const { credentials, isLoading, error, handleChange, handleSubmit } = useLoginForm({
    onSuccess: handleLoginSuccess,
  });

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <h2 className="login-title">Вход в Админ-панель</h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email_login">Email</label>
            <Input
              type="email"
              id="email_login"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="user@example.com"
              disabled={isLoading}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password_login">Пароль</label>
            <Input
              type="password"
              id="password_login"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={isLoading} variant="success" style={{ width: '100%', marginTop: '1rem' }}>
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
        <div className="login-links" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span>Нет аккаунта? </span>
          <Link to="/register">Зарегистрироваться</Link>
          {/* Можно добавить ссылку на сброс пароля позже */}
          {/* <span style={{ margin: "0 0.5rem" }}>|</span>
          <Link to="/password-reset-request">Забыли пароль?</Link> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;