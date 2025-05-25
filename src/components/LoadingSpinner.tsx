import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import DynamicBackground from '@/components/DynamicBackground';

interface LoadingSpinnerProps {
    message?: string;
    variant?: 'profile' | 'form' | 'minimal';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = "Loading...",
    variant = 'minimal'
}) => {
    if (variant === 'profile') {
        return (
            <DynamicBackground>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="w-full max-w-md space-y-4 p-6">
                        <Skeleton className="h-24 w-24 rounded-xl mx-auto" />
                        <Skeleton className="h-20 w-full rounded-xl" />
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full rounded-full" />
                            <Skeleton className="h-12 w-full rounded-full" />
                            <Skeleton className="h-12 w-full rounded-full" />
                        </div>
                        {message && (
                            <p className="text-center text-gray-600 mt-4">{message}</p>
                        )}
                    </div>
                </div>
            </DynamicBackground>
        );
    }

    if (variant === 'form') {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                {message && (
                    <p className="text-center text-gray-600 text-sm">{message}</p>
                )}
            </div>
        );
    }

    // Minimal variant
    return (
        <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            {message && (
                <span className="ml-2 text-gray-600 text-sm">{message}</span>
            )}
        </div>
    );
};