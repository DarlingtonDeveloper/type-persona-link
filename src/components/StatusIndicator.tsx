import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

export type StatusType = 'success' | 'error' | 'warning' | 'pending' | 'info';

interface StatusIndicatorProps {
    status: StatusType;
    message?: string;
    className?: string;
    showIcon?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
    status,
    message,
    className,
    showIcon = true,
    size = 'md'
}) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'success':
                return {
                    icon: CheckCircle,
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200'
                };
            case 'error':
                return {
                    icon: XCircle,
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200'
                };
            case 'warning':
                return {
                    icon: AlertCircle,
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200'
                };
            case 'pending':
                return {
                    icon: Clock,
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200'
                };
            case 'info':
            default:
                return {
                    icon: AlertCircle,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200'
                };
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return {
                    container: 'p-2',
                    icon: 'h-3 w-3',
                    text: 'text-xs'
                };
            case 'lg':
                return {
                    container: 'p-4',
                    icon: 'h-6 w-6',
                    text: 'text-base'
                };
            case 'md':
            default:
                return {
                    container: 'p-3',
                    icon: 'h-4 w-4',
                    text: 'text-sm'
                };
        }
    };

    const config = getStatusConfig();
    const sizeClasses = getSizeClasses();
    const Icon = config.icon;

    if (!message && !showIcon) {
        return (
            <div
                className={cn(
                    'w-3 h-3 rounded-full',
                    config.color.replace('text-', 'bg-'),
                    className
                )}
            />
        );
    }

    return (
        <div
            className={cn(
                'flex items-center gap-2 rounded-lg border',
                config.bgColor,
                config.borderColor,
                sizeClasses.container,
                className
            )}
        >
            {showIcon && (
                <Icon className={cn(config.color, sizeClasses.icon)} />
            )}
            {message && (
                <span className={cn(config.color, sizeClasses.text, 'font-medium')}>
                    {message}
                </span>
            )}
        </div>
    );
};

export default StatusIndicator;