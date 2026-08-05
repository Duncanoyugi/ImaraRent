import { QueryProvider } from '@/app/providers/query-provider';
import { ToastProvider } from '@/app/providers/toast-provider';
import { AuthProvider } from '@/app/providers/auth-provider';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/app/router';

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;