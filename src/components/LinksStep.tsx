import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VALIDATION_RULES } from '@/constants';
import { OnboardingFormData, LinkCategory } from '@/types';

interface LinksStepProps {
    formData: Partial<OnboardingFormData>;
    linkCategories: LinkCategory[];
    onFormDataChange: (field: string, value: any) => void;
    onNext: () => void;
    onBack: () => void;
    loading: boolean;
}

// Position-specific link categories based on client requirements
const LINK_CATEGORIES_BY_POSITION = {
    0: [ // Link 1
        { value: 'social-media', label: 'Social Media' },
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone Number' },
        { value: 'business-website', label: 'Business Website' },
        { value: 'personal-website', label: 'Personal Website' },
        { value: 'other', label: 'Other' }
    ],
    1: [ // Link 2
        { value: 'social-media', label: 'Social Media' },
        { value: 'favorite-song', label: 'What is your favourite song?' },
        { value: 'favorite-restaurant', label: 'What is your favourite restaurant?' },
        { value: 'favorite-art', label: 'What is your favourite piece of art?' },
        { value: 'other', label: 'Other' }
    ],
    2: [ // Link 3
        { value: 'social-media', label: 'Social Media' },
        { value: 'affiliation-link', label: 'Affiliation Link' },
        { value: 'business-email', label: 'Business Email' },
        { value: 'portfolio-cv', label: 'Portfolio / CV' },
        { value: 'other', label: 'Other' }
    ]
};

const LinksStep: React.FC<LinksStepProps> = ({
    formData,
    linkCategories,
    onFormDataChange,
    onNext,
    onBack,
    loading
}) => {
    const [showUrlHelp, setShowUrlHelp] = useState(false);

    const updateLink = (index: number, field: string, value: string) => {
        const updatedLinks = [...(formData.links || [])];
        updatedLinks[index] = {
            ...updatedLinks[index],
            [field]: value
        };
        onFormDataChange('links', updatedLinks);
    };

    const getAvailableCategories = (position: number) => {
        return LINK_CATEGORIES_BY_POSITION[position as keyof typeof LINK_CATEGORIES_BY_POSITION] || [];
    };

    const hasValidLinks = () => {
        const links = formData.links || [];
        return links.some(link => link.label && link.url && link.categoryId);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Your Links</h3>
                <p className="text-sm text-gray-600">
                    Add up to 3 links to your profile. At least one link is required.
                </p>
            </div>

            {/* URL Help */}
            <div className="space-y-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUrlHelp(!showUrlHelp)}
                    className="w-full justify-start"
                >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    How to get URLs from apps
                </Button>

                {showUrlHelp && (
                    <Alert>
                        <AlertDescription className="text-sm">
                            <div className="space-y-2">
                                <p><strong>Instagram:</strong> Go to your profile → ... → Share Profile → Copy Link</p>
                                <p><strong>TikTok:</strong> Go to your profile → Share → Copy Link</p>
                                <p><strong>LinkedIn:</strong> View your profile → Contact info → Your profile URL</p>
                                <p><strong>Twitter/X:</strong> Go to your profile → Share → Copy Link</p>
                                <p><strong>Websites:</strong> Copy the full URL from your browser address bar</p>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Links Form */}
            <div className="space-y-6">
                {[0, 1, 2].map((index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                        <h4 className="font-medium">Link {index + 1} {index === 0 && '*'}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`link-label-${index}`}>Label *</Label>
                                <Input
                                    id={`link-label-${index}`}
                                    value={formData.links?.[index]?.label || ''}
                                    onChange={(e) => updateLink(index, 'label', e.target.value)}
                                    placeholder="e.g., My Instagram, Portfolio"
                                    maxLength={VALIDATION_RULES.LABEL.MAX_LENGTH}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`link-category-${index}`}>Category *</Label>
                                <Select
                                    value={formData.links?.[index]?.categoryId || ''}
                                    onValueChange={(value) => updateLink(index, 'categoryId', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getAvailableCategories(index).map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor={`link-url-${index}`}>URL *</Label>
                            <Input
                                id={`link-url-${index}`}
                                type="url"
                                value={formData.links?.[index]?.url || ''}
                                onChange={(e) => updateLink(index, 'url', e.target.value)}
                                placeholder="https://example.com"
                                maxLength={VALIDATION_RULES.URL.MAX_LENGTH}
                            />
                        </div>

                        <div>
                            <Label htmlFor={`link-description-${index}`}>Description (Optional)</Label>
                            <Textarea
                                id={`link-description-${index}`}
                                value={formData.links?.[index]?.description || ''}
                                onChange={(e) => updateLink(index, 'description', e.target.value)}
                                placeholder="Brief description of this link"
                                maxLength={VALIDATION_RULES.LINK_DESCRIPTION.MAX_LENGTH}
                                rows={2}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <Alert>
                <AlertDescription>
                    Note: Your links will be publicly visible on your profile. Make sure they lead to appropriate content.
                </AlertDescription>
            </Alert>

            {/* Navigation */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1"
                >
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={loading || !hasValidLinks()}
                    className="flex-1"
                >
                    {loading ? "Saving..." : "Continue"}
                </Button>
            </div>
        </div>
    );
};

export default LinksStep;