import React, { useState, useEffect } from /react';
import { CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { COMPLETION_SETTINGS, APP_CONFIG } from '@/constants';

interface CompletionPageProps {
    userCode: string;
    userName?: string;
    onComplete: () => void;
    autoRedirect?: boolean;
}

export const CompletionPage: React.FC<CompletionPageProps> = ({
    userCode,
    userName,
    onComplete,
    autoRedirect = COMPLETION_SETTINGS.AUTO_REDIRECT
}) => {
    const [timeLeft, setTimeLeft] = useState(COMPLETION_SETTINGS.DISPLAY_DURATION / 1000);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!autoRedirect) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [autoRedirect, onComplete]);

    const handleManualComplete = () => {
        onComplete();
    };

    const progressPercentage = autoRedirect
        ? ((COMPLETION_SETTINGS.DISPLAY_DURATION / 1000 - timeLeft) / (COMPLETION_SETTINGS.DISPLAY_DURATION / 1000)) * 100
        : 100;

    return (
        <div className="completion-container min-h-[400px] rounded-xl p-8 text-center space-y-6">
            {/* Success Icon with Animation */}
            <div className="completion-icon">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
            </div>

            {/* Success Message */}
            <div className="space-y-2">
                <h2 className="brand-heading text-brand-black">
                    Setup Complete!
                </h2>
                <p className="brand-body text-brand-black/80">
                    {userName ? `Welcome ${userName.split(' ')[0]}!` : 'Welcome!'}
                </p>
                <p className="text-brand-black/60 text-lg">
                    Your E3 Circle profile is now live
                </p>
            </div>

            {/* User Code Display */}
            <div className="bg-brand-white/80 rounded-xl p-4 border border-brand-black/10">
                <p className="text-brand-black/60 text-sm mb-1">Your Profile URL:</p>
                <p className="font-mono text-brand-black font-semibold text-lg">
                    {window.location.origin}/{userCode}
                </p>
            </div>

            {/* Fixed Details Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-center gap-2 text-amber-700">
                    <Clock className="h-5 w-5" />
                    <p className="font-semibold">Important Notice</p>
                </div>
                <p className="text-amber-800 text-sm leading-relaxed">
                    {COMPLETION_SETTINGS.CONFIRMATION_MESSAGE}
                </p>
            </div>

            {/* Auto-redirect Progress */}
            {autoRedirect && timeLeft > 0 && (
                <div className="space-y-3">
                    <p className="text-brand-black/60">
                        Redirecting to your live profile in {timeLeft} seconds
                    </p>
                    <Progress
                        value={progressPercentage}
                        className="w-full h-2"
                    />
                </div>
            )}

            {/* Manual Control Buttons */}
            <div className="flex gap-3 justify-center">
                <Button
                    onClick={handleManualComplete}
                    className="brand-button-primary"
                    size="lg"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    View My Profile Now
                </Button>

                {autoRedirect && (
                    <Button
                        onClick={() => setTimeLeft(0)}
                        variant="outline"
                        size="lg"
                        className="brand-button-secondary"
                    >
                        Skip Wait
                    </Button>
                )}
            </div>

            {/* Additional Info */}
            <div className="text-center text-brand-black/50 text-sm space-y-1">
                <p>You can share your profile by sending people your user code:</p>
                <p className="font-mono bg-brand-black/5 px-3 py-1 rounded font-semibold">
                    {userCode}
                </p>
                <p>Or share the direct link to your profile</p>
            </div>

            {/* Support Link */}
            <div className="pt-4 border-t border-brand-black/10">
                <p className="text-brand-black/60 text-sm">
                    Need help? Contact{' '}
                    <a
                        href={`mailto:${APP_CONFIG.SUPPORT_EMAIL}`}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        {APP_CONFIG.SUPPORT_EMAIL}
                    </a>
                </p>
            </div>
        </div>
    );
};

// Alternative minimal completion component for quick transitions
export const QuickCompletion: React.FC<{
    onComplete: () => void;
    message?: string;
}> = ({ onComplete, message = "Profile setup complete!" }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 1500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="text-center space-y-4 p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce-in">
                <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <p className="brand-body text-brand-black">{message}</p>
            <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-black"></div>
            </div>
        </div>
    );
};