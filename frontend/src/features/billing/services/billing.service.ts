import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import type { Invoice, CreateInvoiceData, GenerateInvoicesData } from '../types/billing.types';

export const billingService = {
  // Get all invoices
  getAll: async (params?: { status?: string; tenantId?: string }): Promise<Invoice[]> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.tenantId) queryParams.append('tenantId', params.tenantId);
    
    const url = queryParams.toString() 
      ? `${API_ROUTES.BILLING.INVOICES}?${queryParams}`
      : API_ROUTES.BILLING.INVOICES;
    
    const response: Invoice[] = await api.get<Invoice[]>(url);
    return response;
  },

  // Get invoice by ID
  getById: async (id: string): Promise<Invoice> => {
    const response: Invoice = await api.get<Invoice>(`${API_ROUTES.BILLING.INVOICES}/${id}`);
    return response;
  },

  // Get tenant invoices
  getTenantInvoices: async (tenantId: string): Promise<Invoice[]> => {
    const response: Invoice[] = await api.get<Invoice[]>(
      API_ROUTES.BILLING.TENANT_INVOICES.replace(':tenantId', tenantId)
    );
    return response;
  },

  // Get tenant balance
  getTenantBalance: async (tenantId: string): Promise<{
    tenantId: string;
    totalBalance: number;
    totalDue: number;
    totalPaid: number;
    invoiceCount: number;
    overdueInvoices: number;
  }> => {
    const response = await api.get<{
      tenantId: string;
      totalBalance: number;
      totalDue: number;
      totalPaid: number;
      invoiceCount: number;
      overdueInvoices: number;
    }>(
      API_ROUTES.BILLING.TENANT_BALANCE.replace(':tenantId', tenantId)
    );
    return response;
  },

  // Create manual invoice
  create: async (data: CreateInvoiceData): Promise<Invoice> => {
    const response: Invoice = await api.post<Invoice>(`${API_ROUTES.BILLING.INVOICES}/manual`, data);
    return response;
  },

  // Generate invoices
  generate: async (data: GenerateInvoicesData): Promise<{ message: string; generated: number; invoices: Invoice[] }> => {
    const response = await api.post<{ message: string; generated: number; invoices: Invoice[] }>(API_ROUTES.BILLING.GENERATE, data);
    return response;
  },

  // Void invoice
  void: async (id: string, reason?: string): Promise<Invoice> => {
    const response: Invoice = await api.post<Invoice>(
      API_ROUTES.BILLING.VOID.replace(':id', id),
      { reason }
    );
    return response;
  },
};