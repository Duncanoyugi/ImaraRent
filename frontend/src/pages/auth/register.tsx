import { RegisterForm } from '@/features/auth/components/register-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/shared/logo';

export default function RegisterPage() {
  return (
    <div className="container-center flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-3xl font-bold text-neutral-900 dark:text-white">
            Create Your Account
          </h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            Start managing your properties with ImaraRent
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Fill in the details below to create your account and organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}