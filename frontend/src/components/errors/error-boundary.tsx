import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Log to error tracking service (Sentry, etc.)
    if (import.meta.env.PROD) {
      // Sentry.captureException(error);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <div className="rounded-full bg-error-50 p-4 dark:bg-error-950/20">
            <AlertTriangle className="h-12 w-12 text-error-500" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-neutral-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="mt-2 max-w-md text-neutral-500 dark:text-neutral-400">
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <div className="mt-6 flex gap-3">
            <Button onClick={this.handleReset}>
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              Go Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}