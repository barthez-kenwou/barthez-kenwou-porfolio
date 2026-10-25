import React, { Component } from 'react';
import { analytics } from './analytics';
import { reportError } from './errorReporter';
import { InternalErrorPage } from '@/pages/Errors/InternalErrorPage/InternalError';
import { isChunkLoadError, reloadOnceForChunkError } from '@/shared/lib/chunkLoadError';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** callback when an error is caught */
  onError?: (error: Error, info?: React.ErrorInfo, errorId?: string) => void;
  /** whether to show a 'report' button in the error UI */
  showReport?: boolean;
  /** content keeps app chrome; fullscreen replaces everything */
  variant?: 'content' | 'fullscreen';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
  reported?: boolean;
  recovering?: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    if (isChunkLoadError(error)) {
      return { hasError: false, recovering: true, error };
    }
    const errorId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    return { hasError: true, error, errorId, recovering: false };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Stale Vite chunk after deploy — hard-reload once to pick up new hashes.
    if (isChunkLoadError(error)) {
      reloadOnceForChunkError();
      return;
    }

    // Centralized reporting (analytics + optional Sentry)
    try {
      await reportError(error, { componentStack: errorInfo.componentStack ?? undefined });
    } catch {
      // swallow
    }

    try {
      analytics.trackError(error, {
        componentStack: errorInfo.componentStack ?? undefined,
        errorBoundary: true,
      });
    } catch {
      // ignore analytics failure
    }

    console.error('ErrorBoundary caught an error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.state.errorId);
    }
  }

  handleRetry = () => {
    // Reset internal boundary state to attempt re-rendering children
    this.setState({ hasError: false, error: undefined, reported: false });
  };

  handleReport = async () => {
    if (!this.state.error) return;
    try {
      await reportError(this.state.error, { context: { errorId: this.state.errorId } });
      this.setState({ reported: true });
      // also call analytics event for user report
      analytics.track({ name: 'error.reported', properties: { errorId: this.state.errorId } });
    } catch {
      // ignore
    }
  };

  render() {
    if (this.state.recovering) {
      return null;
    }

    if (this.state.hasError) {
      // Allow explicit null fallback (silent degrade) - do not use truthiness
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }

      return (
        <InternalErrorPage
          variant={this.props.variant ?? 'content'}
          error={this.state.error}
          errorId={this.state.errorId}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
