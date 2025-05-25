import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import OnboardingFlow from '@/components/OnboardingFlow';
import CompletedProfile from '@/components/CompletedProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { User, UserLink } from '@/types';
import { ERROR_MESSAGES } from '@/constants';

const UserProfile: React.FC = () => {
    const { userCode } = useParams<{ userCode: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [userLinks, setUserLinks] = useState<UserLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userCode) {
                setError('No user code provided');
                setLoading(false);
                return;
            }

            try {
                // Fetch user data
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('user_code', userCode.toUpperCase())
                    .single();

                if (userError) {
                    if (userError.code === 'PGRST116') {
                        setError(ERROR_MESSAGES.USER_NOT_FOUND);
                    } else {
                        setError(ERROR_MESSAGES.NETWORK_ERROR);
                    }
                    setLoading(false);
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

        fetchUserData();
    }, [userCode]);

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const updateUserLinks = (links: UserLink[]) => {
        setUserLinks(links);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-full max-w-md space-y-4 p-6">
                    <Skeleton className="h-24 w-24 rounded-xl mx-auto" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <div className="space-y-3">
                        <Skeleton className="h-12 w-full rounded-full" />
                        <Skeleton className="h-12 w-full rounded-full" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error || ERROR_MESSAGES.USER_NOT_FOUND}
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    // Show onboarding flow if not completed
    if (!user.is_onboarding_complete) {
        return (
            <OnboardingFlow
                user={user}
                onUpdate={updateUser}
                onComplete={(completedUser, links) => {
                    updateUser(completedUser);
                    updateUserLinks(links);
                }}
            />
        );
    }

    // Show completed profile
    return (
        <CompletedProfile
            user={user}
            userLinks={userLinks}
        />
    );
};

// Export the centralized types for components that still need them
export type { User, UserLink } from '@/types';

export default UserProfile;