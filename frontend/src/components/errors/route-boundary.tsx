import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorFallback } from './error-fallback';

interface Props {
  children: ReactNode;
  /** Changing this value re-mounts the boundary and clears the error. */
  resetKey?: string;
}

interface State {
  error: Error | null;
}

class Boundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Replace with your reporting sink (Sentry) when a DSN is configured.
    console.error('Route error:', error, info.componentStack);
  }

  componentDidUpdate(previous: Props) {
    // A failed route should not stay broken once the user navigates away.
    if (this.state.error && previous.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={() => this.setState({ error: null })}
          title="This page could not load"
          description="Something failed while rendering. Try again, or head back to your dashboard."
        />
      );
    }
    return this.props.children;
  }
}

/**
 * Per-route boundary. Unlike the app-level `ErrorBoundary`, a failure here
 * leaves the shell — sidebar, header, navigation — intact, so the user can
 * simply move somewhere else.
 */
export const RouteBoundary = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  return <Boundary resetKey={location.pathname}>{children}</Boundary>;
};

RouteBoundary.displayName = 'RouteBoundary';
