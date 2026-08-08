import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import type {
  MaintenanceTicket,
  CreateTicketData,
  UpdateTicketData,
  TicketFilters,
  TicketStats,
  MaintenancePhoto
} from '../types/maintenance.types';

export const maintenanceService = {
  // Get all tickets
  getAll: async (params?: TicketFilters): Promise<MaintenanceTicket[]> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.unitId) queryParams.append('unitId', params.unitId);
    if (params?.assignedToId) queryParams.append('assignedToId', params.assignedToId);
    if (params?.priority) queryParams.append('priority', params.priority);
    
    const url = queryParams.toString() 
      ? `${API_ROUTES.MAINTENANCE.TICKETS}?${queryParams}`
      : API_ROUTES.MAINTENANCE.TICKETS;
    
    const response = await api.get<MaintenanceTicket[]>(url);
    return response;
  },

  // Get ticket by ID
  getById: async (id: string): Promise<MaintenanceTicket> => {
    const response = await api.get<MaintenanceTicket>(`${API_ROUTES.MAINTENANCE.TICKETS}/${id}`);
    return response;
  },

  // Get my tickets (tenant or assigned)
  getMyTickets: async (): Promise<MaintenanceTicket[]> => {
    const response = await api.get<MaintenanceTicket[]>(API_ROUTES.MAINTENANCE.MY_TICKETS);
    return response;
  },

  // Create ticket
  create: async (data: CreateTicketData): Promise<MaintenanceTicket> => {
    const response = await api.post<MaintenanceTicket>(API_ROUTES.MAINTENANCE.TICKETS, data);
    return response;
  },

  // Update ticket
  update: async (id: string, data: UpdateTicketData): Promise<MaintenanceTicket> => {
    const response = await api.patch<MaintenanceTicket>(`${API_ROUTES.MAINTENANCE.TICKETS}/${id}`, data);
    return response;
  },

  // Assign ticket
  assign: async (id: string, assignedToId: string): Promise<MaintenanceTicket> => {
    const response = await api.post<MaintenanceTicket>(
      API_ROUTES.MAINTENANCE.ASSIGN.replace(':id', id),
      { assignedToId }
    );
    return response;
  },

  // Complete ticket
  complete: async (id: string, resolutionNotes?: string): Promise<MaintenanceTicket> => {
    const response = await api.post<MaintenanceTicket>(
      API_ROUTES.MAINTENANCE.COMPLETE.replace(':id', id),
      { resolutionNotes }
    );
    return response;
  },

  // Add photo to ticket
  addPhoto: async (ticketId: string, fileUrl: string): Promise<MaintenancePhoto> => {
    const response = await api.post<MaintenancePhoto>(
      API_ROUTES.MAINTENANCE.PHOTOS.replace(':id', ticketId),
      { fileUrl }
    );
    return response;
  },

  // Get ticket stats
  getStats: async (): Promise<TicketStats> => {
    const response = await api.get<TicketStats>(API_ROUTES.MAINTENANCE.STATS);
    return response;
  },
};