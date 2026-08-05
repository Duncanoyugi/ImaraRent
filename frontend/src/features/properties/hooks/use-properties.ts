import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../services/property.service';
import { showToast } from '@/app/providers/toast-provider';
import { type CreatePropertyData, type UpdatePropertyData } from '../types/property.types';

export const PROPERTIES_QUERY_KEY = ['properties'];

export const useProperties = () => {
  return useQuery({
    queryKey: PROPERTIES_QUERY_KEY,
    queryFn: () => propertyService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: [...PROPERTIES_QUERY_KEY, id],
    queryFn: () => propertyService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePropertyData) => propertyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
      showToast.success('Property created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create property';
      showToast.error('Creation Failed', message);
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyData }) =>
      propertyService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PROPERTIES_QUERY_KEY, variables.id] });
      showToast.success('Property updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update property';
      showToast.error('Update Failed', message);
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
      showToast.success('Property deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete property';
      showToast.error('Deletion Failed', message);
    },
  });
};