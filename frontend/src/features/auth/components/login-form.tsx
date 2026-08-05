import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '../hooks';
import { loginSchema, type LoginFormData } from '../schemas/auth.schemas';

export const LoginForm = () => {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  return (
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            to="/forgot-password"
            className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={login.isPending}
        disabled={login.isPending}
      >
        {login.isPending ? 'Logging in...' : 'Sign In'}
      </Button>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
};