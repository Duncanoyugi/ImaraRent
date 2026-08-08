import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService } from '../services/billing.service';
import { showToast } from '@/app/providers/toast-provider';
import type { CreateInvoiceData, GenerateInvoicesData } from '../types/billing.types';

export const INVOICES_QUERY_KEY = ['invoices'];

export const useInvoices = (params?: { status?: string; tenantId?: string }) => {
  return useQuery({
    queryKey: [...INVOICES_QUERY_KEY, params],
    queryFn: () => billingService.getAll(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: [...INVOICES_QUERY_KEY, id],
    queryFn: () => billingService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTenantInvoices = (tenantId: string) => {
  return useQuery({
    queryKey: [...INVOICES_QUERY_KEY, 'tenant', tenantId],
    queryFn: () => billingService.getTenantInvoices(tenantId),
    enabled: !!tenantId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTenantBalance = (tenantId: string) => {
  return useQuery({
    queryKey: ['tenant-balance', tenantId],
    queryFn: () => billingService.getTenantBalance(tenantId),
    enabled: !!tenantId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceData) => billingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      showToast.success('Invoice created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create invoice';
      showToast.error('Creation Failed', message);
    },
  });
};

export const useGenerateInvoices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateInvoicesData) => billingService.generate(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      showToast.success(
        `Invoices Generated`,
        `${result.generated} invoices created successfully`
      );
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to generate invoices';
      showToast.error('Generation Failed', message);
    },
  });
};

export const useVoidInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      billingService.void(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...INVOICES_QUERY_KEY, id] });
      showToast.success('Invoice voided successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to void invoice';
      showToast.error('Void Failed', message);
    },
  });
};