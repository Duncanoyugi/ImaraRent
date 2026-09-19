import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FormField } from '@/components/forms/form-field';
import { useAcceptInvitation, useValidateInvitation } from '../hooks/use-accept-invitation';
import { acceptInvitationSchema, type AcceptInvitationFormData } from '../schemas/auth.schemas';
import { passwordStrength } from '@/utils/validators';
import { cn } from '@/lib/utils';

/**
 * Invitation acceptance. The token arrives as `?token=` on the emailed link
 * and is validated before the form renders, so an expired link says so
 * instead of failing only after the user has chosen a password.
 */
export const AcceptInvitationForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // The hook reads `?token=` from the URL itself.
  const { data: validation, isLoading: validating, isError } = useValidateInvitation();
  const accept = useAcceptInvitation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AcceptInvitationFormData>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: { token: token ?? '', password: '', confirmPassword: '' },
  });

  const password = watch('password');
  const strength = passwordStrength(password ?? '');

  if (!token) {
    return (
      <Alert variant="error">
        <AlertTitle>This link is incomplete</AlertTitle>
        <AlertDescription>
          Open the invitation straight from the email you were sent, rather than copying
          part of the address.
        </AlertDescription>
      </Alert>
    );
  }

  if (validating) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-neutral-500">Checking your invitation…</p>
      </div>
    );
  }

  if (isError || validation?.valid === false) {
    return (
      <Alert variant="error">
        <AlertTitle>This invitation is no longer valid</AlertTitle>
        <AlertDescription>
          It may have expired or already been used. Ask your property manager to send a
          new one.
        </AlertDescription>
      </Alert>
    );
  }

  const onSubmit = handleSubmit((values) => {
    // The mutation signs the user in and redirects on success.
    accept.mutate(values);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Alert variant="success" icon={false}>
        <AlertDescription className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-success-600" />
          Your invitation is valid. Choose a password to finish setting up your account.
        </AlertDescription>
      </Alert>

      <input type="hidden" {...register('token')} />

      <FormField label="Create a password" required error={errors.password}>
        <Input type="password" autoComplete="new-password" {...register('password')} />
      </FormField>

      {password && (
        <div className="flex items-center gap-2">
          <div className="flex h-1 flex-1 gap-1" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  'h-full flex-1 rounded-full transition-colors',
                  i < strength.score
                    ? strength.score <= 1
                      ? 'bg-error-500'
                      : strength.score <= 2
                        ? 'bg-warning-500'
                        : strength.score === 3
                          ? 'bg-info-500'
                          : 'bg-success-500'
                    : 'bg-neutral-200 dark:bg-neutral-700'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-500">{strength.label}</span>
        </div>
      )}

      <FormField label="Repeat the password" required error={errors.confirmPassword}>
        <Input type="password" autoComplete="new-password" {...register('confirmPassword')} />
      </FormField>

      <Button type="submit" loading={accept.isPending} className="w-full gap-2">
        <KeyRound className="h-4 w-4" />
        Set password and sign in
      </Button>
    </form>
  );
};

AcceptInvitationForm.displayName = 'AcceptInvitationForm';
