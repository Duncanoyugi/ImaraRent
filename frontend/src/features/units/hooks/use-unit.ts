import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unitService } from '../services/unit.service';
import { showToast } from '@/app/providers/toast-provider';
import { type CreateUnitData, type UpdateUnitData, type BulkCreateUnitData } from '../types/unit.types';

export const UNITS_QUERY_KEY = ['units'];

export const useUnits = (propertyId?: string) => {
  return useQuery({
    queryKey: [...UNITS_QUERY_KEY, { propertyId }],
    queryFn: () => unitService.getAll(propertyId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUnit = (id: string) => {
  return useQuery({
    queryKey: [...UNITS_QUERY_KEY, id],
    queryFn: () => unitService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUnitData) => unitService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNITS_QUERY_KEY });
      showToast.success('Unit created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create unit';
      showToast.error('Creation Failed', message);
    },
  });
};

export const useBulkCreateUnits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkCreateUnitData) => unitService.bulkCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNITS_QUERY_KEY });
      showToast.success('Units created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create units';
      showToast.error('Creation Failed', message);
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUnitData }) =>
      unitService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: UNITS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...UNITS_QUERY_KEY, variables.id] });
      showToast.success('Unit updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update unit';
      showToast.error('Update Failed', message);
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unitService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNITS_QUERY_KEY });
      showToast.success('Unit deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete unit';
      showToast.error('Deletion Failed', message);
    },
  });
};