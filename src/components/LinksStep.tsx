import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpCircle } from 'lucide-react';

const LINK_TYPES = [
    { type: 'social-media', label: 'Social Media' },
    { type: 'email', label: 'Email' },
    { type: 'mobile', label: 'Mobile' },
    { type: 'website', label: 'Website' },
    { type: 'business', label: 'Business' },
    { type: 'affiliate', label: 'Affiliate' },
];

const SOCIAL_PLATFORMS = ['Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Facebook'];

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
    const links = formData.links || [{}, {}, {}];

    const updateLink = (index: number, data: Partial<UserLink>) => {
        const updated = [...links];
        updated[index] = { ...updated[index], ...data };
        onFormDataChange('links', updated);
    };

    const isLinkValid = (link: UserLink) => {
        switch (link.type) {
            case 'social-media':
                return !!link.platform && !!link.username;
            case 'email':
                return !!link.email;
            case 'mobile':
                return !!link.phone;
            case 'website':
            case 'business':
            case 'affiliate':
                return !!link.url;
            default:
                return false;
        }
    };

    const allValid = links.every(isLinkValid);

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-800">Add Your Links</h3>

            {links.map((link, index) => (
                <div key={index} className="border border-gray-300 rounded-xl p-4 space-y-4">
                    <h4 className="text-lg font-medium">Link {index + 1}</h4>

                    {/* Type buttons */}
                    <div className="flex flex-wrap gap-2">
                        {LINK_TYPES.map(({ type, label }) => (
                            <Button
                                key={type}
                                variant={link.type === type ? 'default' : 'outline'}
                                onClick={() => updateLink(index, { type, platform: '', username: '', email: '', phone: '', url: '' })}
                            >
                                {label}
                            </Button>
                        ))}
                    </div>

                    {/* Type-specific inputs */}
                    {link.type === 'social-media' && (
                        <>
                            <Label>Platform</Label>
                            <Select value={link.platform || ''} onValueChange={(val) => updateLink(index, { platform: val })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SOCIAL_PLATFORMS.map(p => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Label className="mt-2">Username</Label>
                            <Input
                                value={link.username || ''}
                                onChange={(e) => updateLink(index, { username: e.target.value })}
                                placeholder="@yourhandle"
                            />
                        </>
                    )}

                    {link.type === 'email' && (
                        <>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={link.email || ''}
                                onChange={(e) => updateLink(index, { email: e.target.value })}
                            />
                        </>
                    )}

                    {link.type === 'mobile' && (
                        <>
                            <Label>Phone Number</Label>
                            <Input
                                type="tel"
                                value={link.phone || ''}
                                onChange={(e) => updateLink(index, { phone: e.target.value })}
                            />
                        </>
                    )}

                    {['website', 'business', 'affiliate'].includes(link.type || '') && (
                        <>
                            <Label>URL</Label>
                            <Input
                                type="url"
                                value={link.url || ''}
                                onChange={(e) => updateLink(index, { url: e.target.value })}
                            />
                        </>
                    )}
                </div>
            ))}

            {/* Warning */}
            <Alert className="border-l-4 border-yellow-500">
                <AlertDescription className="text-base">
                    All fields must be filled to continue.
                </AlertDescription>
            </Alert>

            {/* Navigation */}
            <div className="flex gap-4 pt-6">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 h-12 text-lg"
                >
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!allValid || loading}
                    className={`flex-1 h-12 text-lg transition-all duration-300 ${allValid ? 'animate-pulse' : ''}`}
                >
                    {loading ? "Saving..." : "Continue"}
                </Button>
            </div>
        </div>
    );
};

export default LinksStep;