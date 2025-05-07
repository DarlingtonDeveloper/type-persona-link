
// Time of day categories
export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

/**
 * Determines the time of day based on the current hour
 * @returns TimeOfDay string representing the current period of the day
 */
export const getTimeOfDay = (): TimeOfDay => {
  const currentHour = new Date().getHours();
  
  if (currentHour >= 5 && currentHour < 8) {
    return 'dawn';
  } else if (currentHour >= 8 && currentHour < 12) {
    return 'morning';
  } else if (currentHour >= 12 && currentHour < 17) {
    return 'afternoon';
  } else if (currentHour >= 17 && currentHour < 21) {
    return 'evening';
  } else {
    return 'night';
  }
};

/**
 * Returns background styles for the current time of day
 */
export const getBackgroundStyles = (): { 
  overlayClass: string;
  backgroundImage: string;
} => {
  const timeOfDay = getTimeOfDay();
  
  switch (timeOfDay) {
    case 'dawn':
      return {
        overlayClass: 'bg-gradient-to-b from-indigo-900/60 via-purple-600/50 to-pink-400/40',
        backgroundImage: "url('/lovable-uploads/78206403-6ad4-48f7-87c1-e2452ffef4f9.png')",
      };
    case 'morning':
      return {
        overlayClass: 'bg-gradient-to-b from-blue-500/50 via-sky-400/40 to-cyan-200/30',
        backgroundImage: "url('/lovable-uploads/78206403-6ad4-48f7-87c1-e2452ffef4f9.png')",
      };
    case 'afternoon':
      return {
        overlayClass: 'bg-gradient-to-b from-blue-400/40 via-sky-300/30 to-amber-200/30',
        backgroundImage: "url('/lovable-uploads/78206403-6ad4-48f7-87c1-e2452ffef4f9.png')",
      };
    case 'evening':
      return {
        overlayClass: 'bg-gradient-to-b from-orange-500/50 via-red-600/40 to-purple-800/60',
        backgroundImage: "url('/lovable-uploads/78206403-6ad4-48f7-87c1-e2452ffef4f9.png')",
      };
    case 'night':
    default:
      return {
        overlayClass: 'bg-gradient-to-b from-violet-950/70 via-indigo-900/60 to-blue-950/80',
        backgroundImage: "url('/lovable-uploads/78206403-6ad4-48f7-87c1-e2452ffef4f9.png')",
      };
  }
};
