// src/types/admin/Auth/auth.types.ts


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string; // e.g., "bearer"
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export type RegisterResponse = LoginResponse;


export interface RefreshTokenPayload {
  refresh_token: string;
}

export type RefreshTokenResponse = LoginResponse;


export interface ConfirmPasswordResetPayload {
  token: string;
  new_password: string;
}

export type ConfirmPasswordResetResponse = string;

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  user: { // Можно добавить информацию о пользователе, если API ее возвращает при логине или есть отдельный эндпоинт /me
    id?: number;
    email?: string;
    name?: string;
  } | null;
  error: string | null;
  isLoading: boolean;
}