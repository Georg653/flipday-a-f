// src/pages/RegisterPage/RegisterPage.tsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterForm } from '../../hooks/admin/Auth/useRegisterForm';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import './RegisterPage.css'; // Убедись, что этот файл существует в той же папке

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = (message: string) => {
    console.log('Registration successful:', message);
    // Перенаправляем на страницу логина после небольшой задержки,
    // чтобы пользователь успел увидеть сообщение об успехе.
    // Хук useRegisterForm уже устанавливает successMessage.
    setTimeout(() => {
      navigate('/login');
    }, 3000); // 3 секунды для примера
  };

  const { formData, isLoading, error, successMessage, handleChange, handleSubmit } = useRegisterForm({
    onSuccess: handleRegisterSuccess,
  });

  return (
    <div className="register-page-container">
      <div className="register-form-wrapper">
        <h2 className="register-title">Регистрация</h2>
        
        {error && <p className="register-error">{error}</p>}
        {successMessage && (
          <p className="register-success">
            {successMessage} <br />
            Перенаправление на страницу входа через несколько секунд... 
            Или <Link to="/login">войдите сейчас</Link>.
          </p>
        )}
        
        {!successMessage && ( // Показываем форму, только если нет сообщения об успехе
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name_register">Имя</label>
              <Input
                type="text"
                id="name_register"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ваше имя"
                disabled={isLoading}
                required
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email_register">Email</label>
              <Input
                type="email"
                id="email_register"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                disabled={isLoading}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password_register">Пароль</label>
              <Input
                type="password"
                id="password_register"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                required
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" disabled={isLoading} variant="success" style={{ width: '100%', marginTop: '1rem' }}>
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>
        )}

        {!successMessage && ( // Показываем ссылку на логин, только если форма активна
             <div className="register-links" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                <span>Уже есть аккаунт? </span>
                <Link to="/login">Войти</Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;