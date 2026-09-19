import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { showToast } from '@/app/providers/toast-provider';
import { errorMessage } from '@/utils/error-handlers';
import type { UpdateUserData, ChangePasswordData } from '../types/user.types';
import type { User } from '@/types/user.types';

export const USERS_QUERY_KEY = ['users'];

export const useUser = (id: string | undefined) =>
  useQuery<User>({
    queryKey: [...USERS_QUERY_KEY, id],
    queryFn: () => userService.getById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

export const useCurrentUser = () =>
  useQuery<User>({
    queryKey: [...USERS_QUERY_KEY, 'me'],
    queryFn: () => userService.getMe(),
    staleTime: 1000 * 60 * 5,
  });

/**
 * Updates a profile. When the edited user is the signed-in one we also
 * refresh the auth context, so the header name updates without a reload.
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      userService.update(id, data),
    onSuccess: async (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['organization', 'users'] });
      if (variables.id === user?.id) await refreshUser();
      showToast.success('Profile updated');
    },
    onError: (error) => showToast.error('Could not save changes', errorMessage(error)),
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangePasswordData }) =>
      userService.changePassword(id, data),
    onSuccess: () => showToast.success('Password changed'),
    onError: (error) =>
      showToast.error('Could not change password', errorMessage(error)),
  });

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['organization', 'users'] });
      showToast.success('Access revoked');
    },
    onError: (error) => showToast.error('Could not revoke access', errorMessage(error)),
  });
};

export const useReactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.reactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['organization', 'users'] });
      showToast.success('Access restored');
    },
    onError: (error) => showToast.error('Could not restore access', errorMessage(error)),
  });
};
