import React from "react";
import { User, UserLink } from "@/pages/UserProfile";
import DynamicBackground from "@/components/DynamicBackground";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SocialLinkButton from "@/components/SocialLinkButton";
import TypewriterBio from "@/components/TypewriterBio";
import { getTimeOfDay } from "@/utils/timeUtils";
import { HelpCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface CompletedProfileProps {
    user: User;
    userLinks: UserLink[];
}

const CompletedProfile: React.FC<CompletedProfileProps> = ({ user, userLinks }) => {
    const getIcon = (iconName: string) => {
        // Map icon names to actual Lucide icons
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
            Dumbbell: LucideIcons.Dumbbell,
            Shirt: LucideIcons.Shirt,
            Sparkles: LucideIcons.Sparkles,
            Briefcase: LucideIcons.Briefcase,
            Laptop: LucideIcons.Laptop,
            Palette: LucideIcons.Palette,
            GraduationCap: LucideIcons.GraduationCap,
            Link: LucideIcons.Link
        };

        return iconMap[iconName] || LucideIcons.Link;
    };

    // Create bio texts based on user data
    const getBioTexts = () => {
        const texts = [];

        if (user.name) {
            texts.push(`Hi I'm ${user.name.split(' ')[0]}`);
        }

        if (user.job_title && user.job_category) {
            texts.push(`${user.job_title} in ${user.job_category}`);
        } else if (user.job_category) {
            texts.push(`Working in ${user.job_category}`);
        }

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

        texts.push(getTimeBasedGreeting());

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

    // Sort links by display order
    const sortedLinks = [...userLinks].sort((a, b) => a.display_order - b.display_order);

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
                                    alt={user.name || 'Profile'}
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
                        <TypewriterBio textArray={getBioTexts()} />
                    </div>

                    {/* Links Container */}
                    <div className="bg-[#222222]/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                        <div className="flex flex-col space-y-4">
                            {sortedLinks.map((link) => {
                                const IconComponent = getIcon(link.category?.icon_name || 'Link');
                                return (
                                    <SocialLinkButton
                                        key={link.id}
                                        label={link.label}
                                        icon={IconComponent}
                                        href={link.url}
                                    />
                                );
                            })}

                            {/* Contact link if mobile is provided */}
                            {user.mobile && (
                                <SocialLinkButton
                                    label="Mobile"
                                    icon={LucideIcons.Phone}
                                    href={`tel:${user.mobile}`}
                                />
                            )}

                            {/* Email link if provided */}
                            {user.email && (
                                <SocialLinkButton
                                    label="Email"
                                    icon={LucideIcons.Mail}
                                    href={`mailto:${user.email}`}
                                />
                            )}

                            {sortedLinks.length === 0 && !user.mobile && !user.email && (
                                <div className="text-center text-linklight/60 py-4">
                                    <p>No links added yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Bar */}
                <div className="w-full bg-[#222222]/70 backdrop-blur-sm shadow-lg py-4">
                    <div className="container max-w-md mx-auto px-4">
                        <div className="flex justify-between items-center">
                            {/* Logo */}
                            <div className="w-12 h-12 flex items-center justify-center">
                                <Avatar className="rounded-full border-2 border-linklight/20">
                                    <AvatarImage
                                        src="/lovable-uploads/c1d031b7-7f09-4258-9e27-b183cf8ada53.png"
                                        alt="E3 Logo"
                                        className="bg-black rounded-full"
                                    />
                                    <AvatarFallback className="bg-black rounded-full text-linklight">
                                        E3
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* User Code Display */}
                            <div className="text-center">
                                <p className="text-linklight/80 text-xs">E3 Circle</p>
                                <p className="text-linklight font-mono text-sm">{user.user_code}</p>
                            </div>

                            {/* Help Icon */}
                            <div className="w-12 h-12 flex items-center justify-center">
                                <button
                                    className="w-10 h-10 rounded-full bg-linkdark/80 flex items-center justify-center border-2 border-linklight/20"
                                    aria-label="Help"
                                    onClick={() => {
                                        // Add help functionality here
                                        alert('For help, contact support at help@e3circle.com');
                                    }}
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