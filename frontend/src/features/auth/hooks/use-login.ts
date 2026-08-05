import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuth } from './use-auth';
import { showToast } from '@/app/providers/toast-provider';
import { type LoginFormData } from '../schemas/auth.schemas';
import { authConfig } from '@/config/auth.config';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (response) => {
      // Store tokens and user data
      login(response.user, {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      showToast.success('Welcome back!', `Hello ${response.user.firstName}`);

      // Redirect based on role
      const role = response.user.role;
      const redirectPath = authConfig.roleRedirects[role] || '/dashboard';
      navigate(redirectPath);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Login failed. Please try again.';
      showToast.error('Login Failed', message);
    },
  });
};