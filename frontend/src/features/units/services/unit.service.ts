import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import { type Unit, type CreateUnitData, type UpdateUnitData, type BulkCreateUnitData } from '../types/unit.types';

export const unitService = {
  getAll: async (propertyId?: string): Promise<Unit[]> => {
    const url = propertyId 
      ? `${API_ROUTES.UNITS.BASE}?propertyId=${propertyId}`
      : API_ROUTES.UNITS.BASE;
    const response = await api.get<Unit[]>(url);
    return response;
  },

  getById: async (id: string): Promise<Unit> => {
    const response = await api.get<Unit>(`${API_ROUTES.UNITS.BASE}/${id}`);
    return response;
  },

  create: async (data: CreateUnitData): Promise<Unit> => {
    const response = await api.post<Unit>(API_ROUTES.UNITS.BASE, data);
    return response;
  },

  bulkCreate: async (data: BulkCreateUnitData): Promise<Unit[]> => {
    const response = await api.post<Unit[]>(`${API_ROUTES.UNITS.BASE}/bulk`, data);
    return response;
  },

  update: async (id: string, data: UpdateUnitData): Promise<Unit> => {
    const response = await api.patch<Unit>(`${API_ROUTES.UNITS.BASE}/${id}`, data);
    return response;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_ROUTES.UNITS.BASE}/${id}`);
  },
};