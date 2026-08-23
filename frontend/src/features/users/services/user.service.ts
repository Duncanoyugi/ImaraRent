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

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>(API_ROUTES.ORGANIZATIONS.ME + '/users');
    return response;
  },

  inviteManager: async (data: InviteManagerData): Promise<User & { emailSent: boolean }> => {
    return api.post<User & { emailSent: boolean }>(API_ROUTES.USERS.INVITE_MANAGER, data);
  },

  getManagerProperties: async (managerId: string): Promise<ManagerPropertyAssignment[]> => {
    return api.get<ManagerPropertyAssignment[]>(
      API_ROUTES.USERS.MANAGER_PROPERTIES.replace(':id', managerId),
    );
  },

  assignManagerProperties: async (managerId: string, propertyIds: string[]) => {
    return api.post<ManagerPropertyAssignment[]>(
      API_ROUTES.USERS.ASSIGN_PROPERTIES.replace(':id', managerId),
      { propertyIds },
    );
  },
};
