
import React from "react";
import { Instagram, Linkedin, Phone, Globe } from "lucide-react";
import TypewriterBio from "@/components/TypewriterBio";
import SocialLinkButton from "@/components/SocialLinkButton";

const Index = () => {
  const bioTexts = [
    "Hi I'm Chris, currently studying UI & UX design",
    "Developer and designer with a passion for user experience",
    "Creating beautiful digital experiences"
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-linkdark overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: "url('/lovable-uploads/78206403-6ad4-48f7-87c1-e2452ffef4f9.png')",
        }}
      >
        <div className="absolute inset-0 bg-linkdark/60"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        {/* Profile Initial/Logo */}
        <div className="w-24 h-24 bg-linkdark/80 rounded-xl mx-auto mb-8 flex items-center justify-center border-2 border-linklight/20 shadow-lg">
          <span className="text-linklight text-5xl font-bold">C</span>
        </div>

        {/* Bio with Typewriter Effect */}
        <div className="bg-linklight rounded-xl p-6 mb-8">
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
          <div className="text-center text-linklight/50 text-sm mt-2 mb-4">
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
  );
};

export default Index;
