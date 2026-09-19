import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '../services/organization.service';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { showToast } from '@/app/providers/toast-provider';
import { errorMessage } from '@/utils/error-handlers';
import type { Organization, UpdateOrganizationData } from '../types/organization.types';

export const ORGANIZATION_QUERY_KEY = ['organization'];

export const useOrganization = () => {
  const { user } = useAuth();

  return useQuery<Organization>({
    queryKey: [...ORGANIZATION_QUERY_KEY, 'me'],
    queryFn: () => organizationService.getMine(),
    enabled: !!user,
    staleTime: 1000 * 60 * 10,
  });
};

export const useOrganizationUsers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...ORGANIZATION_QUERY_KEY, 'users'],
    queryFn: () => organizationService.getUsers(),
    // Only owners and managers may list the roster.
    enabled: !!user && user.role !== 'TENANT',
    staleTime: 1000 * 60 * 5,
  });
};

export const useOrganizationStats = () => {
  const { user } = useAuth();
  const organizationId = user?.organizationId;

  return useQuery({
    queryKey: [...ORGANIZATION_QUERY_KEY, 'stats', organizationId],
    queryFn: () => organizationService.getStats(organizationId!),
    enabled: !!organizationId && user?.role !== 'TENANT',
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateOrganizationData) =>
      organizationService.update(user!.organizationId, data),
    onSuccess: (organization) => {
      queryClient.setQueryData([...ORGANIZATION_QUERY_KEY, 'me'], organization);
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEY });
      showToast.success('Organization updated');
    },
    onError: (error) => showToast.error('Could not save changes', errorMessage(error)),
  });
};
