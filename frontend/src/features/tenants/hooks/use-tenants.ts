import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantService } from '../services/tenant.service';
import { showToast } from '@/app/providers/toast-provider';
import { type CreateTenantData, type UpdateTenantData } from '../types/tenant.types';

export const TENANTS_QUERY_KEY = ['tenants'];

export const useTenants = (params?: { status?: string; unitId?: string }) => {
  return useQuery({
    queryKey: [...TENANTS_QUERY_KEY, params],
    queryFn: () => tenantService.getAll(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTenant = (id: string) => {
  return useQuery({
    queryKey: [...TENANTS_QUERY_KEY, id],
    queryFn: () => tenantService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTenantByUnit = (unitId: string) => {
  return useQuery({
    queryKey: [...TENANTS_QUERY_KEY, 'unit', unitId],
    queryFn: () => tenantService.getByUnit(unitId),
    enabled: !!unitId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantData) => tenantService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
      showToast.success('Tenant created successfully', 'Invitation email has been sent');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create tenant';
      showToast.error('Creation Failed', message);
    },
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantData }) =>
      tenantService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...TENANTS_QUERY_KEY, variables.id] });
      showToast.success('Tenant updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update tenant';
      showToast.error('Update Failed', message);
    },
  });
};

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
      showToast.success('Tenant deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete tenant';
      showToast.error('Deletion Failed', message);
    },
  });
};

export const useResendInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: string) => tenantService.resendInvitation(tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
      showToast.success('Invitation resent successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to resend invitation';
      showToast.error('Failed', message);
    },
  });
};

export const useCancelInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, reason }: { tenantId: string; reason?: string }) =>
      tenantService.cancelInvitation(tenantId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
      showToast.success('Invitation cancelled successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to cancel invitation';
      showToast.error('Failed', message);
    },
  });
};