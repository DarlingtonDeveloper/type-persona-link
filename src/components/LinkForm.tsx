import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { HelpCircle, ExternalLink } from 'lucide-react';
import { LINK_CATEGORIES_BY_POSITION, VALIDATION_RULES } from '@/constants';

interface LinkFormProps {
    links: Array<{
        label: string;
        url: string;
        categoryId: string;
        description?: string;
    }>;
    onUpdateLink: (index: number, field: string, value: string) => void;
    showUrlHelp: boolean;
    onToggleUrlHelp: () => void;
}

export const LinkFormSection: React.FC<LinkFormProps> = ({
    links,
    onUpdateLink,
    showUrlHelp,
    onToggleUrlHelp
}) => {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="brand-body text-brand-black mb-2">Add Your Links</h3>
                <p className="text-brand-black/70 text-lg">
                    Share your social media, websites, and other important links
                </p>
            </div>

            {links.map((link, index) => (
                <div key={index} className="link-category-card rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <Label className="text-lg font-semibold text-brand-black">
                            Link {index + 1}
                        </Label>
                        {index === 0 && (
                            <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                                Required
                            </span>
                        )}
                    </div>

                    {/* Category Selection */}
                    <div>
                        <Label htmlFor={`linkCategory${index}`} className="text-brand-black mb-2 block">
                            Category
                        </Label>
                        <Select
                            value={link.categoryId}
                            onValueChange={(value) => onUpdateLink(index, 'categoryId', value)}
                        >
                            <SelectTrigger className="onboarding-input">
                                <SelectValue placeholder="Choose a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {LINK_CATEGORIES_BY_POSITION[index as keyof typeof LINK_CATEGORIES_BY_POSITION]?.map(category => (
                                    <SelectItem
                                        key={category.value}
                                        value={category.value}
                                        className="text-brand-black"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{category.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* URL Input */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label htmlFor={`linkUrl${index}`} className="text-brand-black">
                                URL
                            </Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={onToggleUrlHelp}
                                className="p-1"
                            >
                                <HelpCircle className="h-4 w-4 text-brand-black/60" />
                            </Button>
                        </div>
                        <div className="relative">
                            <Input
                                id={`linkUrl${index}`}
                                value={link.url}
                                onChange={(e) => onUpdateLink(index, 'url', e.target.value)}
                                placeholder="Paste your URL here (e.g., https://instagram.com/username)"
                                maxLength={VALIDATION_RULES.URL.MAX_LENGTH}
                                className="onboarding-input pr-10"
                            />
                            {link.url && (
                                <ExternalLink className="absolute right-3 top-3 h-4 w-4 text-brand-black/40" />
                            )}
                        </div>
                    </div>

                    {/* Description Input */}
                    <div>
                        <Label htmlFor={`linkDescription${index}`} className="text-brand-black mb-2 block">
                            Description (Optional)
                        </Label>
                        <Input
                            id={`linkDescription${index}`}
                            value={link.description || ''}
                            onChange={(e) => onUpdateLink(index, 'description', e.target.value)}
                            placeholder="Describe this link for others..."
                            maxLength={VALIDATION_RULES.LINK_DESCRIPTION.MAX_LENGTH}
                            className="onboarding-input"
                        />
                        <p className="text-xs text-brand-black/50 mt-1">
                            {(link.description || '').length}/{VALIDATION_RULES.LINK_DESCRIPTION.MAX_LENGTH} characters
                        </p>
                    </div>

                    {/* Link Preview */}
                    {link.url && (
                        <div className="bg-brand-white/60 rounded-lg p-3 border border-brand-black/10">
                            <p className="text-xs text-brand-black/60 mb-1">Preview:</p>
                            <p className="text-sm text-brand-black font-medium">
                                {link.label || `Link ${index + 1}`}
                            </p>
                            <p className="text-xs text-brand-black/60 truncate">
                                {link.url}
                            </p>
                        </div>
                    )}
                </div>
            ))}

            {/* URL Help Section */}
            {showUrlHelp && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-3">
                    <h4 className="font-semibold text-blue-900 text-lg">How to copy a URL:</h4>
                    <div className="space-y-2 text-blue-800">
                        <p><strong>For Social Media:</strong></p>
                        <p>1. Open your profile in the app or browser</p>
                        <p>2. Tap "Share Profile" or copy from the address bar</p>
                        <p>3. Paste the full URL here</p>

                        <p><strong>For Websites:</strong></p>
                        <p>1. Go to the website you want to share</p>
                        <p>2. Copy the web address from the browser's address bar</p>
                        <p>3. Paste it in the URL field above</p>

                        <div className="bg-blue-100 rounded-lg p-3 mt-3">
                            <p className="font-medium text-blue-900">Examples:</p>
                            <p className="text-sm">• https://instagram.com/yourusername</p>
                            <p className="text-sm">• https://linkedin.com/in/yourname</p>
                            <p className="text-sm">• https://yourwebsite.com</p>
                            <p className="text-sm">• mailto:your@email.com</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};