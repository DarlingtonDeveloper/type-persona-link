import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BRAND_SPECS, LOCAL_STORAGE_KEYS } from '@/constants';

interface WelcomeGifProps {
    onComplete: () => void;
    userCode: string;
}

const WelcomeGif: React.FC<WelcomeGifProps> = ({ onComplete, userCode }) => {
    const [timeLeft, setTimeLeft] = useState(25); // Changed to 25 seconds
    const [isActivated, setIsActivated] = useState(false);
    const [gifLoaded, setGifLoaded] = useState(false);
    const [gifError, setGifError] = useState(false);
    const [logoLoaded, setLogoLoaded] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [gifLoopCount, setGifLoopCount] = useState(0);

    // Track GIF loops and activate button after 25 seconds
    useEffect(() => {
        if (timeLeft <= 0) {
            setIsActivated(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleActivate = () => {
        // Mark welcome as viewed
        try {
            localStorage.setItem(LOCAL_STORAGE_KEYS.WELCOME_GIF_VIEWED, 'true');
        } catch (error) {
            console.warn('Could not save welcome viewed status:', error);
        }
        onComplete();
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-between p-8">
            {/* White E3 Logo at top */}
            <div className="flex-shrink-0 pt-16">
                <div className="w-24 h-24 flex items-center justify-center">
                    {!logoError ? (
                        <img
                            src="/whitelogo.png"
                            alt="E3 Circle Logo"
                            className="w-full h-full object-contain"
                            onLoad={() => setLogoLoaded(true)}
                            onError={() => {
                                console.warn('Logo failed to load, using fallback');
                                setLogoError(true);
                            }}
                        />
                    ) : (
                        /* Fallback text logo */
                        <div className="w-24 h-24 bg-transparent border-4 border-white rounded-full flex items-center justify-center">
                            <span className="text-white text-3xl font-bold tracking-wider">E3</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Center content - GIF section */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-sm mx-auto">
                {!gifError ? (
                    <>
                        {/* Hide text when GIF is loaded and visible */}
                        {!gifLoaded && (
                            <h1 className="welcome-text text-white text-3xl font-medium text-center leading-tight">
                                Tap a compatible phone
                            </h1>
                        )}

                        {/* Actual GIF Display */}
                        <div className="w-64 h-64 flex items-center justify-center">
                            <img
                                src="/welcome.gif"
                                alt="Welcome animation"
                                className={`w-full h-full object-contain rounded-lg transition-opacity duration-500 ${gifLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onLoad={() => {
                                    setGifLoaded(true);
                                    console.log('Welcome GIF loaded successfully');
                                }}
                                onError={(e) => {
                                    setGifError(true);
                                    console.warn('Welcome GIF failed to load from /welcome.gif');
                                    // If GIF fails, activate button after 5 seconds instead
                                    setTimeout(() => setIsActivated(true), 5000);
                                }}
                            />

                            {/* Loading placeholder */}
                            {!gifLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Fallback content if GIF fails */
                    <>
                        <h1 className="welcome-text text-white text-3xl font-medium text-center leading-tight">
                            Tap a compatible phone
                        </h1>
                        <div className="nfc-icon w-32 h-32 border-4 border-white rounded-full flex items-center justify-center bg-transparent">
                            <div className="w-16 h-16 relative">
                                <div className="absolute inset-0 border-4 border-white rounded-full nfc-wave-1"></div>
                                <div className="absolute inset-2 border-4 border-white rounded-full nfc-wave-2"></div>
                                <div className="absolute inset-4 border-4 border-white rounded-full nfc-wave-3"></div>
                                <div className="absolute inset-6 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Bottom section - Activate button */}
            <div className="flex-shrink-0 w-full max-w-sm mx-auto pb-16">
                <Button
                    onClick={handleActivate}
                    disabled={!isActivated}
                    className={`activate-button w-full text-white font-medium py-4 px-8 rounded-full text-lg transition-all duration-300 ${isActivated
                        ? 'bg-gray-600 hover:bg-gray-500 animate-pulse cursor-pointer'
                        : 'bg-gray-800 cursor-not-allowed opacity-50'
                        }`}
                    size="lg"
                >
                    Activate
                </Button>
            </div>
        </div>
    );
};

export default WelcomeGif;