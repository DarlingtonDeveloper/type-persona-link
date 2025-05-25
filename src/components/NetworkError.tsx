interface NetworkErrorProps {
    onRetry?: () => void;
    message?: string;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
    onRetry,
    message = "Unable to connect to the server. Please check your internet connection."
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h3>
            <p className="text-gray-600 mb-4 max-w-sm">{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                </Button>
            )}
        </div>
    );
};