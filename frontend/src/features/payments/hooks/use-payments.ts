import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { paymentService } from '../services/payment.service';
import { showToast } from '@/app/providers/toast-provider';
import type { ApiError } from '@/lib/api/api-types';
import type {
  InitiateMpesaPaymentData,
  ManualPaymentData,
  PaymentFilters
} from '../types/payment.types';

export const PAYMENTS_QUERY_KEY = ['payments'];

export const usePayments = (params?: PaymentFilters) => {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, params],
    queryFn: () => paymentService.getAll(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, id],
    queryFn: () => paymentService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTenantPayments = (tenantId: string) => {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, 'tenant', tenantId],
    queryFn: () => paymentService.getTenantPayments(tenantId),
    enabled: !!tenantId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useInitiateMpesaPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InitiateMpesaPaymentData) => paymentService.initiateMpesa(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
      showToast.success(
        'Payment Initiated',
        'Please check your phone and enter your PIN to complete the payment.'
      );
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to initiate payment';
      showToast.error('Payment Failed', message);
    },
  });
};

export const useQueryMpesaStatus = () => {
  return useMutation({
    mutationFn: (checkoutRequestId: string) => paymentService.queryMpesaStatus(checkoutRequestId),
  });
};

export const useRecordManualPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ManualPaymentData) => paymentService.recordManual(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
      showToast.success('Payment Recorded', 'Manual payment has been recorded successfully');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to record payment';
      showToast.error('Recording Failed', message);
    },
  });
};