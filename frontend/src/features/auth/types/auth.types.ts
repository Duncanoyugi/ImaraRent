import { type User, type AuthTokens, type AuthResponse } from '@/types/user.types';
export type { User, AuthTokens, AuthResponse };

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  organizationName: string;
  organizationAddress?: string;
}

export interface AcceptInvitationPayload {
  token: string;
  password: string;
}

export type { LoginCredentials, RegisterCredentials, AcceptInvitationCredentials, ForgotPasswordCredentials, ResetPasswordCredentials } from '@/types/user.types';