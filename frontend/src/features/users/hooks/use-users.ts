import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import type { User } from '@/types/user.types';

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
};
