import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { maintenanceService } from '../services/maintenance.service';
import { showToast } from '@/app/providers/toast-provider';
import type { ApiError } from '@/lib/api/api-types';
import type { CreateTicketData, UpdateTicketData, TicketFilters } from '../types/maintenance.types';

export const TICKETS_QUERY_KEY = ['tickets'];

export const useTickets = (params?: TicketFilters) => {
  return useQuery({
    queryKey: [...TICKETS_QUERY_KEY, params],
    queryFn: () => maintenanceService.getAll(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: [...TICKETS_QUERY_KEY, id],
    queryFn: () => maintenanceService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useMyTickets = () => {
  return useQuery({
    queryKey: [...TICKETS_QUERY_KEY, 'my'],
    queryFn: () => maintenanceService.getMyTickets(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTicketStats = () => {
  return useQuery({
    queryKey: [...TICKETS_QUERY_KEY, 'stats'],
    queryFn: () => maintenanceService.getStats(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketData) => maintenanceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
      showToast.success('Ticket created', 'Maintenance request has been submitted');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to create ticket';
      showToast.error('Creation Failed', message);
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketData }) =>
      maintenanceService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...TICKETS_QUERY_KEY, variables.id] });
      showToast.success('Ticket updated');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to update ticket';
      showToast.error('Update Failed', message);
    },
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, assignedToId }: { id: string; assignedToId: string }) =>
      maintenanceService.assign(id, assignedToId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...TICKETS_QUERY_KEY, variables.id] });
      showToast.success('Ticket assigned');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to assign ticket';
      showToast.error('Assignment Failed', message);
    },
  });
};

export const useCompleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, resolutionNotes }: { id: string; resolutionNotes?: string }) =>
      maintenanceService.complete(id, resolutionNotes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...TICKETS_QUERY_KEY, variables.id] });
      showToast.success('Ticket completed');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message || 'Failed to complete ticket';
      showToast.error('Completion Failed', message);
    },
  });
};