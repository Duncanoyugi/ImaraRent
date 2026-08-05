import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuth } from './use-auth';
import { showToast } from '@/app/providers/toast-provider';
import { type AcceptInvitationFormData } from '../schemas/auth.schemas';

export const useValidateInvitation = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return useQuery({
    queryKey: ['validate-invitation', token],
    queryFn: () => {
      if (!token) {
        throw new Error('No invitation token provided');
      }
      return authService.validateInvitationToken(token);
    },
    enabled: !!token,
    retry: false,
  });
};

export const useAcceptInvitation = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: AcceptInvitationFormData) => authService.acceptInvitation(data),
    onSuccess: (response) => {
      login(response.user, {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      showToast.success(
        'Invitation Accepted!',
        `Welcome ${response.user.firstName}! Your account has been created.`
      );

      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to accept invitation. Please try again.';
      showToast.error('Invitation Failed', message);
    },
  });
};