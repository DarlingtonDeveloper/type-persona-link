import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BRAND_SPECS, LOCAL_STORAGE_KEYS } from '@/constants';

interface WelcomeGifProps {
    onComplete: () => void;
    userCode: string;
}

const WelcomeGif: React.FC<WelcomeGifProps> = ({ onComplete, userCode }) => {
    const [timeLeft, setTimeLeft] = useState(10);
    const [isActivated, setIsActivated] = useState(false);
    const [gifLoaded, setGifLoaded] = useState(false);
    const [gifError, setGifError] = useState(false);
    const [logoLoaded, setLogoLoaded] = useState(false);
    const [logoError, setLogoError] = useState(false);

    // Track video and activate button after 10 seconds
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
        if (!isActivated) return; // Prevent activation when disabled

        try {
            localStorage.setItem(LOCAL_STORAGE_KEYS.WELCOME_GIF_VIEWED, 'true');
        } catch (error) {
            console.warn('Could not save welcome viewed status:', error);
        }
        onComplete();
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            {!gifError ? (
                <>
                    {/* Full-screen background video */}
                    <video
                        src="/StartingGif.mov"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
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
                            setTimeout(() => setIsActivated(true), 5000);
                        }}
                    />

                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>

                    {/* Logo overlay - top center */}
                    {gifLoaded && (
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
                            <div className="w-20 h-20 flex items-center justify-center">
                                {!logoError ? (
                                    <img
                                        src="/whitelogo.png"
                                        alt="E3 Circle Logo"
                                        className="w-full h-full object-contain filter drop-shadow-2xl"
                                        onLoad={() => setLogoLoaded(true)}
                                        onError={() => {
                                            console.warn('Logo failed to load, using fallback');
                                            setLogoError(true);
                                        }}
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-md border-3 border-white rounded-full flex items-center justify-center shadow-2xl">
                                        <span className="text-white text-2xl font-bold tracking-wider drop-shadow-lg">E3</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Loading state overlay */}
                    {!gifLoaded && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-30">
                            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-6"></div>
                            <h1 className="text-white text-2xl font-medium text-center leading-tight px-8">
                                Tap a compatible phone
                            </h1>
                        </div>
                    )}

                    {/* Activate button - always visible, inactive until timer expires */}
                    {gifLoaded && (
                        <div className="absolute bottom-12 left-1/2 z-20" style={{ transform: 'translateX(-50%)' }}>
                            <Button
                                onClick={handleActivate}
                                disabled={!isActivated}
                                className={`text-white font-medium py-4 px-8 rounded-full text-lg transition-all duration-500 backdrop-blur-md border-2 shadow-2xl ${isActivated
                                    ? 'bg-white bg-opacity-30 hover:bg-opacity-40 border-white animate-pulse cursor-pointer'
                                    : 'bg-gray-900 bg-opacity-40 border-gray-500 cursor-not-allowed opacity-60'
                                    }`}
                                style={{ width: '320px' }}
                                size="lg"
                            >
                                {isActivated ? 'Activate' : `Activate (${timeLeft})`}
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                /* Fallback if video fails - full screen alternative */
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center">
                    <div className="text-center text-white px-8">
                        <div className="w-24 h-24 mx-auto mb-8">
                            <div className="w-24 h-24 bg-white bg-opacity-20 backdrop-blur-sm border-4 border-white rounded-full flex items-center justify-center shadow-2xl">
                                <span className="text-white text-3xl font-bold tracking-wider">E3</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-medium leading-tight mb-8">
                            Tap a compatible phone
                        </h1>
                        <div className="nfc-icon w-32 h-32 border-4 border-white rounded-full flex items-center justify-center bg-transparent mx-auto mb-12">
                            <div className="w-16 h-16 relative">
                                <div className="absolute inset-0 border-4 border-white rounded-full animate-ping"></div>
                                <div className="absolute inset-2 border-4 border-white rounded-full animate-ping animation-delay-200"></div>
                                <div className="absolute inset-4 border-4 border-white rounded-full animate-ping animation-delay-400"></div>
                                <div className="absolute inset-6 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <Button
                            onClick={handleActivate}
                            disabled={!isActivated}
                            className={`text-white font-medium py-4 px-8 rounded-full text-lg transition-all duration-500 ${isActivated
                                ? 'bg-white bg-opacity-30 hover:bg-opacity-40 animate-pulse cursor-pointer'
                                : 'bg-gray-900 bg-opacity-40 cursor-not-allowed opacity-60'
                                }`}
                            style={{ width: '320px' }}
                            size="lg"
                        >
                            {isActivated ? 'Activate' : `Activate (${timeLeft})`}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WelcomeGif;