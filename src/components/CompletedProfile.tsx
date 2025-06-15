import React from "react";
import DynamicBackground from "@/components/DynamicBackground";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SocialLinkButton from "@/components/SocialLinkButton";
import TypewriterBio from "@/components/TypewriterBio";
import { getTimeOfDay } from "@/utils/timeUtils";
import { HelpCircle, Heart, MapPin, Music, Palette, ExternalLink, FileText } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { User, UserLink } from "@/types";
import { APP_CONFIG, SOCIAL_PLATFORMS } from "@/constants";

interface CompletedProfileProps {
    user: User;
    userLinks: UserLink[];
}

const CompletedProfile: React.FC<CompletedProfileProps> = ({ user, userLinks }) => {
    const getIcon = (iconName: string) => {
        // Enhanced icon mapping with new categories
        const iconMap: { [key: string]: any } = {
            // Social Media
            Instagram: LucideIcons.Instagram,
            Linkedin: LucideIcons.Linkedin,
            Music: LucideIcons.Music, // TikTok
            Twitter: LucideIcons.Twitter,
            Facebook: LucideIcons.Facebook,
            Youtube: LucideIcons.Youtube,
            Github: LucideIcons.Github,
            MessageCircle: LucideIcons.MessageCircle, // Generic social

            // Contact
            Globe: LucideIcons.Globe,
            Phone: LucideIcons.Phone,
            Mail: LucideIcons.Mail,

            // Business/Professional
            Briefcase: LucideIcons.Briefcase,
            Laptop: LucideIcons.Laptop,
            ExternalLink: LucideIcons.ExternalLink,
            FileText: LucideIcons.FileText,

            // Personal/Creative
            Palette: LucideIcons.Palette,
            Camera: LucideIcons.Camera,
            Mic: LucideIcons.Mic,
            Video: LucideIcons.Video,
            BookOpen: LucideIcons.BookOpen,

            // Lifestyle
            Dumbbell: LucideIcons.Dumbbell, // Fitness
            Shirt: LucideIcons.Shirt, // Clothing
            Sparkles: LucideIcons.Sparkles, // Beauty
            GraduationCap: LucideIcons.GraduationCap, // Academic
            ShoppingBag: LucideIcons.ShoppingBag,
            Calendar: LucideIcons.Calendar,
            MapPin: LucideIcons.MapPin,
            Heart: LucideIcons.Heart,

            // Default
            Link: LucideIcons.Link
        };

        return iconMap[iconName] || LucideIcons.Link;
    };

    // Enhanced bio texts using new bio_description and interests
    const getBioTexts = () => {
        const texts = [];

        // Use the bio description if available
        if (user.bio_description?.trim()) {
            texts.push(user.bio_description.trim());
        }

        // Personal greeting with name
        if (user.name) {
            const firstName = user.name.split(' ')[0];
            texts.push(`Hi I'm ${firstName}`);
        }

        // Add interests if available
        if (user.interests) {
            try {
                // Parse interests (could be JSON array or comma-separated)
                let interestsArray = [];
                if (user.interests.startsWith('[')) {
                    // JSON format
                    interestsArray = JSON.parse(user.interests);
                } else {
                    // Comma-separated format
                    interestsArray = user.interests.split(',').map(s => s.trim()).filter(Boolean);
                }

                if (interestsArray.length > 0) {
                    // Create interest-based bio text
                    if (interestsArray.length === 1) {
                        texts.push(`Passionate about ${interestsArray[0]}`);
                    } else if (interestsArray.length === 2) {
                        texts.push(`Into ${interestsArray[0]} and ${interestsArray[1]}`);
                    } else {
                        texts.push(`Love ${interestsArray[0]}, ${interestsArray[1]} & ${interestsArray[2]}`);
                    }
                }
            } catch (error) {
                console.warn('Error parsing user interests:', error);
            }
        }

        // Professional info
        if (user.job_title && user.job_category) {
            texts.push(`${user.job_title} in ${user.job_category}`);
        } else if (user.job_category) {
            const formattedCategory = user.job_category
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            texts.push(`Working in ${formattedCategory}`);
        }

        // Time-based greeting
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

        // Location-based message if postcode is available
        if (user.postcode) {
            texts.push(`Based in ${user.postcode}`);
        }

        // Relationship status fun messages
        if (user.relationship_status === 'single') {
            texts.push("Single and ready to network!");
        } else if (user.relationship_status === 'married') {
            texts.push("Happily married and connecting!");
        }

        // Eye color fun facts (occasionally)
        if (user.eye_color && Math.random() > 0.7) {
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

    // Get user's initials for avatar fallback
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
        .filter(link => link.url && link.label)
        .sort((a, b) => a.display_order - b.display_order);

    // Enhanced link detection for better icons using URL patterns
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

        // Check for email patterns
        if (url.includes('mailto:') || url.includes('@')) return getIcon('Mail');

        // Check for phone patterns  
        if (url.includes('tel:') || url.includes('phone')) return getIcon('Phone');

        // Check for specific link types by category name
        const categoryName = link.category?.name?.toLowerCase() || '';
        if (categoryName.includes('email')) return getIcon('Mail');
        if (categoryName.includes('phone')) return getIcon('Phone');
        if (categoryName.includes('portfolio') || categoryName.includes('cv')) return getIcon('FileText');
        if (categoryName.includes('affiliation')) return getIcon('ExternalLink');
        if (categoryName.includes('business')) return getIcon('Briefcase');
        if (categoryName.includes('song') || categoryName.includes('music')) return getIcon('Music');
        if (categoryName.includes('restaurant') || categoryName.includes('location')) return getIcon('MapPin');
        if (categoryName.includes('art') || categoryName.includes('creative')) return getIcon('Palette');

        // Fall back to category icon
        return getIcon(link.category?.icon_name || 'Link');
    };

    const handleHelpClick = () => {
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
        window.location.href = '/';
    };

    return (
        <DynamicBackground>
            <div className="w-full min-h-screen flex flex-col items-center justify-between">
                <div className="w-full max-w-md mx-auto px-4 py-8">
                    {/* Profile Avatar/Photo */}
                    <div className="w-24 h-24 mx-auto mb-8">
                        {user.profile_photo_url ? (
                            <Avatar className="w-24 h-24 border-2 border-brand-white/20 shadow-lg">
                                <AvatarImage
                                    src={user.profile_photo_url}
                                    alt={user.name || `${user.user_code} Profile`}
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-brand-black/80 text-brand-white text-2xl">
                                    {getUserInitials()}
                                </AvatarFallback>
                            </Avatar>
                        ) : (
                            <div className="w-24 h-24 bg-brand-black/80 rounded-full mx-auto flex items-center justify-center border-2 border-brand-white/20 shadow-lg backdrop-blur-sm">
                                <span className="text-brand-white text-3xl font-bold">
                                    {getUserInitials()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Bio with Typewriter Effect */}
                    <div className="bg-brand-white/90 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-brand-black/10">
                        <TypewriterBio
                            textArray={getBioTexts()}
                            typingDelay={100}
                            erasingDelay={50}
                            newTextDelay={2000}
                            showCursor={true}
                            loop={true}
                            className="text-brand-black"
                        />
                    </div>

                    {/* Enhanced Links Container */}
                    <div className="bg-brand-black/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                        <div className="flex flex-col space-y-4">
                            {sortedLinks.map((link) => {
                                const IconComponent = getEnhancedIcon(link);
                                return (
                                    <div key={link.id} className="space-y-1">
                                        <SocialLinkButton
                                            label={link.label}
                                            icon={IconComponent}
                                            href={link.url}
                                            isExternal={true}
                                            variant="default"
                                            className="bg-brand-white/90 text-brand-black hover:bg-brand-white/95"
                                        />
                                        {/* Show link description if available */}
                                        {link.description && (
                                            <p className="text-brand-white/70 text-sm px-4 italic">
                                                {link.description}
                                            </p>
                                        )}
                                    </div>
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
                                    className="bg-brand-black/60 text-brand-white hover:bg-brand-black/80"
                                />
                            )}

                            {user.email && (
                                <SocialLinkButton
                                    label="Email"
                                    icon={LucideIcons.Mail}
                                    href={`mailto:${user.email}`}
                                    isExternal={false}
                                    variant="secondary"
                                    className="bg-brand-black/60 text-brand-white hover:bg-brand-black/80"
                                />
                            )}

                            {/* Enhanced empty state */}
                            {sortedLinks.length === 0 && !user.mobile && !user.email && (
                                <div className="text-center text-brand-white/60 py-8">
                                    <LucideIcons.LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium mb-2">No links added yet</p>
                                    <p className="text-sm">This profile is still being set up</p>
                                </div>
                            )}
                        </div>

                        {/* Show interests as tags if available */}
                        {user.interests && (
                            <div className="mt-6 pt-4 border-t border-brand-white/20">
                                <h3 className="text-brand-white/80 text-sm font-medium mb-3">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(() => {
                                        try {
                                            const interestsArray = user.interests.startsWith('[')
                                                ? JSON.parse(user.interests)
                                                : user.interests.split(',').map(s => s.trim()).filter(Boolean);

                                            return interestsArray.map((interest: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-brand-white/20 text-brand-white text-xs rounded-full"
                                                >
                                                    {interest}
                                                </span>
                                            ));
                                        } catch {
                                            return null;
                                        }
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Enhanced Navigation Bar */}
                <div className="w-full bg-brand-black/80 backdrop-blur-sm shadow-lg py-4">
                    <div className="container max-w-md mx-auto px-4">
                        <div className="flex justify-between items-center">
                            {/* Logo - clickable to go home */}
                            <button
                                onClick={handleLogoClick}
                                className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity"
                                aria-label={`Go to ${APP_CONFIG.NAME} home`}
                            >
                                <Avatar className="rounded-full border-2 border-brand-white/20">
                                    <AvatarImage
                                        src="/lovable-uploads/c1d031b7-7f09-4258-9e27-b183cf8ada53.png"
                                        alt={`${APP_CONFIG.NAME} Logo`}
                                        className="bg-brand-black rounded-full"
                                    />
                                    <AvatarFallback className="bg-brand-black rounded-full text-brand-white text-sm font-bold">
                                        E3
                                    </AvatarFallback>
                                </Avatar>
                            </button>

                            {/* Enhanced User Info Display */}
                            <div className="text-center">
                                <p className="text-brand-white/80 text-xs">{APP_CONFIG.NAME}</p>
                                <p className="text-brand-white font-mono text-sm" title={`User Code: ${user.user_code}`}>
                                    {user.user_code}
                                </p>
                                {user.name && (
                                    <p className="text-brand-white/60 text-xs truncate max-w-[120px]" title={user.name}>
                                        {user.name.split(' ')[0]}
                                    </p>
                                )}
                                {/* Show location if available */}
                                {user.postcode && (
                                    <p className="text-brand-white/40 text-xs" title={`Location: ${user.postcode}`}>
                                        {user.postcode}
                                    </p>
                                )}
                            </div>

                            {/* Help Icon */}
                            <div className="w-12 h-12 flex items-center justify-center">
                                <button
                                    className="w-10 h-10 rounded-full bg-brand-black/80 flex items-center justify-center border-2 border-brand-white/20 hover:bg-brand-black/90 transition-colors"
                                    aria-label="Help and Support"
                                    onClick={handleHelpClick}
                                >
                                    <HelpCircle className="text-brand-white" size={20} />
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