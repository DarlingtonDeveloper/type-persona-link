import { UserLinkInput } from '@/types';

interface UserLinkInsert {
    user_id: string;
    category_id: string;
    label: string;
    url: string;
    description?: string | null;
    is_primary: boolean;
    display_order: number;
    platform?: string;
    link_type: string;
}

export const transformUserLinksInputToInsert = (
    userId: string,
    linkInputs: UserLinkInput[],
    linkCategories: Record<string, string> // label/type → category_id
): UserLinkInsert[] => {
    return linkInputs.map((link, index) => {
        let label = '';
        let url = '';

        switch (link.type) {
            case 'social-media':
                label = link.platform || 'Social';
                url = `https://www.${(link.platform || '').toLowerCase()}.com/${link.username}`;
                break;
            case 'email':
                label = 'Email';
                url = `mailto:${link.email}`;
                break;
            case 'mobile':
                label = 'Mobile';
                url = `tel:${link.phone}`;
                break;
            case 'website':
            case 'business':
            case 'affiliate':
                label = link.type.charAt(0).toUpperCase() + link.type.slice(1);
                url = link.url || '';
                break;
        }

        return {
            user_id: userId,
            category_id: linkCategories[link.type],
            label,
            url,
            description: link.description || null,  // Include description field
            is_primary: index === 0,
            display_order: index,
            platform: link.platform || null,
            link_type: link.type,
        };
    });
};

// Helper function to validate description
export const validateLinkDescription = (description: string): { isValid: boolean; error?: string } => {
    if (!description || description.trim().length === 0) {
        return { isValid: true }; // Description is optional
    }

    const trimmed = description.trim();

    if (trimmed.length < 3) {
        return { isValid: false, error: 'Description must be at least 3 characters long' };
    }

    if (trimmed.length > 100) {
        return { isValid: false, error: 'Description must be 100 characters or less' };
    }

    return { isValid: true };
};

// Helper function to get default description suggestions
export const getDefaultDescriptionSuggestions = (linkType: string, platform?: string): string[] => {
    switch (linkType) {
        case 'social-media':
            if (platform) {
                return [
                    `Check out my ${platform}`,
                    `Follow me on ${platform}`,
                    `Connect with me on ${platform}`,
                    `See my ${platform} posts`
                ];
            }
            return ['Follow my social media', 'Connect with me', 'Check out my posts'];
        case 'email':
            return ['Send me an email', 'Contact me', 'Get in touch', 'Drop me a line'];
        case 'mobile':
            return ['Call or text me', 'Give me a call', 'Contact me directly', 'Phone me'];
        case 'website':
            return ['Visit my website', 'Check out my site', 'See my work', 'Learn more about me'];
        case 'business':
            return ['Check out my business', 'Visit my company', 'See my services', 'Learn about my business'];
        case 'affiliate':
            return ['Get my recommended products', 'Shop my favorites', 'See my recommendations', 'Check out these deals'];
        default:
            return ['Click to see more', 'Check this out', 'Visit this link'];
    }
};