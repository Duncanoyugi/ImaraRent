import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FormField } from '@/components/forms/form-field';
import { authService } from '../services/auth.service';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/auth.schema';
import { showToast } from '@/app/providers/toast-provider';
import { errorMessage } from '@/utils/error-handlers';

/**
 * Completes a password reset from an emailed `?token=` link.
 *
 * NOTE: this is written against the intended contract but is INERT until the
 * backend ships `POST /auth/reset-password` — see the note in
 * `forgot-password-form.tsx`. It is not reachable from any route today; wire
 * `/reset-password` into the router once the endpoint exists.
 */
export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const reset = useMutation({
    mutationFn: (values: ResetPasswordFormData) => authService.resetPassword(values),
    onSuccess: () => {
      showToast.success('Password updated', 'Sign in with your new password.');
      navigate('/login', { replace: true });
    },
    onError: (error) => showToast.error('Could not reset your password', errorMessage(error)),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token ?? '', password: '', confirmPassword: '' },
  });

  if (!token) {
    return (
      <Alert variant="error">
        <AlertTitle>This reset link is incomplete</AlertTitle>
        <AlertDescription>Open the link directly from the email you were sent.</AlertDescription>
      </Alert>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => reset.mutate(values))}
      className="space-y-5"
      noValidate
    >
      <input type="hidden" {...register('token')} />

      <FormField label="New password" required error={errors.password}>
        <Input type="password" autoComplete="new-password" {...register('password')} />
      </FormField>

      <FormField label="Repeat the password" required error={errors.confirmPassword}>
        <Input type="password" autoComplete="new-password" {...register('confirmPassword')} />
      </FormField>

      <Button type="submit" loading={reset.isPending} className="w-full gap-2">
        <KeyRound className="h-4 w-4" />
        Set new password
      </Button>
    </form>
  );
};

ResetPasswordForm.displayName = 'ResetPasswordForm';
