import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import type { User } from '@/types/user.types';
import type { Property } from '@/types/property.types';

export interface ManagerPropertyAssignment {
  id: string;
  propertyId: string;
  managerId: string;
  isActive: boolean;
  property: Pick<Property, 'id' | 'name' | 'address'>;
}

export interface InviteManagerData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  propertyIds: string[];
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  isActive?: boolean;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  /**
   * The organization roster. Listing users is an organization-scoped
   * operation, so it goes through `/organizations/me/users` rather than
   * `/users` — there is no "list all users" endpoint by design.
   */
  getAll: async (): Promise<User[]> =>
    api.get<User[]>(`${API_ROUTES.ORGANIZATIONS.ME}/users`),

  getMe: async (): Promise<User> => api.get<User>(API_ROUTES.USERS.ME),

  getById: async (id: string): Promise<User> =>
    api.get<User>(`${API_ROUTES.USERS.BASE}/${id}`),

  update: async (id: string, data: UpdateUserPayload): Promise<User> =>
    api.patch<User>(`${API_ROUTES.USERS.BASE}/${id}`, data),

  changePassword: async (
    id: string,
    data: ChangePasswordPayload
  ): Promise<{ success: boolean; message: string }> =>
    api.patch<{ success: boolean; message: string }>(
      `${API_ROUTES.USERS.BASE}/${id}/change-password`,
      data
    ),

  deactivate: async (id: string): Promise<User> =>
    api.patch<User>(API_ROUTES.USERS.DEACTIVATE.replace(':id', id)),

  reactivate: async (id: string): Promise<User> =>
    api.patch<User>(API_ROUTES.USERS.REACTIVATE.replace(':id', id)),

  inviteManager: async (data: InviteManagerData): Promise<User & { emailSent: boolean }> =>
    api.post<User & { emailSent: boolean }>(API_ROUTES.USERS.INVITE_MANAGER, data),

  getManagerProperties: async (managerId: string): Promise<ManagerPropertyAssignment[]> =>
    api.get<ManagerPropertyAssignment[]>(
      API_ROUTES.USERS.MANAGER_PROPERTIES.replace(':id', managerId)
    ),

  assignManagerProperties: async (
    managerId: string,
    propertyIds: string[]
  ): Promise<ManagerPropertyAssignment[]> =>
    api.post<ManagerPropertyAssignment[]>(
      API_ROUTES.USERS.ASSIGN_PROPERTIES.replace(':id', managerId),
      { propertyIds }
    ),
};
