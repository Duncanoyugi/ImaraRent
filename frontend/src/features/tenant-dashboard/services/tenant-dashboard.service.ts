import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import type { TenantDashboardData, TenantMaintenanceTicket, TenantNotification } from '../types/tenant-dashboard.types';
import type { Invoice } from '@/features/billing/types/billing.types';
import type { Payment } from '@/features/payments/types/payment.types';
import type { Lease } from '@/features/leases/types/lease.types';

export const tenantDashboardService = {
  getDashboard: async (): Promise<TenantDashboardData> => {
    const response = await api.get<TenantDashboardData>(API_ROUTES.TENANT_PORTAL.DASHBOARD);
    return response;
  },

  getInvoices: async (limit?: number, offset?: number): Promise<Invoice[]> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const url = params.toString() 
      ? `${API_ROUTES.TENANT_PORTAL.INVOICES}?${params}`
      : API_ROUTES.TENANT_PORTAL.INVOICES;
    const response = await api.get<Invoice[]>(url);
    return response;
  },

  getPayments: async (limit?: number, offset?: number): Promise<Payment[]> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const url = params.toString() 
      ? `${API_ROUTES.TENANT_PORTAL.PAYMENTS}?${params}`
      : API_ROUTES.TENANT_PORTAL.PAYMENTS;
    const response = await api.get<Payment[]>(url);
    return response;
  },

  getLease: async (): Promise<Lease> => {
    const response = await api.get<Lease>(API_ROUTES.TENANT_PORTAL.LEASE);
    return response;
  },

  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await api.get<Invoice>(`${API_ROUTES.TENANT_PORTAL.INVOICES}/${id}`);
    return response;
  },

  getPayment: async (id: string): Promise<Payment> => {
    const response = await api.get<Payment>(`${API_ROUTES.TENANT_PORTAL.PAYMENTS}/${id}`);
    return response;
  },

  getBalance: async (): Promise<{
    totalBalance: number;
    totalDue: number;
    totalPaid: number;
    invoiceCount: number;
    overdueInvoices: number;
  }> => {
    const response = await api.get<{
      totalBalance: number;
      totalDue: number;
      totalPaid: number;
      invoiceCount: number;
      overdueInvoices: number;
    }>(API_ROUTES.TENANT_PORTAL.BALANCE);
    return response;
  },

  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    nationalId?: string;
  }): Promise<void> => {
    await api.patch(API_ROUTES.TENANT_PORTAL.PROFILE, data);
  },

  getMaintenanceTickets: async (limit?: number, offset?: number): Promise<TenantMaintenanceTicket[]> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const url = params.toString() 
      ? `${API_ROUTES.TENANT_PORTAL.MAINTENANCE}?${params}`
      : API_ROUTES.TENANT_PORTAL.MAINTENANCE;
    const response = await api.get<TenantMaintenanceTicket[]>(url);
    return response;
  },

  getNotifications: async (limit?: number, offset?: number): Promise<TenantNotification[]> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const url = params.toString() 
      ? `${API_ROUTES.TENANT_PORTAL.NOTIFICATIONS}?${params}`
      : API_ROUTES.TENANT_PORTAL.NOTIFICATIONS;
    const response = await api.get<TenantNotification[]>(url);
    return response;
  },

  markNotificationRead: async (notificationId: string): Promise<void> => {
    await api.post(`${API_ROUTES.TENANT_PORTAL.NOTIFICATIONS}/${notificationId}/read`);
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get<{ count: number }>(`${API_ROUTES.TENANT_PORTAL.NOTIFICATIONS}/unread-count`);
    return response;
  },
};
