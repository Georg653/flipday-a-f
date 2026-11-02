// src/services/admin/Auth/authApi.ts
import axiosInstance from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import type {
  LoginCredentials,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  ConfirmPasswordResetPayload,
  ConfirmPasswordResetResponse,
} from '../../../types/admin/Auth/auth.types';

export const AuthApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // API ожидает application/json
    return (await axiosInstance.post<LoginResponse>(ENDPOINTS.LOGIN, credentials)).data;
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    return (await axiosInstance.post<RegisterResponse>(ENDPOINTS.REGISTER, payload)).data;
  },

  refreshToken: async (payload: RefreshTokenPayload): Promise<RefreshTokenResponse> => {
    return (await axiosInstance.post<RefreshTokenResponse>(ENDPOINTS.TOKEN_REFRESH, payload)).data;
  },

  confirmPasswordReset: async (payload: ConfirmPasswordResetPayload): Promise<ConfirmPasswordResetResponse> => {
    return (await axiosInstance.post<ConfirmPasswordResetResponse>(ENDPOINTS.PASSWORD_RESET_CONFIRM, payload)).data;
  },
};