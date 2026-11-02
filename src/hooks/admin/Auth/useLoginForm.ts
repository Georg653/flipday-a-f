import { toRequestError } from '../../../utils/errors';
// src/hooks/admin/Auth/useLoginForm.ts
import { useState, useCallback } from 'react';
import type { LoginCredentials, LoginResponse } from '../../../types/admin/Auth/auth.types';
import { AuthApi } from '../../../services/admin/Auth/authApi';

interface UseLoginFormOptions {
  onSuccess: (data: LoginResponse) => void; // Колбэк при успешном логине
}

export const useLoginForm = ({ onSuccess }: UseLoginFormOptions) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!credentials.email || !credentials.password) {
      setError("Email и пароль обязательны.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await AuthApi.login(credentials);
      onSuccess(response); // Передаем токены и другую информацию в колбэк
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      const message = err.response?.data?.detail || 'Ошибка входа. Проверьте email и пароль.';
      setError(message);
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setCredentials({ email: '', password: '' });
    setError(null);
  }, []);

  return {
    credentials,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    resetForm,
  };
};