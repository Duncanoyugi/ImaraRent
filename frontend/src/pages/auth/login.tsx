import { LoginForm } from '@/features/auth/components/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/shared/logo';

export default function LoginPage() {
  return (
    <div className="container-center flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-3xl font-bold text-neutral-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            Sign in to your account to continue
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}