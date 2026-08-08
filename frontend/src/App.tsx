import { QueryProvider } from '@/app/providers/query-provider';
import { ToastProvider } from '@/app/providers/toast-provider';
import { AuthProvider } from '@/app/providers/auth-provider';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/app/router';
import { ErrorBoundary } from '@/components/errors/error-boundary';

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;