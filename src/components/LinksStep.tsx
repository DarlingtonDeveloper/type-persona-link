import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Instagram,
    Twitter,
    Linkedin,
    Facebook,
    Music,
    Globe,
    Mail,
    Phone,
    Briefcase,
    DollarSign,
    Link,
    Share2,
    User
} from 'lucide-react';

const LINK_CATEGORIES = [
    { type: 'social-media', icon: Share2, label: 'Social Media' },
    { type: 'email', icon: Mail, label: 'Email' },
    { type: 'mobile', icon: Phone, label: 'Mobile' },
    { type: 'website', icon: Globe, label: 'Website' },
    { type: 'business', icon: Briefcase, label: 'Business' },
    { type: 'affiliate', icon: DollarSign, label: 'Affiliate' }
];

const SOCIAL_PLATFORMS = [
    { name: 'Instagram', icon: Instagram, placeholder: '@username' },
    { name: 'Twitter', icon: Twitter, placeholder: '@username' },
    { name: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/username' },
    { name: 'Facebook', icon: Facebook, placeholder: 'facebook.com/username' },
    { name: 'TikTok', icon: Music, placeholder: '@username' }
];

interface UserLink {
    type?: string;
    platform?: string;
    username?: string;
    email?: string;
    phone?: string;
    url?: string;
}

interface Props {
    formData: { links: UserLink[] };
    onFormDataChange: (field: string, value: any) => void;
    onNext: () => void;
    onBack: () => void;
    loading: boolean;
}

const LinksStep: React.FC<Props> = ({ formData, onFormDataChange, onNext, onBack, loading }) => {
    // Initialize with completely empty objects
    const links = formData.links && formData.links.length === 3
        ? formData.links
        : [{}, {}, {}];

    const updateLink = (index: number, data: Partial<UserLink>) => {
        const updated = [...links];
        updated[index] = { ...updated[index], ...data };
        onFormDataChange('links', updated);
    };

    const selectCategory = (index: number, categoryType: string) => {
        updateLink(index, {
            type: categoryType,
            platform: '',
            username: '',
            email: '',
            phone: '',
            url: ''
        });
    };

    const selectPlatform = (index: number, platformName: string) => {
        updateLink(index, { platform: platformName });
    };

    const isLinkValid = (link: UserLink) => {
        switch (link.type) {
            case 'social-media':
                return !!link.platform && !!link.username;
            case 'email':
                return !!link.email && /\S+@\S+\.\S+/.test(link.email);
            case 'mobile':
                return !!link.phone && link.phone.length >= 10;
            case 'website':
            case 'business':
            case 'affiliate':
                return !!link.url && (link.url.includes('http') || link.url.includes('www') || link.url.includes('.com'));
            default:
                return false;
        }
    };

    const isValid = () => links.every(isLinkValid);
    const filledFields = links.filter(isLinkValid).length;

    const getInputPlaceholder = (link: UserLink) => {
        if (link.type === 'social-media' && link.platform) {
            const platform = SOCIAL_PLATFORMS.find(p => p.name === link.platform);
            return platform?.placeholder || '@username';
        }
        switch (link.type) {
            case 'email': return 'your@email.com';
            case 'mobile': return '+1 234 567 8900';
            case 'website': return 'yourwebsite.com';
            case 'business': return 'yourbusiness.com';
            case 'affiliate': return 'affiliate-link.com';
            default: return '';
        }
    };

    const getInputValue = (link: UserLink) => {
        switch (link.type) {
            case 'social-media': return link.username || '';
            case 'email': return link.email || '';
            case 'mobile': return link.phone || '';
            default: return link.url || '';
        }
    };

    const handleInputChange = (index: number, value: string, link: UserLink) => {
        switch (link.type) {
            case 'social-media':
                updateLink(index, { username: value });
                break;
            case 'email':
                updateLink(index, { email: value });
                break;
            case 'mobile':
                updateLink(index, { phone: value });
                break;
            default:
                updateLink(index, { url: value });
                break;
        }
    };

    const renderLinkContainer = (index: number, title: string, iconComponent: any) => {
        const link = links[index] || {};
        const IconComponent = iconComponent;

        return (
            <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
                <div className="e3-container e3-container-hover">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-white to-white/80 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                            <IconComponent className="h-8 w-8 text-black" />
                        </div>
                        <h3 className="text-2xl font-light text-white tracking-wide">{title}</h3>
                        <div className="w-12 h-px bg-white/20 mx-auto mt-2"></div>
                    </div>

                    <div className="space-y-6">
                        {/* Category Selection - Always show if no type or empty type */}
                        {(!link.type || link.type === '') ? (
                            <div className="space-y-4">
                                <p className="text-sm text-white/60 text-center">Choose link type</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {LINK_CATEGORIES.map((category) => {
                                        const CategoryIcon = category.icon;
                                        return (
                                            <Button
                                                key={category.type}
                                                onClick={() => selectCategory(index, category.type)}
                                                variant="ghost"
                                                className="h-16 flex-col gap-2 bg-white/15 border-2 border-white/30 rounded-xl hover:bg-white/25 hover:border-white/50 transition-all duration-300 text-white hover:text-white hover:scale-105"
                                            >
                                                <CategoryIcon size={20} />
                                                <span className="text-xs">{category.label}</span>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Platform Selection for Social Media */}
                                {link.type === 'social-media' && (!link.platform || link.platform === '') && (
                                    <div className="space-y-4">
                                        <p className="text-sm text-white/60 text-center">Choose platform</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {SOCIAL_PLATFORMS.map((platform) => {
                                                const PlatformIcon = platform.icon;
                                                return (
                                                    <Button
                                                        key={platform.name}
                                                        onClick={() => selectPlatform(index, platform.name)}
                                                        variant="ghost"
                                                        className="h-16 flex-col gap-2 bg-white/15 border-2 border-white/30 rounded-xl hover:bg-white/25 hover:border-white/50 transition-all duration-300 text-white hover:text-white hover:scale-105"
                                                    >
                                                        <PlatformIcon size={20} />
                                                        <span className="text-xs">{platform.name}</span>
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Input Field */}
                                {(link.type !== 'social-media' || (link.platform && link.platform !== '')) && (
                                    <div className="relative">
                                        <Label className="absolute -top-2 left-4 bg-black px-2 text-sm font-medium text-white/70 z-10">
                                            {link.type === 'social-media' ? 'Username' :
                                                link.type === 'email' ? 'Email Address' :
                                                    link.type === 'mobile' ? 'Phone Number' : 'URL'}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type={link.type === 'email' ? 'email' : link.type === 'mobile' ? 'tel' : 'text'}
                                                value={getInputValue(link)}
                                                onChange={(e) => handleInputChange(index, e.target.value, link)}
                                                placeholder={getInputPlaceholder(link)}
                                                className="h-14 bg-transparent border-2 border-white/10 rounded-2xl text-lg text-white focus:border-white focus:ring-0 transition-all duration-300 hover:border-white/30 pl-12"
                                            />
                                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                                        </div>
                                    </div>
                                )}

                                {/* Reset button for selected category */}
                                <div className="flex justify-center">
                                    <Button
                                        onClick={() => {
                                            updateLink(index, {});
                                            // Force re-render by updating the links array
                                            const resetLinks = [...links];
                                            resetLinks[index] = {};
                                            onFormDataChange('links', resetLinks);
                                        }}
                                        variant="ghost"
                                        className="text-xs text-white/40 hover:text-white/60 hover:bg-transparent p-2"
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
            <div className="max-w-7xl mx-auto">
                {/* CIRCULAR PROGRESS COUNTER */}
                <div className="flex justify-center mb-12">
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                className="text-white/20"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray={`${(filledFields / 3) * 283} 283`}
                                className="text-white transition-all duration-500 ease-in-out"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-white/60 tracking-wider">
                                {filledFields}/3
                            </span>
                        </div>
                    </div>
                </div>

                {/* THREE HORIZONTAL CONTAINERS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {renderLinkContainer(0, "Link One", Link)}
                    {renderLinkContainer(1, "Link Two", Share2)}
                    {renderLinkContainer(2, "Link Three", Globe)}
                </div>

                {/* Single Continue Button - Welcome Gif Style */}
                <div className="flex justify-center">
                    <Button
                        onClick={onNext}
                        disabled={loading || !isValid()}
                        className={`h-12 px-8 rounded-full transition-all duration-300 ${isValid() && !loading
                            ? 'bg-gray-600 hover:bg-gray-500 animate-pulse cursor-pointer text-white'
                            : 'bg-gray-800 cursor-not-allowed opacity-50 text-white'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Saving
                            </div>
                        ) : (
                            'Continue'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LinksStep;