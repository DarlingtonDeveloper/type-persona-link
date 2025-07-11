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
    User,
    MessageSquare
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
    description?: string;  // Added description field
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
            url: '',
            description: ''  // Reset description when changing category
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

    const getDescriptionPlaceholder = (link: UserLink) => {
        switch (link.type) {
            case 'social-media':
                return `e.g., "Check out my ${link.platform || 'social media'}"`;
            case 'email':
                return 'e.g., "Send me an email"';
            case 'mobile':
                return 'e.g., "Call or text me"';
            case 'website':
                return 'e.g., "Visit my website"';
            case 'business':
                return 'e.g., "Check out my business"';
            case 'affiliate':
                return 'e.g., "Get my recommended products"';
            default:
                return 'e.g., "Click to see more"';
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

    const handleDescriptionChange = (index: number, value: string) => {
        updateLink(index, { description: value });
    };

    const validateDescription = (description: string): boolean => {
        if (!description) return true; // Description is optional
        return description.length >= 3 && description.length <= 100;
    };

    const renderLinkContainer = (index: number, title: string, iconComponent: any) => {
        const link = links[index] || {};
        const IconComponent = iconComponent;
        const hasValidMainInput = isLinkValid(link);
        const hasDescription = !!link.description && link.description.trim().length > 0;
        const isDescriptionValid = validateDescription(link.description || '');

        return (
            <div className="bg-brand-black rounded-2xl p-8 backdrop-blur-sm shadow-lg border border-brand-black/20 hover:transform hover:translateY(-2px) transition-all duration-300">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-white to-brand-white/80 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                        <IconComponent className="h-8 w-8 text-brand-black" />
                    </div>
                    <h3 className="text-2xl font-light text-brand-white tracking-wide">{title}</h3>
                    <div className="w-12 h-px bg-brand-white/20 mx-auto mt-2"></div>
                </div>

                <div className="space-y-6">
                    {/* Category Selection - Always show if no type or empty type */}
                    {(!link.type || link.type === '') ? (
                        <div className="space-y-4">
                            <p className="text-sm text-brand-white/60 text-center">Choose link type</p>
                            <div className="grid grid-cols-2 gap-3">
                                {LINK_CATEGORIES.map((category) => {
                                    const CategoryIcon = category.icon;
                                    return (
                                        <Button
                                            key={category.type}
                                            onClick={() => selectCategory(index, category.type)}
                                            variant="ghost"
                                            className="h-16 flex-col gap-2 bg-brand-white/15 border-2 border-brand-white/30 rounded-xl hover:bg-brand-white/25 hover:border-brand-white/50 transition-all duration-300 text-brand-white hover:text-brand-white hover:scale-105"
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
                                    <p className="text-sm text-brand-white/60 text-center">Choose platform</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {SOCIAL_PLATFORMS.map((platform) => {
                                            const PlatformIcon = platform.icon;
                                            return (
                                                <Button
                                                    key={platform.name}
                                                    onClick={() => selectPlatform(index, platform.name)}
                                                    variant="ghost"
                                                    className="h-16 flex-col gap-2 bg-brand-white/15 border-2 border-brand-white/30 rounded-xl hover:bg-brand-white/25 hover:border-brand-white/50 transition-all duration-300 text-brand-white hover:text-brand-white hover:scale-105"
                                                >
                                                    <PlatformIcon size={20} />
                                                    <span className="text-xs">{platform.name}</span>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Main Input Field */}
                            {(link.type !== 'social-media' || (link.platform && link.platform !== '')) && (
                                <>
                                    <div className="relative">
                                        <Label className="absolute -top-2 left-4 bg-brand-black px-2 text-sm font-medium text-brand-white/70 z-10">
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
                                                className="h-14 bg-transparent border-2 border-brand-white/10 rounded-2xl text-lg text-brand-white focus:border-brand-white focus:ring-0 transition-all duration-300 hover:border-brand-white/30 pl-12"
                                            />
                                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-white/40" />
                                        </div>
                                    </div>

                                    {/* Description Field - Show only after main input has value */}
                                    {hasValidMainInput && (
                                        <div className="relative">
                                            <Label className="absolute -top-2 left-4 bg-brand-black px-2 text-sm font-medium text-brand-white/70 z-10">
                                                Description <span className="text-brand-white/40">(optional)</span>
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    value={link.description || ''}
                                                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                    placeholder={getDescriptionPlaceholder(link)}
                                                    maxLength={100}
                                                    className={`h-14 bg-transparent border-2 rounded-2xl text-lg text-brand-white focus:ring-0 transition-all duration-300 pl-12 pr-16 ${!isDescriptionValid
                                                        ? 'border-red-400 focus:border-red-400'
                                                        : 'border-brand-white/10 focus:border-brand-white hover:border-brand-white/30'
                                                        }`}
                                                />
                                                <MessageSquare className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-white/40" />
                                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-brand-white/40">
                                                    {(link.description || '').length}/100
                                                </span>
                                            </div>
                                            {!isDescriptionValid && link.description && (
                                                <p className="text-red-400 text-xs mt-2 px-4">
                                                    Description must be between 3-100 characters
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </>
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
                                    className="text-xs text-brand-white/40 hover:text-brand-white/60 hover:bg-transparent p-2"
                                >
                                    Reset
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
            <div className="w-full max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-light text-brand-white mb-6 tracking-wide">
                        Add Your Links
                    </h1>
                    <p className="text-xl text-brand-white/60 font-light leading-relaxed max-w-2xl mx-auto">
                        Share your social media, website, contact info, and more. Add descriptions to tell people what to expect.
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center mb-12">
                    <div className="relative w-24 h-12">
                        <svg className="w-full h-full" viewBox="0 0 100 50">
                            <path
                                d="M 10 40 Q 50 10 90 40"
                                stroke="var(--brand-white)"
                                strokeWidth="2"
                                fill="none"
                                opacity="0.2"
                            />
                            <path
                                d="M 10 40 Q 50 10 90 40"
                                stroke="var(--brand-black)"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="100"
                                strokeDashoffset={100 - (filledFields / 3) * 100}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-end justify-center">
                            <span className="text-xs font-medium text-brand-black/60 tracking-wider">
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

                {/* Single Continue Button */}
                <div className="flex justify-center">
                    <Button
                        onClick={onNext}
                        disabled={loading || !isValid()}
                        className={`h-12 px-8 rounded-full transition-all duration-300 ${isValid() && !loading
                            ? 'bg-brand-black hover:bg-brand-black/90 animate-pulse cursor-pointer text-brand-white'
                            : 'bg-brand-black/50 cursor-not-allowed opacity-50 text-brand-white'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-brand-white/30 border-t-brand-white rounded-full animate-spin"></div>
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