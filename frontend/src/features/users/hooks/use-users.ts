import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import type { User } from '@/types/user.types';

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useInviteManager = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.inviteManager,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useManagerProperties = (managerId: string | undefined) => {
  return useQuery({
    queryKey: ['manager-properties', managerId],
    queryFn: () => userService.getManagerProperties(managerId!),
    enabled: !!managerId,
  });
};

export const useAssignManagerProperties = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ managerId, propertyIds }: { managerId: string; propertyIds: string[] }) =>
      userService.assignManagerProperties(managerId, propertyIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['manager-properties', variables.managerId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
