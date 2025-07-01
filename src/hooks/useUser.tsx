import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
    User,
    UserLink,
    LinkCategory,
    PasswordStrength,
    UserSession,
    ValidationResult,
    ApiResponse
} from '@/types';
import {
    ERROR_MESSAGES,
    USER_CODE,
    RATE_LIMITS,
    LOCAL_STORAGE_KEYS
} from '@/constants';
import { checkPasswordStrength } from '@/utils/security';

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

    const completeOnboarding = async (userData: Partial<User>, links: any[]): Promise<ApiResponse<UserLink[]>> => {
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
                        display_order: i,
                        is_primary: i === 0
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

            return { success: true, data: userLinks };
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
        if (!userCode || userCode.length !== USER_CODE.LENGTH) {
            return {
                isValid: false,
                exists: false,
                error: `User code must be ${USER_CODE.LENGTH} characters`
            };
        }

        if (!USER_CODE.PATTERN.test(userCode.toUpperCase())) {
            return {
                isValid: false,
                exists: false,
                error: 'User code must contain only letters and numbers'
            };
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
                    return { isValid: false, exists: false, error: ERROR_MESSAGES.USER_NOT_FOUND };
                }
                throw error;
            }

            return {
                isValid: true,
                exists: true,
                isComplete: data.is_onboarding_complete
            };
        } catch (error: any) {
            return { isValid: false, exists: false, error: ERROR_MESSAGES.VALIDATION_ERROR };
        } finally {
            setIsValidating(false);
        }
    };

    return { validateUserCode, isValidating };
};

// Hook for managing user session (simple implementation)
export const useUserSession = () => {
    const [session, setSession] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const savedSession = sessionStorage.getItem(LOCAL_STORAGE_KEYS.USER_SESSION);
        if (savedSession) {
            try {
                const sessionData = JSON.parse(savedSession);
                if (Date.now() < sessionData.expiresAt) {
                    setSession(sessionData);
                } else {
                    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.USER_SESSION);
                }
            } catch (error) {
                sessionStorage.removeItem(LOCAL_STORAGE_KEYS.USER_SESSION);
            }
        }
        setLoading(false);
    }, []);

    const createSession = (userId: string, userCode: string) => {
        const sessionData: UserSession = {
            userId,
            userCode,
            timestamp: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };

        sessionStorage.setItem(LOCAL_STORAGE_KEYS.USER_SESSION, JSON.stringify(sessionData));
        setSession(sessionData);
    };

    const clearSession = () => {
        sessionStorage.removeItem(LOCAL_STORAGE_KEYS.USER_SESSION);
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
    }): Promise<ApiResponse<UserLink>> => {
        try {
            const { data, error } = await supabase
                .from('user_links')
                .insert({
                    ...linkData,
                    user_id: userId,
                    display_order: links.length,
                    is_primary: links.length === 0
                })
                .select(`
          *,
          category:link_categories(name, icon_name)
        `)
                .single();

            if (error) throw error;
            setLinks(prev => [...prev, data as UserLink]);
            return { success: true, data: data as UserLink };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const updateLink = async (linkId: string, updates: Partial<UserLink>): Promise<ApiResponse<UserLink>> => {
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
            return { success: true, data: data as UserLink };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const deleteLink = async (linkId: string): Promise<ApiResponse> => {
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

    const reorderLinks = async (newOrder: UserLink[]): Promise<ApiResponse> => {
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

// Hook for password strength validation
export const usePasswordValidation = () => {
    const [strength, setStrength] = useState<PasswordStrength>({
        score: 0,
        feedback: [],
        isValid: false
    });

    const validatePassword = (password: string) => {
        const result = checkPasswordStrength(password);
        setStrength(result);
        return result;
    };

    return {
        strength,
        validatePassword
    };
};