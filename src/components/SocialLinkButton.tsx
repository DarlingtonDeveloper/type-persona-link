
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SocialLinkButtonProps {
  label: string;
  icon: LucideIcon;
  href: string;
  className?: string;
}

const SocialLinkButton: React.FC<SocialLinkButtonProps> = ({
  label,
  icon: Icon,
  href,
  className,
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "w-full flex items-center justify-between px-8 py-4 rounded-full bg-linklight/90 backdrop-blur-sm text-linkdark shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-linklight/95",
        className
      )}
    >
      <span className="text-lg font-medium">{label}</span>
      <Icon size={24} />
    </a>
  );
};

export default SocialLinkButton;
