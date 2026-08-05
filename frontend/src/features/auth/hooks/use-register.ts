import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuth } from './use-auth';
import { showToast } from '@/app/providers/toast-provider';
import { type RegisterFormData } from '../schemas/auth.schemas';

export const useRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: (response) => {
      // Store tokens and user data
      login(response.user, {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      showToast.success(
        'Registration Successful!',
        `Welcome ${response.user.firstName}! Your organization has been created.`
      );

      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Registration failed. Please try again.';
      showToast.error('Registration Failed', message);
    },
  });
};