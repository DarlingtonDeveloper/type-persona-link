import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ComponentProps } from "@/types";
import { VALIDATION_RULES } from "@/constants";

interface SocialLinkButtonProps extends ComponentProps {
  label: string;
  icon: LucideIcon;
  href: string;
  isExternal?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
}

const SocialLinkButton: React.FC<SocialLinkButtonProps> = ({
  label,
  icon: Icon,
  href,
  className,
  isExternal = true,
  onClick,
  disabled = false,
  variant = 'default'
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return "bg-transparent border-2 border-linklight/60 text-linkdark hover:bg-linklight/10";
      case 'secondary':
        return "bg-linkdark/60 text-linklight hover:bg-linkdark/80";
      case 'default':
      default:
        return "bg-linklight/90 text-linkdark hover:bg-linklight/95";
    }
  };

  // Validate URL length
  const isValidHref = href && href.length <= VALIDATION_RULES.URL.MAX_LENGTH;

  if (!isValidHref) {
    console.warn(`SocialLinkButton: Invalid or too long URL for ${label}`);
  }

  return (
    <a
      href={isValidHref ? href : '#'}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className={cn(
        "w-full flex items-center justify-between px-8 py-4 rounded-full backdrop-blur-sm shadow-md transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-linkdark/50",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        getVariantClasses(),
        disabled && "pointer-events-none opacity-50",
        className
      )}
      aria-label={`${label} - ${isExternal ? 'Opens in new tab' : 'Internal link'}`}
      aria-disabled={disabled}
    >
      <span className="text-lg font-medium truncate mr-2" title={label}>
        {label}
      </span>
      <Icon size={24} className="flex-shrink-0" aria-hidden="true" />
    </a>
  );
};

export default SocialLinkButton;