import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '../hooks';
import { registerSchema, type RegisterFormData } from '../schemas/auth.schemas';

export const RegisterForm = () => {
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      organizationName: '',
      organizationAddress: '',
      terms: false,
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, terms, ...payload } = data;
    registerUser.mutate(payload as RegisterFormData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="0712345678"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizationName">Organization Name</Label>
        <Input
          id="organizationName"
          placeholder="Your Property Company Ltd"
          error={errors.organizationName?.message}
          {...register('organizationName')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizationAddress">Organization Address (Optional)</Label>
        <Input
          id="organizationAddress"
          placeholder="Nairobi, Kenya"
          error={errors.organizationAddress?.message}
          {...register('organizationAddress')}
        />
      </div>

      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="terms"
          className="mt-1 h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500 dark:border-neutral-600 dark:bg-neutral-800"
          {...register('terms')}
        />
        <Label htmlFor="terms" className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          I agree to the{' '}
          <Link to="/terms" className="text-brand-600 hover:text-brand-700 dark:text-brand-400">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-brand-600 hover:text-brand-700 dark:text-brand-400">
            Privacy Policy
          </Link>
        </Label>
      </div>
      {errors.terms && (
        <p className="text-sm text-error-500">{errors.terms.message}</p>
      )}

      <Button
        type="submit"
        className="w-full"
        loading={registerUser.isPending}
        disabled={registerUser.isPending}
      >
        {registerUser.isPending ? 'Creating Account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};