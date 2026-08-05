import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/shared/logo';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/features/auth/schemas/auth.schemas';

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log('Forgot password:', data);
  };

  return (
    <div className="container-center flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-3xl font-bold text-neutral-900 dark:text-white">
            Forgot Password?
          </h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>

              <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}