export type UserRole = 'OWNER' | 'MANAGER' | 'TENANT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  organization?: {
    id: string;
    name: string;
  };
  tenantProfile?: {
    id: string;
    status: string;
    unitId: string;
  } | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  organizationName: string;
  organizationAddress?: string;
}

export interface AcceptInvitationCredentials {
  token: string;
  password: string;
}

export interface ResetPasswordCredentials {
  token: string;
  password: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}