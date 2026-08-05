import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './use-auth';
import { authService } from '../services/auth.service';
import { showToast } from '@/app/providers/toast-provider';

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      showToast.info('Logged Out', 'You have been successfully logged out.');
      navigate('/login');
    },
    onError: () => {
      // Even if API fails, clear local auth state
      logout();
      navigate('/login');
    },
  });
};