import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BRAND_SPECS, LOCAL_STORAGE_KEYS } from '@/constants';

interface WelcomeGifProps {
    onComplete: () => void;
    userCode: string;
}

const WelcomeGif: React.FC<WelcomeGifProps> = ({ onComplete, userCode }) => {
    const [timeLeft, setTimeLeft] = useState(BRAND_SPECS.WELCOME_GIF_DURATION);
    const [canSkip, setCanSkip] = useState(false);
    const [gifLoaded, setGifLoaded] = useState(false);
    const [gifError, setGifError] = useState(false);

    // Allow skip after 5 seconds
    useEffect(() => {
        const skipTimer = setTimeout(() => {
            setCanSkip(true);
        }, 5000);

        return () => clearTimeout(skipTimer);
    }, []);

    // Main countdown timer
    useEffect(() => {
        if (timeLeft <= 0) {
            handleComplete();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleComplete = () => {
        // Mark welcome as viewed
        try {
            localStorage.setItem(LOCAL_STORAGE_KEYS.WELCOME_GIF_VIEWED, 'true');
        } catch (error) {
            console.warn('Could not save welcome viewed status:', error);
        }

        onComplete();
    };

    const handleSkip = () => {
        if (canSkip) {
            handleComplete();
        }
    };

    const progressPercentage = ((BRAND_SPECS.WELCOME_GIF_DURATION - timeLeft) / BRAND_SPECS.WELCOME_GIF_DURATION) * 100;

    return (
        <div className="text-center space-y-6 max-w-md mx-auto">
            {/* GIF Container */}
            <div className="welcome-gif-container relative">
                {!gifError ? (
                    <>
                        <img
                            src="/welcome.gif"
                            alt="Welcome to E3 Circle"
                            className="welcome-gif w-full h-auto rounded-xl shadow-lg max-h-96 object-cover"
                            onLoad={() => setGifLoaded(true)}
                            onError={() => {
                                setGifError(true);
                                console.warn('Welcome GIF failed to load');
                            }}
                            style={{ display: gifLoaded ? 'block' : 'none' }}
                        />

                        {/* Loading placeholder */}
                        {!gifLoaded && (
                            <div className="w-full h-64 bg-brand-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-white"></div>
                            </div>
                        )}
                    </>
                ) : (
                    /* Fallback content if GIF fails */
                    <div className="welcome-container w-full h-64 rounded-xl flex flex-col items-center justify-center p-8">
                        <div className="w-20 h-20 bg-brand-white/20 rounded-full flex items-center justify-center mb-4">
                            <span className="text-brand-white text-3xl font-bold">E3</span>
                        </div>
                        <h2 className="brand-gif-text text-brand-white mb-2">Welcome to E3 Circle!</h2>
                        <p className="text-brand-white/80 text-lg">Your profile system</p>
                    </div>
                )}
            </div>

            {/* Welcome Text */}
            <div className="space-y-2">
                <h1 className="brand-heading text-brand-white">Welcome to E3 Circle!</h1>
                <p className="brand-body text-brand-white/90">Let's set up your profile</p>
                <p className="text-brand-white/70 text-lg">User Code: {userCode}</p>
            </div>

            {/* Progress Section */}
            <div className="welcome-container rounded-lg p-4 space-y-3">
                <p className="text-brand-white brand-gif-text">
                    {gifError ? 'Continuing to setup...' : `Auto-advancing in ${timeLeft} seconds`}
                </p>

                <Progress
                    value={progressPercentage}
                    className="w-full h-3 bg-brand-white/20"
                />

                <div className="flex justify-between text-brand-white/60 text-sm">
                    <span>0s</span>
                    <span>{BRAND_SPECS.WELCOME_GIF_DURATION}s</span>
                </div>
            </div>

            {/* Skip Button */}
            {(canSkip || gifError) && (
                <Button
                    onClick={handleSkip}
                    size="lg"
                    className="brand-button-primary w-full"
                    disabled={!canSkip && !gifError}
                >
                    {gifError ? 'Continue to Setup' : 'Skip Introduction'}
                </Button>
            )}

            {/* Help Text */}
            <p className="text-brand-white/60 text-sm">
                We'll guide you through setting up your personal profile
            </p>
        </div>
    );
};

export default WelcomeGif;