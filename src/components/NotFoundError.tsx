interface NotFoundErrorProps {
    title?: string;
    message?: string;
    showHomeButton?: boolean;
}

export const NotFoundError: React.FC<NotFoundErrorProps> = ({
    title = "Page Not Found",
    message = "The page you're looking for doesn't exist or has been moved.",
    showHomeButton = true
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl font-bold text-gray-400">404</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-600 mb-6 max-w-md">{message}</p>
                {showHomeButton && (
                    <Button onClick={() => window.location.href = '/'}>
                        <Home className="h-4 w-4 mr-2" />
                        Go Home
                    </Button>
                )}
            </div>
        </div>
    );
};