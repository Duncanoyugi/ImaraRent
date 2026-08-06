import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import { type Tenant, type CreateTenantData, type UpdateTenantData, type AcceptInvitationData } from '../types/tenant.types';

export const tenantService = {
  getAll: async (params?: { status?: string; unitId?: string }): Promise<Tenant[]> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.unitId) queryParams.append('unitId', params.unitId);
    const url = queryParams.toString() ? `${API_ROUTES.TENANTS.BASE}?${queryParams}` : API_ROUTES.TENANTS.BASE;
    const response = await api.get<Tenant[]>(url);
    return response;
  },

  getById: async (id: string): Promise<Tenant> => {
    const response = await api.get<Tenant>(`${API_ROUTES.TENANTS.BASE}/${id}`);
    return response;
  },

  getByUnit: async (unitId: string): Promise<Tenant> => {
    const response = await api.get<Tenant>(`${API_ROUTES.TENANTS.BASE}/unit/${unitId}`);
    return response;
  },

  create: async (data: CreateTenantData): Promise<Tenant> => {
    const response = await api.post<Tenant>(API_ROUTES.TENANTS.BASE, data);
    return response;
  },

  update: async (id: string, data: UpdateTenantData): Promise<Tenant> => {
    const response = await api.patch<Tenant>(`${API_ROUTES.TENANTS.BASE}/${id}`, data);
    return response;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_ROUTES.TENANTS.BASE}/${id}`);
  },

  acceptInvitation: async (data: AcceptInvitationData): Promise<{ user: any; tenant: Tenant }> => {
    const response = await api.post<{ user: any; tenant: Tenant }>(API_ROUTES.TENANTS.ACCEPT_INVITATION, data);
    return response;
  },

  resendInvitation: async (tenantId: string): Promise<Tenant> => {
    const response = await api.post<Tenant>(`${API_ROUTES.TENANTS.BASE}/${tenantId}/resend-invitation`, {});
    return response;
  },

  cancelInvitation: async (tenantId: string, reason?: string): Promise<Tenant> => {
    const response = await api.post<Tenant>(`${API_ROUTES.TENANTS.BASE}/${tenantId}/cancel-invitation`, { reason });
    return response;
  },

  validateInvitationToken: async (token: string): Promise<{ valid: boolean; tenant?: any }> => {
    const response = await api.get<{ valid: boolean; tenant?: any }>(`/tenants/invitation/validate?token=${token}`);
    return response;
  },
};