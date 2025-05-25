import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { ErrorBoundaryState, ComponentProps } from '@/types';
import { ERROR_MESSAGES, APP_CONFIG } from '@/constants';

interface ErrorBoundaryProps extends ComponentProps {
    fallback?: React.ComponentType<ErrorFallbackProps>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    showDetails?: boolean;
}

interface ErrorFallbackProps {
    error?: Error;
    resetError?: () => void;
    showDetails?: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
        this.resetError = this.resetError.bind(this);
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ error, errorInfo });

        // Call optional error handler
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // In production, you might want to send this to an error reporting service
        if (process.env.NODE_ENV === 'production') {
            // Example: Send to error reporting service
            // errorReportingService.captureException(error, { extra: errorInfo });
        }
    }

    resetError() {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback;
                return (
                    <FallbackComponent
                        error={this.state.error}
                        resetError={this.resetError}
                        showDetails={this.props.showDetails}
                    />
                );
            }

            return (
                <ErrorFallback
                    error={this.state.error}
                    resetError={this.resetError}
                    showDetails={this.props.showDetails}
                />
            );
        }

        return this.props.children;
    }
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
    error,
    resetError,
    showDetails = false
}) => {
    const handleReload = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    const handleReportError = () => {
        const subject = encodeURIComponent(`${APP_CONFIG.NAME} Error Report`);
        const body = encodeURIComponent(`
Error Details:
- Message: ${error?.message || 'Unknown error'}
- Stack: ${error?.stack || 'No stack trace available'}
- URL: ${window.location.href}
- User Agent: ${navigator.userAgent}
- Timestamp: ${new Date().toISOString()}

Additional Information:
Please describe what you were doing when this error occurred.
        `);

        window.open(`mailto:${APP_CONFIG.SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
    };

    const getErrorMessage = () => {
        if (!error) return ERROR_MESSAGES.GENERIC_ERROR;

        // Provide user-friendly messages for common errors
        if (error.message.includes('ChunkLoadError')) {
            return 'The application needs to be refreshed. This usually happens after an update.';
        }

        if (error.message.includes('NetworkError')) {
            return ERROR_MESSAGES.NETWORK_ERROR;
        }

        return error.message || ERROR_MESSAGES.GENERIC_ERROR;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-lg">
                <Alert variant="destructive" className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Something went wrong!</strong>
                        <br />
                        {getErrorMessage()}
                    </AlertDescription>
                </Alert>

                <div className="space-y-3">
                    <div className="flex gap-2">
                        <Button
                            onClick={resetError || handleReload}
                            className="flex-1"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                        <Button
                            onClick={handleGoHome}
                            variant="outline"
                            className="flex-1"
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Go Home
                        </Button>
                    </div>

                    <Button
                        onClick={handleReportError}
                        variant="outline"
                        className="w-full"
                        size="sm"
                    >
                        <Bug className="h-4 w-4 mr-2" />
                        Report This Error
                    </Button>
                </div>

                {(showDetails || process.env.NODE_ENV === 'development') && error && (
                    <details className="mt-6 p-4 bg-gray-100 rounded text-sm">
                        <summary className="cursor-pointer font-medium mb-2">
                            Technical Details (for developers)
                        </summary>
                        <div className="space-y-2">
                            <div>
                                <strong>Error:</strong> {error.name}
                            </div>
                            <div>
                                <strong>Message:</strong> {error.message}
                            </div>
                            {error.stack && (
                                <div>
                                    <strong>Stack Trace:</strong>
                                    <pre className="mt-1 overflow-auto text-xs bg-white p-2 rounded border">
                                        {error.stack}
                                    </pre>
                                </div>
                            )}
                            <div className="text-xs text-gray-600 mt-2">
                                <strong>Timestamp:</strong> {new Date().toISOString()}
                                <br />
                                <strong>URL:</strong> {window.location.href}
                                <br />
                                <strong>User Agent:</strong> {navigator.userAgent}
                            </div>
                        </div>
                    </details>
                )}

                <div className="mt-4 text-center text-sm text-gray-600">
                    If this problem persists, please contact support at{' '}
                    <a
                        href={`mailto:${APP_CONFIG.SUPPORT_EMAIL}`}
                        className="text-blue-600 hover:underline"
                    >
                        {APP_CONFIG.SUPPORT_EMAIL}
                    </a>
                </div>
            </div>
        </div>
    );
};

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Partial<ErrorBoundaryProps>
) => {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
};

export default ErrorFallback;