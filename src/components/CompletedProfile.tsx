import React from "react";
import DynamicBackground from "@/components/DynamicBackground";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SocialLinkButton from "@/components/SocialLinkButton";
import TypewriterBio from "@/components/TypewriterBio";
import { getTimeOfDay } from "@/utils/timeUtils";
import { HelpCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { User, UserLink } from "@/types";
import { APP_CONFIG, SOCIAL_PLATFORMS } from "@/constants";

interface CompletedProfileProps {
    user: User;
    userLinks: UserLink[];
}

const CompletedProfile: React.FC<CompletedProfileProps> = ({ user, userLinks }) => {
    const getIcon = (iconName: string) => {
        // Map icon names to actual Lucide icons using centralized platform data
        const iconMap: { [key: string]: any } = {
            Instagram: LucideIcons.Instagram,
            Linkedin: LucideIcons.Linkedin,
            Music: LucideIcons.Music, // TikTok
            Twitter: LucideIcons.Twitter,
            Facebook: LucideIcons.Facebook,
            Youtube: LucideIcons.Youtube,
            Globe: LucideIcons.Globe,
            Phone: LucideIcons.Phone,
            Mail: LucideIcons.Mail,
            Dumbbell: LucideIcons.Dumbbell, // Fitness
            Shirt: LucideIcons.Shirt, // Clothing
            Sparkles: LucideIcons.Sparkles, // Beauty
            Briefcase: LucideIcons.Briefcase, // Business
            Laptop: LucideIcons.Laptop, // Technology
            Palette: LucideIcons.Palette, // Creative & Art
            GraduationCap: LucideIcons.GraduationCap, // Academic
            Link: LucideIcons.Link, // Other/Default
            Github: LucideIcons.Github,
            MessageCircle: LucideIcons.MessageCircle, // Generic social
            Camera: LucideIcons.Camera, // Photography
            Heart: LucideIcons.Heart, // Personal/Dating
            ShoppingBag: LucideIcons.ShoppingBag, // Shopping/Commerce
            BookOpen: LucideIcons.BookOpen, // Education/Blog
            Mic: LucideIcons.Mic, // Podcast/Audio
            Video: LucideIcons.Video, // Video content
            Calendar: LucideIcons.Calendar, // Events/Calendar
            MapPin: LucideIcons.MapPin // Location-based
        };

        return iconMap[iconName] || LucideIcons.Link;
    };

    // Create bio texts based on user data using centralized logic
    const getBioTexts = () => {
        const texts = [];

        // Personal greeting
        if (user.name) {
            const firstName = user.name.split(' ')[0];
            texts.push(`Hi I'm ${firstName}`);
        }

        // Professional info
        if (user.job_title && user.job_category) {
            texts.push(`${user.job_title} in ${user.job_category}`);
        } else if (user.job_category) {
            // Capitalize job category for display
            const formattedCategory = user.job_category
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            texts.push(`Working in ${formattedCategory}`);
        }

        // Time-based greeting using centralized time logic
        const getTimeBasedGreeting = () => {
            const timeOfDay = getTimeOfDay();
            const greetings = {
                'dawn': "Early bird? Let's connect",
                'morning': "Good morning! Let's connect",
                'afternoon': "Good afternoon! Let's connect",
                'evening': "Good evening! Let's connect",
                'night': "Night owl? Let's connect"
            };
            return greetings[timeOfDay] || "Let's connect";
        };

        texts.push(getTimeBasedGreeting());

        // Add personalized content based on user data
        if (user.relationship_status === 'single') {
            texts.push("Single and ready to network!");
        } else if (user.relationship_status === 'married') {
            texts.push("Happily married and connecting!");
        }

        // Add fun facts based on user's eye color (if they want to share)
        if (user.eye_color && Math.random() > 0.7) { // 30% chance to show
            const eyeColorMessages = {
                'brown': "Brown-eyed optimist",
                'blue': "Blue-eyed dreamer",
                'green': "Green-eyed go-getter",
                'hazel': "Hazel-eyed hustler",
                'gray': "Gray-eyed visionary",
                'amber': "Amber-eyed achiever"
            };
            const message = eyeColorMessages[user.eye_color as keyof typeof eyeColorMessages];
            if (message) texts.push(message);
        }

        return texts.length > 0 ? texts : ["Welcome to my profile", "Let's connect"];
    };

    // Get user's initials for avatar fallback using centralized logic
    const getUserInitials = () => {
        if (user.name) {
            return user.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return user.user_code.slice(0, 2);
    };

    // Sort links by display order and filter out invalid ones
    const sortedLinks = [...userLinks]
        .filter(link => link.url && link.label) // Only show valid links
        .sort((a, b) => a.display_order - b.display_order);

    // Enhanced link detection for better icons
    const getEnhancedIcon = (link: UserLink) => {
        const url = link.url.toLowerCase();

        // Check URL for platform-specific patterns
        if (url.includes(SOCIAL_PLATFORMS.INSTAGRAM)) return getIcon('Instagram');
        if (url.includes(SOCIAL_PLATFORMS.LINKEDIN)) return getIcon('Linkedin');
        if (url.includes(SOCIAL_PLATFORMS.TIKTOK)) return getIcon('Music');
        if (url.includes(SOCIAL_PLATFORMS.TWITTER)) return getIcon('Twitter');
        if (url.includes(SOCIAL_PLATFORMS.FACEBOOK)) return getIcon('Facebook');
        if (url.includes(SOCIAL_PLATFORMS.YOUTUBE)) return getIcon('Youtube');
        if (url.includes(SOCIAL_PLATFORMS.GITHUB)) return getIcon('Github');
        if (url.includes(SOCIAL_PLATFORMS.BEHANCE)) return getIcon('Palette');
        if (url.includes(SOCIAL_PLATFORMS.DRIBBBLE)) return getIcon('Palette');

        // Fall back to category icon
        return getIcon(link.category?.icon_name || 'Link');
    };

    const handleHelpClick = () => {
        // Enhanced help with more information
        const helpMessage = `
${APP_CONFIG.NAME} Help & Support

For assistance with:
• Profile questions
• Link management  
• Technical issues
• Account concerns

Contact us at: ${APP_CONFIG.SUPPORT_EMAIL}

Or visit our help center for FAQs and guides.
        `.trim();

        alert(helpMessage);
    };

    const handleLogoClick = () => {
        // Navigate to main landing page
        window.location.href = '/';
    };

    return (
        <DynamicBackground>
            {/* Content Container */}
            <div className="w-full min-h-screen flex flex-col items-center justify-between">
                <div className="w-full max-w-md mx-auto px-4 py-8">
                    {/* Profile Avatar/Photo */}
                    <div className="w-24 h-24 mx-auto mb-8">
                        {user.profile_photo_url ? (
                            <Avatar className="w-24 h-24 border-2 border-linklight/20 shadow-lg">
                                <AvatarImage
                                    src={user.profile_photo_url}
                                    alt={user.name || `${user.user_code} Profile`}
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-linkdark/80 text-linklight text-2xl">
                                    {getUserInitials()}
                                </AvatarFallback>
                            </Avatar>
                        ) : (
                            <div className="w-24 h-24 bg-linkdark/80 rounded-full mx-auto flex items-center justify-center border-2 border-linklight/20 shadow-lg backdrop-blur-sm">
                                <span className="text-linklight text-3xl font-bold">
                                    {getUserInitials()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Bio with Typewriter Effect */}
                    <div className="bg-linklight/90 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg">
                        <TypewriterBio
                            textArray={getBioTexts()}
                            typingDelay={100}
                            erasingDelay={50}
                            newTextDelay={2000}
                            showCursor={true}
                            loop={true}
                        />
                    </div>

                    {/* Links Container */}
                    <div className="bg-[#222222]/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                        <div className="flex flex-col space-y-4">
                            {sortedLinks.map((link) => {
                                const IconComponent = getEnhancedIcon(link);
                                return (
                                    <SocialLinkButton
                                        key={link.id}
                                        label={link.label}
                                        icon={IconComponent}
                                        href={link.url}
                                        isExternal={true}
                                        variant="default"
                                    />
                                );
                            })}

                            {/* Contact links if provided */}
                            {user.mobile && (
                                <SocialLinkButton
                                    label="Mobile"
                                    icon={LucideIcons.Phone}
                                    href={`tel:${user.mobile}`}
                                    isExternal={false}
                                    variant="secondary"
                                />
                            )}

                            {user.email && (
                                <SocialLinkButton
                                    label="Email"
                                    icon={LucideIcons.Mail}
                                    href={`mailto:${user.email}`}
                                    isExternal={false}
                                    variant="secondary"
                                />
                            )}

                            {/* Empty state */}
                            {sortedLinks.length === 0 && !user.mobile && !user.email && (
                                <div className="text-center text-linklight/60 py-8">
                                    <LucideIcons.LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium mb-2">No links added yet</p>
                                    <p className="text-sm">This profile is still being set up</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Enhanced Navigation Bar */}
                <div className="w-full bg-[#222222]/70 backdrop-blur-sm shadow-lg py-4">
                    <div className="container max-w-md mx-auto px-4">
                        <div className="flex justify-between items-center">
                            {/* Logo - clickable to go home */}
                            <button
                                onClick={handleLogoClick}
                                className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity"
                                aria-label={`Go to ${APP_CONFIG.NAME} home`}
                            >
                                <Avatar className="rounded-full border-2 border-linklight/20">
                                    <AvatarImage
                                        src="/lovable-uploads/c1d031b7-7f09-4258-9e27-b183cf8ada53.png"
                                        alt={`${APP_CONFIG.NAME} Logo`}
                                        className="bg-black rounded-full"
                                    />
                                    <AvatarFallback className="bg-black rounded-full text-linklight text-sm font-bold">
                                        E3
                                    </AvatarFallback>
                                </Avatar>
                            </button>

                            {/* User Info Display */}
                            <div className="text-center">
                                <p className="text-linklight/80 text-xs">{APP_CONFIG.NAME}</p>
                                <p className="text-linklight font-mono text-sm" title={`User Code: ${user.user_code}`}>
                                    {user.user_code}
                                </p>
                                {user.name && (
                                    <p className="text-linklight/60 text-xs truncate max-w-[120px]" title={user.name}>
                                        {user.name.split(' ')[0]}
                                    </p>
                                )}
                            </div>

                            {/* Help Icon */}
                            <div className="w-12 h-12 flex items-center justify-center">
                                <button
                                    className="w-10 h-10 rounded-full bg-linkdark/80 flex items-center justify-center border-2 border-linklight/20 hover:bg-linkdark/90 transition-colors"
                                    aria-label="Help and Support"
                                    onClick={handleHelpClick}
                                >
                                    <HelpCircle className="text-linklight" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DynamicBackground>
    );
};

export default CompletedProfile;