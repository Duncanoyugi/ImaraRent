import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { tenantDashboardService } from '../services/tenant-dashboard.service';
import { showToast } from '@/app/providers/toast-provider';
import type { ApiError } from '@/lib/api/api-types';

export const DASHBOARD_QUERY_KEY = ['tenant-dashboard'];

export const useTenantDashboard = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => tenantDashboardService.getDashboard(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTenantInvoices = (limit?: number, offset?: number) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'invoices', { limit, offset }],
    queryFn: () => tenantDashboardService.getInvoices(limit, offset),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTenantPayments = (limit?: number, offset?: number) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'payments', { limit, offset }],
    queryFn: () => tenantDashboardService.getPayments(limit, offset),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTenantLease = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'lease'],
    queryFn: () => tenantDashboardService.getLease(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTenantBalance = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'balance'],
    queryFn: () => tenantDashboardService.getBalance(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateTenantProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { firstName?: string; lastName?: string; phone?: string; nationalId?: string }) =>
      tenantDashboardService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      showToast.success('Profile updated successfully');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to update profile';
      showToast.error('Update Failed', message);
    },
  });
};

export const useTenantMaintenanceTickets = (limit?: number, offset?: number) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'maintenance', { limit, offset }],
    queryFn: () => tenantDashboardService.getMaintenanceTickets(limit, offset),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTenantNotifications = (limit?: number, offset?: number) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'notifications', { limit, offset }],
    queryFn: () => tenantDashboardService.getNotifications(limit, offset),
    staleTime: 1000 * 60 * 5,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => tenantDashboardService.markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...DASHBOARD_QUERY_KEY, 'notifications'] });
      queryClient.invalidateQueries({ queryKey: [...DASHBOARD_QUERY_KEY, 'notifications', 'unread'] });
    },
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'notifications', 'unread'],
    queryFn: () => tenantDashboardService.getUnreadCount(),
    staleTime: 1000 * 30, // 30 seconds
  });
};