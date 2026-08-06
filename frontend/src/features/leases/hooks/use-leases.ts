import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaseService } from '../services/lease.service';
import { showToast } from '@/app/providers/toast-provider';
import { type CreateLeaseData, type UpdateLeaseData } from '../types/lease.types';

export const LEASES_QUERY_KEY = ['leases'];

export const useLeases = (params?: { status?: string; unitId?: string }) => {
  return useQuery({
    queryKey: [...LEASES_QUERY_KEY, params],
    queryFn: () => leaseService.getAll(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useLease = (id: string) => {
  return useQuery({
    queryKey: [...LEASES_QUERY_KEY, id],
    queryFn: () => leaseService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeaseData) => leaseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEASES_QUERY_KEY });
      showToast.success('Lease created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create lease';
      showToast.error('Creation Failed', message);
    },
  });
};

export const useUpdateLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeaseData }) =>
      leaseService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: LEASES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...LEASES_QUERY_KEY, variables.id] });
      showToast.success('Lease updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update lease';
      showToast.error('Update Failed', message);
    },
  });
};

export const useActivateLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leaseService.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: LEASES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...LEASES_QUERY_KEY, id] });
      showToast.success('Lease activated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to activate lease';
      showToast.error('Activation Failed', message);
    },
  });
};

export const useTerminateLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      leaseService.terminate(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: LEASES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...LEASES_QUERY_KEY, id] });
      showToast.success('Lease terminated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to terminate lease';
      showToast.error('Termination Failed', message);
    },
  });
};