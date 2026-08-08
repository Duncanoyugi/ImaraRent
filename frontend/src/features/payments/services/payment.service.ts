import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import type {
  Payment,
  InitiateMpesaPaymentData,
  InitiateMpesaResponse,
  ManualPaymentData,
  PaymentFilters
} from '../types/payment.types';

export const paymentService = {
  // Get all payments
  getAll: async (params?: PaymentFilters): Promise<Payment[]> => {
    const queryParams = new URLSearchParams();
    if (params?.tenantId) queryParams.append('tenantId', params.tenantId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.method) queryParams.append('method', params.method);
    
    const url = queryParams.toString() 
      ? `${API_ROUTES.PAYMENTS.BASE}?${queryParams}`
      : API_ROUTES.PAYMENTS.BASE;
    
    const response = await api.get<Payment[]>(url);
    return response;
  },

  // Get payment by ID
  getById: async (id: string): Promise<Payment> => {
    const response = await api.get<Payment>(`${API_ROUTES.PAYMENTS.BASE}/${id}`);
    return response;
  },

  // Get tenant payments
  getTenantPayments: async (tenantId: string): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(
      API_ROUTES.PAYMENTS.TENANT.replace(':tenantId', tenantId)
    );
    return response;
  },

  // Initiate M-Pesa payment
  initiateMpesa: async (data: InitiateMpesaPaymentData): Promise<InitiateMpesaResponse> => {
    const response = await api.post<InitiateMpesaResponse>(
      API_ROUTES.PAYMENTS.MPESA_INITIATE,
      data
    );
    return response;
  },

  // Query M-Pesa payment status
  queryMpesaStatus: async (checkoutRequestId: string): Promise<{
    paymentId: string;
    status: string;
      mpesaResponse?: unknown;
      error?: string;
    }> => {
    const response = await api.get<{
      paymentId: string;
      status: string;
      mpesaResponse?: unknown;
      error?: string;
    }>(
      API_ROUTES.PAYMENTS.MPESA_STATUS.replace(':checkoutRequestId', checkoutRequestId)
    );
    return response;
  },

  // Record manual payment
  recordManual: async (data: ManualPaymentData): Promise<Payment> => {
    const response = await api.post<Payment>(API_ROUTES.PAYMENTS.MANUAL, data);
    return response;
  },
};