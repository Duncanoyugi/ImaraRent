import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import type {
  Organization,
  UpdateOrganizationData,
  OrganizationUser,
  OrganizationCounts,
} from '../types/organization.types';

export const organizationService = {
  /** The signed-in user's own organization. */
  getMine: async (): Promise<Organization> =>
    api.get<Organization>(API_ROUTES.ORGANIZATIONS.ME),

  getById: async (id: string): Promise<Organization> =>
    api.get<Organization>(`${API_ROUTES.ORGANIZATIONS.BASE}/${id}`),

  update: async (id: string, data: UpdateOrganizationData): Promise<Organization> =>
    api.patch<Organization>(`${API_ROUTES.ORGANIZATIONS.BASE}/${id}`, data),

  getUsers: async (): Promise<OrganizationUser[]> =>
    api.get<OrganizationUser[]>(`${API_ROUTES.ORGANIZATIONS.ME}/users`),

  getStats: async (id: string): Promise<OrganizationCounts> =>
    api.get<OrganizationCounts>(API_ROUTES.ORGANIZATIONS.STATS.replace(':id', id)),
};
