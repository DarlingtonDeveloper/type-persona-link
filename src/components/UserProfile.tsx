import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import OnboardingFlow from '@/components/OnboardingFlow';
import CompletedProfile from '@/components/CompletedProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export interface User {
    id: string;
    user_code: string;
    email?: string;
    name?: string;
    date_of_birth?: string;
    gender?: string;
    eye_color?: string;
    relationship_status?: string;
    job_title?: string;
    job_category?: string;
    mobile?: string;
    profile_photo_url?: string;
    onboarding_step: number;
    is_onboarding_complete: boolean;
    terms_accepted: boolean;
    privacy_accepted: boolean;
}

export interface UserLink {
    id: string;
    label: string;
    url: string;
    category_id: string;
    is_primary: boolean;
    display_order: number;
    category?: {
        name: string;
        icon_name: string;
    };
}

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
                        setError('User code not found');
                    } else {
                        setError('Failed to load user data');
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
                setError('An unexpected error occurred');
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
                            {error || 'User not found'}
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

export default UserProfile;