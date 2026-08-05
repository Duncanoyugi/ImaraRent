import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container-center flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-neutral-200 dark:text-neutral-700">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-6">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}