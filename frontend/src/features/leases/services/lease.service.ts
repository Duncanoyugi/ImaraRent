import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import { type Lease, type CreateLeaseData, type UpdateLeaseData } from '../types/lease.types';

export const leaseService = {
  getAll: async (params?: { status?: string; unitId?: string }): Promise<Lease[]> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.unitId) queryParams.append('unitId', params.unitId);
    const url = queryParams.toString() ? `${API_ROUTES.LEASES.BASE}?${queryParams}` : API_ROUTES.LEASES.BASE;
    const response = await api.get<Lease[]>(url);
    return response;
  },

  getById: async (id: string): Promise<Lease> => {
    const response = await api.get<Lease>(`${API_ROUTES.LEASES.BASE}/${id}`);
    return response;
  },

  create: async (data: CreateLeaseData): Promise<Lease> => {
    const response = await api.post<Lease>(API_ROUTES.LEASES.BASE, data);
    return response;
  },

  update: async (id: string, data: UpdateLeaseData): Promise<Lease> => {
    const response = await api.patch<Lease>(`${API_ROUTES.LEASES.BASE}/${id}`, data);
    return response;
  },

  activate: async (id: string): Promise<Lease> => {
    const response = await api.post<Lease>(`${API_ROUTES.LEASES.BASE}/${id}/activate`, {});
    return response;
  },

  terminate: async (id: string, reason?: string): Promise<Lease> => {
    const response = await api.post<Lease>(`${API_ROUTES.LEASES.BASE}/${id}/terminate`, { reason });
    return response;
  },
};