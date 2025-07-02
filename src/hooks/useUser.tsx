import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
    User,
    UserLink,
    LinkCategory,
    ValidationResult,
    ApiResponse,
    UserLinkInput
} from '@/types';
import {
    ERROR_MESSAGES,
    USER_CODE,
    RATE_LIMITS,
    LOCAL_STORAGE_KEYS
} from '@/constants';
import { checkPasswordStrength } from '@/utils/security';
import { transformUserLinksInputToInsert } from '@/utils/linkUtils';
import { saveUserLinks } from '@/integrations/supabase/userLinks';

// Hook for fetching and managing user data
export const useUser = (userCode: string) => {
    const [user, setUser] = useState<User | null>(null);
    const [userLinks, setUserLinks] = useState<UserLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!userCode) {
                setError('No user code provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select(`id,
                            user_code,
                            email,
                            name,
                            date_of_birth,
                            gender,
                            eye_color,
                            relationship_status,
                            job_title,
                            mobile,
                            profile_photo_url,
                            onboarding_step,
                            is_onboarding_complete,
                            terms_accepted,
                            privacy_accepted,
                            created_at,
                            updated_at,
                            location,
                            bio_description,
                            communication_preferences`)
                    .eq('user_code', userCode.toUpperCase())
                    .single();

                if (userError) {
                    if (userError.code === 'PGRST116') {
                        setError(ERROR_MESSAGES.USER_NOT_FOUND);
                    } else {
                        setError(ERROR_MESSAGES.NETWORK_ERROR);
                    }
                    return;
                }

                setUser(userData);

                if (userData.is_onboarding_complete) {
                    const { data: linksData, error: linksError } = await supabase
                        .from('user_links')
                        .select(`*, category:link_categories(name, icon_name)`)
                        .eq('user_id', userData.id)
                        .order('display_order');

                    if (!linksError) {
                        setUserLinks(linksData || []);
                    }
                }
            } catch (err) {
                setError(ERROR_MESSAGES.GENERIC_ERROR);
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userCode]);

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const updateUserLinks = (links: UserLink[]) => {
        setUserLinks(links);
    };

    return {
        user,
        userLinks,
        loading,
        error,
        updateUser,
        updateUserLinks,
        refetch: () => setLoading(true)
    };
};

// Hook for fetching link categories
export const useLinkCategories = () => {
    const [categories, setCategories] = useState<LinkCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from('link_categories')
                    .select('*')
                    .order('name');

                if (error) throw error;
                setCategories(data || []);
            } catch (err: any) {
                setError(err.message);
                console.error('Error fetching link categories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
};

// Hook for managing onboarding progress
export const useOnboarding = (user: User) => {
    const [currentStep, setCurrentStep] = useState(user?.onboarding_step || 0);
    const [saving, setSaving] = useState(false);

    const saveProgress = async (stepData: Partial<User>, step: number): Promise<ApiResponse> => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    ...stepData,
                    onboarding_step: step,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;
            setCurrentStep(step);
            return { success: true };
        } catch (error: any) {
            console.error('Error saving progress:', error);
            return { success: false, error: error.message };
        } finally {
            setSaving(false);
        }
    };

    const completeOnboarding = async (userData: Partial<User>, links: UserLinkInput[]): Promise<ApiResponse<UserLink[]>> => {
        setSaving(true);
        try {
            const { error: userError } = await supabase
                .from('users')
                .update({
                    ...userData,
                    is_onboarding_complete: true,
                    onboarding_step: 5
                })
                .eq('id', user.id);

            if (userError) throw userError;

            const { data: categories } = await supabase
                .from('link_categories')
                .select('id, name');

            const categoryMap = Object.fromEntries(
                (categories || []).map(cat => [cat.name.toLowerCase().replace(/\s+/g, '-'), cat.id])
            );

            const inserts = transformUserLinksInputToInsert(user.id, links, categoryMap);
            console.log('Link inserts payload:', inserts);
            const result = await saveUserLinks(inserts);

            if (!result.success) throw new Error(result.error);

            return { success: true, data: result.data };
        } catch (error: any) {
            console.error('Error completing onboarding:', error);
            return { success: false, error: error.message };
        } finally {
            setSaving(false);
        }
    };

    return {
        currentStep,
        saving,
        saveProgress,
        completeOnboarding,
        setCurrentStep
    };
};
