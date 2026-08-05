import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Logo } from '@/components/shared/logo';
import { useValidateInvitation, useAcceptInvitation } from '@/features/auth/hooks';
import { acceptInvitationSchema, type AcceptInvitationFormData } from '@/features/auth/schemas/auth.schemas';

export default function AcceptInvitationPage() {
  const navigate = useNavigate();
  const { data, isLoading: isValidating, error } = useValidateInvitation();
  const acceptInvitation = useAcceptInvitation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInvitationFormData>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      token: new URLSearchParams(window.location.search).get('token') || '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: AcceptInvitationFormData) => {
    acceptInvitation.mutate(data);
  };

  if (isValidating) {
    return (
      <div className="container-center flex min-h-screen items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto" />
          <p className="mt-4 text-neutral-500">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.valid) {
    return (
      <div className="container-center flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-error-500">Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-600 dark:text-neutral-400">
              Please contact your property manager for a new invitation link.
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tenant = data?.tenant;

  return (
    <div className="container-center flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-3xl font-bold text-neutral-900 dark:text-white">
            Complete Your Registration
          </h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            Welcome to ImaraRent, {tenant?.firstName}!
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Set Your Password</CardTitle>
            <CardDescription>
              Create a secure password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 8 characters"
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={acceptInvitation.isPending}
                disabled={acceptInvitation.isPending}
              >
                {acceptInvitation.isPending ? 'Setting up account...' : 'Complete Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}