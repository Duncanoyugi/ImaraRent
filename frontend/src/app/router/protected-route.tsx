import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};