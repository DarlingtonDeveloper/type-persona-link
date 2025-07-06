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

    // Track video loops and activate button after 25 seconds
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
        <div className="min-h-screen bg-white flex flex-col">
            {/* Video section with overlay - starts from top */}
            <div className="flex-1 w-full relative">
                {!gifError ? (
                    <>
                        {/* Hide text when video is loaded and visible */}
                        {!gifLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <h1 className="welcome-text text-black text-3xl font-medium text-center leading-tight px-8">
                                    Tap a compatible phone
                                </h1>
                            </div>
                        )}

                        {/* Full width video container with overlay */}
                        <div className="w-full h-full flex items-center justify-center relative">
                            <video
                                src="/StartingGif.mov"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className={`w-full h-full object-cover transition-opacity duration-500 ${gifLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onLoadedData={() => {
                                    setGifLoaded(true);
                                    console.log('Welcome video loaded successfully');
                                }}
                                onCanPlay={() => {
                                    setGifLoaded(true);
                                    console.log('Welcome video ready to play');
                                }}
                                onError={(e) => {
                                    setGifError(true);
                                    console.warn('Welcome video failed to load from /StartingGif.mov');
                                    // If video fails, activate button after 5 seconds instead
                                    setTimeout(() => setIsActivated(true), 5000);
                                }}
                            />

                            {/* Logo overlay */}
                            {gifLoaded && (
                                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
                                    <div className="w-16 h-16 flex items-center justify-center">
                                        {!logoError ? (
                                            <img
                                                src="/whitelogo.png"
                                                alt="E3 Circle Logo"
                                                className="w-full h-full object-contain filter drop-shadow-lg"
                                                onLoad={() => setLogoLoaded(true)}
                                                onError={() => {
                                                    console.warn('Logo failed to load, using fallback');
                                                    setLogoError(true);
                                                }}
                                            />
                                        ) : (
                                            /* Fallback text logo */
                                            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white rounded-full flex items-center justify-center shadow-lg">
                                                <span className="text-white text-xl font-bold tracking-wider">E3</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Loading placeholder */}
                            {!gifLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Fallback content if video fails */
                    <div className="flex items-center justify-center h-full">
                        <div className="px-8 text-center">
                            <h1 className="welcome-text text-black text-3xl font-medium leading-tight">
                                Tap a compatible phone
                            </h1>
                            <div className="nfc-icon w-32 h-32 border-4 border-black rounded-full flex items-center justify-center bg-transparent mt-8 mx-auto">
                                <div className="w-16 h-16 relative">
                                    <div className="absolute inset-0 border-4 border-black rounded-full nfc-wave-1"></div>
                                    <div className="absolute inset-2 border-4 border-black rounded-full nfc-wave-2"></div>
                                    <div className="absolute inset-4 border-4 border-black rounded-full nfc-wave-3"></div>
                                    <div className="absolute inset-6 bg-black rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom section - Activate button */}
            <div className="flex-shrink-0 w-full max-w-sm mx-auto pb-16 px-8">
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