import { supabase } from '@/integrations/supabase/client';
import { UserLink } from '@/types';

export const saveUserLinks = async (
    inserts: Omit<UserLink, 'id' | 'created_at' | 'updated_at'>[]
): Promise<{ success: boolean; data?: UserLink[]; error?: string }> => {
    try {
        const { data, error } = await supabase
            .from('user_links')
            .insert(inserts)
            .select(`
        *,
        category:link_categories(name, icon_name)
      `);

        if (error) throw error;

        return { success: true, data: data as UserLink[] };
    } catch (err: any) {
        console.error('[saveUserLinks] Insert failed:', err);
        return { success: false, error: err.message };
    }
};
