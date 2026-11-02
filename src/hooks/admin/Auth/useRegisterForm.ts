import { toRequestError } from '../../../utils/errors';
// src/hooks/admin/Auth/useRegisterForm.ts
import { useState, useCallback } from 'react';
import type { RegisterPayload } from '../../../types/admin/Auth/auth.types';
import { AuthApi } from '../../../services/admin/Auth/authApi';

interface UseRegisterFormOptions {
  onSuccess: (message: string) => void; // Колбэк при успешной регистрации
}

export const useRegisterForm = ({ onSuccess }: UseRegisterFormOptions) => {
  const [formData, setFormData] = useState<RegisterPayload>({ email: '', password: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!formData.email || !formData.password || !formData.name) {
      setError("Email, пароль и имя обязательны.");
      setIsLoading(false);
      return;
    }
    // Дополнительная валидация (например, длина пароля) может быть здесь

    try {
      await AuthApi.register(formData);
      const responseMessage = 'Регистрация прошла успешно. Доступ администратора назначается отдельно.';
      setSuccessMessage(responseMessage || "Регистрация прошла успешно!"); // Устанавливаем сообщение об успехе
      onSuccess(responseMessage); // Вызываем колбэк
      // resetForm(); // Можно сбросить форму здесь
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      const message = err.response?.data?.detail || 'Ошибка регистрации.';
      setError(message);
      console.error("Registration failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setFormData({ email: '', password: '', name: '' });
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    formData,
    isLoading,
    error,
    successMessage,
    handleChange,
    handleSubmit,
    resetForm,
  };
};