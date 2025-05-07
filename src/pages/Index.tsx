
import React from "react";
import { Instagram, Linkedin, Phone, Globe } from "lucide-react";
import TypewriterBio from "@/components/TypewriterBio";
import SocialLinkButton from "@/components/SocialLinkButton";
import DynamicBackground from "@/components/DynamicBackground";
import { getTimeOfDay } from "@/utils/timeUtils";

const Index = () => {
  const bioTexts = [
    "Hi I'm Chris, currently studying UI & UX design",
    "Developer and designer with a passion for user experience",
    "Creating beautiful digital experiences"
  ];

  // Add a time-based greeting
  const getTimeBasedGreeting = () => {
    const timeOfDay = getTimeOfDay();
    switch (timeOfDay) {
      case 'dawn': return "Early bird? Let's connect";
      case 'morning': return "Good morning! Let's connect";
      case 'afternoon': return "Good afternoon! Let's connect";
      case 'evening': return "Good evening! Let's connect";
      case 'night': return "Night owl? Let's connect";
      default: return "Let's connect";
    }
  };

  bioTexts.push(getTimeBasedGreeting());

  return (
    <DynamicBackground>
      {/* Content Container */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 py-8">
          {/* Profile Initial/Logo */}
          <div className="w-24 h-24 bg-linkdark/80 rounded-xl mx-auto mb-8 flex items-center justify-center border-2 border-linklight/20 shadow-lg backdrop-blur-sm">
            <span className="text-linklight text-5xl font-bold">C</span>
          </div>

          {/* Bio with Typewriter Effect */}
          <div className="bg-linklight/90 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg">
            <TypewriterBio textArray={bioTexts} />
          </div>

          {/* Links Container */}
          <div className="flex flex-col space-y-4">
            <SocialLinkButton 
              label="Instagram" 
              icon={Instagram} 
              href="https://instagram.com" 
            />
            <SocialLinkButton 
              label="LinkedIn" 
              icon={Linkedin} 
              href="https://linkedin.com" 
            />
            <SocialLinkButton 
              label="Mobile number" 
              icon={Phone} 
              href="tel:+123456789" 
            />
            <div className="text-center text-linklight/80 text-sm mt-2 mb-4 backdrop-blur-sm">
              Supplied by
            </div>
            <SocialLinkButton 
              label="Your agency" 
              icon={Globe} 
              href="https://example.com" 
              className="border border-linklight/20" 
            />
          </div>
        </div>
      </div>
    </DynamicBackground>
  );
};

export default Index;
