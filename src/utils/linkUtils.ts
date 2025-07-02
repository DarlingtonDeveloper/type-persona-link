import { UserLinkInput } from '@/types';

interface UserLinkInsert {
    user_id: string;
    category_id: string;
    label: string;
    url: string;
    is_primary: boolean;
    display_order: number;
    platform?: string;
    link_type: string;
    description?: string;
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
            is_primary: index === 0,
            display_order: index,
            platform: link.platform || null,
            link_type: link.type,
        };
    });
};
