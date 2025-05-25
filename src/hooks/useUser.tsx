import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserLink } from '@/pages/UserProfile';

export interface LinkCategory {
    id: string;
    name: string;
    icon_name: string;
}

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

                // Fetch user data
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('user_code', userCode.toUpperCase())
                    .single();

                if (userError) {
                    if (userError.code === 'PGRST116') {
                        setError('User code not found');
                    } else {
                        setError('Failed to load user data');
                    }
                    return;
                }

                setUser(userData);

                // If user has completed onboarding, fetch their links
                if (userData.is_onboarding_complete) {
                    const { data: linksData, error: linksError } = await supabase
                        .from('user_links')
                        .select(`
              *,
              category:link_categories(name, icon_name)
            `)
                        .eq('user_id', userData.id)
                        .order('display_order');

                    if (!linksError) {
                        setUserLinks(linksData || []);
                    }
                }
            } catch (err) {
                setError('An unexpected error occurred');
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
        refetch: () => {
            setLoading(true);
            // Re-trigger the effect by changing a dependency
        }
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

    const saveProgress = async (stepData: Partial<User>, step: number) => {
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

    const completeOnboarding = async (userData: Partial<User>, links: any[]) => {
        setSaving(true);
        try {
            // Update user
            const { error: userError } = await supabase
                .from('users')
                .update({
                    ...userData,
                    is_onboarding_complete: true,
                    onboarding_step: 5
                })
                .eq('id', user.id);

            if (userError) throw userError;

            // Save links
            const userLinks: UserLink[] = [];
            for (let i = 0; i < links.length; i++) {
                const link = links[i];
                const { data, error } = await supabase
                    .from('user_links')
                    .insert({
                        user_id: user.id,
                        label: link.label,
                        url: link.url,
                        category_id: link.categoryId,
                        display_order: i
                    })
                    .select(`
            *,
            category:link_categories(name, icon_name)
          `)
                    .single();

                if (!error && data) {
                    userLinks.push(data as UserLink);
                }
            }

            return { success: true, userLinks };
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

// Hook for real-time user code validation
export const useUserCodeValidation = () => {
    const [isValidating, setIsValidating] = useState(false);

    const validateUserCode = async (userCode: string): Promise<{
        isValid: boolean;
        exists: boolean;
        isComplete?: boolean;
        error?: string;
    }> => {
        if (!userCode || userCode.length !== 6) {
            return { isValid: false, exists: false, error: 'User code must be 6 characters' };
        }

        setIsValidating(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('user_code, is_onboarding_complete')
                .eq('user_code', userCode.toUpperCase())
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return { isValid: false, exists: false, error: 'User code not found' };
                }
                throw error;
            }

            return {
                isValid: true,
                exists: true,
                isComplete: data.is_onboarding_complete
            };
        } catch (error: any) {
            return { isValid: false, exists: false, error: 'Validation failed' };
        } finally {
            setIsValidating(false);
        }
    };

    return { validateUserCode, isValidating };
};

// Hook for managing user session (simple implementation)
export const useUserSession = () => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const savedSession = sessionStorage.getItem('e3_session');
        if (savedSession) {
            try {
                const sessionData = JSON.parse(savedSession);
                if (Date.now() < sessionData.expiresAt) {
                    setSession(sessionData);
                } else {
                    sessionStorage.removeItem('e3_session');
                }
            } catch (error) {
                sessionStorage.removeItem('e3_session');
            }
        }
        setLoading(false);
    }, []);

    const createSession = (userId: string, userCode: string) => {
        const sessionData = {
            userId,
            userCode,
            timestamp: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };

        sessionStorage.setItem('e3_session', JSON.stringify(sessionData));
        setSession(sessionData);
    };

    const clearSession = () => {
        sessionStorage.removeItem('e3_session');
        setSession(null);
    };

    return {
        session,
        loading,
        createSession,
        clearSession,
        isAuthenticated: !!session
    };
};

// Hook for managing link operations
export const useUserLinks = (userId: string) => {
    const [links, setLinks] = useState<UserLink[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLinks = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('user_links')
                .select(`
          *,
          category:link_categories(name, icon_name)
        `)
                .eq('user_id', userId)
                .order('display_order');

            if (error) throw error;
            setLinks(data || []);
        } catch (error) {
            console.error('Error fetching links:', error);
        } finally {
            setLoading(false);
        }
    };

    const addLink = async (linkData: {
        label: string;
        url: string;
        category_id: string;
    }) => {
        try {
            const { data, error } = await supabase
                .from('user_links')
                .insert({
                    ...linkData,
                    user_id: userId,
                    display_order: links.length
                })
                .select(`
          *,
          category:link_categories(name, icon_name)
        `)
                .single();

            if (error) throw error;
            setLinks(prev => [...prev, data as UserLink]);
            return { success: true, data };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const updateLink = async (linkId: string, updates: Partial<UserLink>) => {
        try {
            const { data, error } = await supabase
                .from('user_links')
                .update(updates)
                .eq('id', linkId)
                .select(`
          *,
          category:link_categories(name, icon_name)
        `)
                .single();

            if (error) throw error;
            setLinks(prev => prev.map(link =>
                link.id === linkId ? data as UserLink : link
            ));
            return { success: true, data };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const deleteLink = async (linkId: string) => {
        try {
            const { error } = await supabase
                .from('user_links')
                .delete()
                .eq('id', linkId);

            if (error) throw error;
            setLinks(prev => prev.filter(link => link.id !== linkId));
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const reorderLinks = async (newOrder: UserLink[]) => {
        try {
            const updates = newOrder.map((link, index) => ({
                id: link.id,
                display_order: index
            }));

            for (const update of updates) {
                await supabase
                    .from('user_links')
                    .update({ display_order: update.display_order })
                    .eq('id', update.id);
            }

            setLinks(newOrder);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    useEffect(() => {
        if (userId) {
            fetchLinks();
        }
    }, [userId]);

    return {
        links,
        loading,
        addLink,
        updateLink,
        deleteLink,
        reorderLinks,
        refetch: fetchLinks
    };
};