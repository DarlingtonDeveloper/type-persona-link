import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
    error?: Error;
    resetError?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
    const handleReload = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Something went wrong!</strong>
                        <br />
                        {error?.message || 'An unexpected error occurred.'}
                    </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                    <Button onClick={resetError || handleReload} className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                    <Button onClick={handleGoHome} variant="outline" className="flex-1">
                        <Home className="h-4 w-4 mr-2" />
                        Go Home
                    </Button>
                </div>

                {process.env.NODE_ENV === 'development' && error && (
                    <details className="mt-4 p-4 bg-gray-100 rounded text-sm">
                        <summary className="cursor-pointer font-medium">Error Details</summary>
                        <pre className="mt-2 overflow-auto text-xs">
                            {error.stack}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
};

export default ErrorFallback;