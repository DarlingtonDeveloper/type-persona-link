
import React, { useState, useEffect } from 'react';
import { getBackgroundStyles, getTimeOfDay, TimeOfDay } from '@/utils/timeUtils';

interface DynamicBackgroundProps {
  children: React.ReactNode;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ children }) => {
  const [backgroundStyles, setBackgroundStyles] = useState(getBackgroundStyles());
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());

  // Update the background every minute to check for time of day changes
  useEffect(() => {
    const updateBackground = () => {
      const newTimeOfDay = getTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
        setBackgroundStyles(getBackgroundStyles());
      }
    };

    const intervalId = setInterval(updateBackground, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [timeOfDay]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-all duration-1000"
        style={{
          backgroundImage: backgroundStyles.backgroundImage,
        }}
      >
        <div className={`absolute inset-0 transition-all duration-1000 ${backgroundStyles.overlayClass}`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default DynamicBackground;
