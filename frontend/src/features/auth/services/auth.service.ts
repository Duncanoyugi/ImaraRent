import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import {
  type User,
  type AuthResponse,
  type LoginCredentials,
  type RegisterCredentials,
  type AcceptInvitationCredentials,
  type ForgotPasswordCredentials,
  type ResetPasswordCredentials,
} from '../types/auth.types';

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_ROUTES.AUTH.LOGIN,
      credentials
    );
    return response;
  },

  // Register new owner
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_ROUTES.AUTH.REGISTER,
      credentials
    );
    return response;
  },

  // Refresh tokens
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_ROUTES.AUTH.REFRESH,
      { refreshToken }
    );
    return response;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>(API_ROUTES.AUTH.ME);
    return response;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post(API_ROUTES.AUTH.LOGOUT);
    } catch {
      // Ignore errors on logout
    }
  },

  // Accept invitation
  acceptInvitation: async (
    credentials: AcceptInvitationCredentials
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_ROUTES.TENANTS.ACCEPT_INVITATION,
      credentials
    );
    return response;
  },

  // Forgot password
  forgotPassword: async (credentials: ForgotPasswordCredentials): Promise<void> => {
    await api.post('/auth/forgot-password', credentials);
  },

  // Reset password
  resetPassword: async (credentials: ResetPasswordCredentials): Promise<void> => {
    await api.post('/auth/reset-password', credentials);
  },

  // Validate invitation token
  validateInvitationToken: async (token: string): Promise<{ valid: boolean; tenant?: any }> => {
    const response = await api.get<{ valid: boolean; tenant?: any }>(
      `/tenants/invitation/validate?token=${token}`
    );
    return response;
  },
};