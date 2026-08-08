import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import type { User } from '@/types/user.types';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>(API_ROUTES.ORGANIZATIONS.USERS.replace(':id', ''));
    return response;
  },
};
