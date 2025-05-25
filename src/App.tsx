import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./components/AdminDashboard";
import { APP_CONFIG } from "@/constants";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  // Error reporting function for production
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In production, send errors to monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.error('Application Error:', error, errorInfo);
      // Example: Send to error monitoring service
      // errorMonitoringService.captureException(error, { extra: errorInfo });
    }
  };

  return (
    <ErrorBoundary onError={handleError} showDetails={process.env.NODE_ENV === 'development'}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/:userCode" element={<UserProfile />} />

              {/* Admin routes - in production, these should be protected */}
              {process.env.NODE_ENV === 'development' && (
                <Route path="/admin" element={<AdminDashboard />} />
              )}

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;