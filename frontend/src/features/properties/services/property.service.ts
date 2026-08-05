import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import { type Property, type CreatePropertyData, type UpdatePropertyData } from '../types/property.types';

export const propertyService = {
  getAll: async (): Promise<Property[]> => {
    const response = await api.get<Property[]>(API_ROUTES.PROPERTIES.BASE);
    return response;
  },

  getById: async (id: string): Promise<Property> => {
    const response = await api.get<Property>(`${API_ROUTES.PROPERTIES.BASE}/${id}`);
    return response;
  },

  create: async (data: CreatePropertyData): Promise<Property> => {
    const response = await api.post<Property>(API_ROUTES.PROPERTIES.BASE, data);
    return response;
  },

  update: async (id: string, data: UpdatePropertyData): Promise<Property> => {
    const response = await api.patch<Property>(`${API_ROUTES.PROPERTIES.BASE}/${id}`, data);
    return response;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_ROUTES.PROPERTIES.BASE}/${id}`);
  },

  getStats: async (): Promise<{
    totalProperties: number;
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    maintenanceUnits: number;
    reservedUnits: number;
    occupancyRate: number;
  }> => {
    const response = await api.get<{
      totalProperties: number;
      totalUnits: number;
      occupiedUnits: number;
      vacantUnits: number;
      maintenanceUnits: number;
      reservedUnits: number;
      occupancyRate: number;
    }>(`${API_ROUTES.PROPERTIES.BASE}/stats`);
    return response;
  },
};