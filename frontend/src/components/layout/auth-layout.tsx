import { type ReactNode } from 'react';
import { Logo } from '@/components/shared/logo';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout = ({
  children,
  title = 'Welcome Back',
  subtitle = 'Sign in to your account to continue',
}: AuthLayoutProps) => {
  return (
    <div className="container-center flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-3xl font-bold text-neutral-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};