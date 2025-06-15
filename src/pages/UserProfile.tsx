import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import OnboardingFlow from '@/components/OnboardingFlow';
import CompletedProfile from '@/components/CompletedProfile';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { User, UserLink } from '@/types';
import { ERROR_MESSAGES, APP_CONFIG } from '@/constants';

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
                setLoading(true);
                setError(null);

                // Fetch user data with new fields
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select(`
                        *,
                        postcode,
                        bio_description,
                        interests,
                        communication_preferences
                    `)
                    .eq('user_code', userCode.toUpperCase())
                    .single();

                if (userError) {
                    if (userError.code === 'PGRST116') {
                        setError(ERROR_MESSAGES.USER_NOT_FOUND);
                    } else {
                        console.error('User fetch error:', userError);
                        setError(ERROR_MESSAGES.NETWORK_ERROR);
                    }
                    setLoading(false);
                    return;
                }

                setUser(userData);

                // If user has completed onboarding, fetch their links with descriptions
                if (userData.is_onboarding_complete) {
                    const { data: linksData, error: linksError } = await supabase
                        .from('user_links')
                        .select(`
                            *,
                            description,
                            category:link_categories(name, icon_name)
                        `)
                        .eq('user_id', userData.id)
                        .order('display_order');

                    if (!linksError) {
                        setUserLinks(linksData || []);
                    } else {
                        console.error('Links fetch error:', linksError);
                        // Don't fail completely if links can't be fetched
                        setUserLinks([]);
                    }
                }
            } catch (err) {
                console.error('Unexpected error fetching user data:', err);
                setError(ERROR_MESSAGES.GENERIC_ERROR);
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

    // Loading state with enhanced spinner
    if (loading) {
        return (
            <LoadingSpinner
                variant="profile"
                message="Loading your E3 Circle profile..."
            />
        );
    }

    // Error state with helpful messaging
    if (error || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md space-y-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Profile Not Found</strong>
                            <br />
                            {error || ERROR_MESSAGES.USER_NOT_FOUND}
                        </AlertDescription>
                    </Alert>

                    {/* Help text for common issues */}
                    <div className="bg-blue-50 p-4 rounded-lg text-sm">
                        <h3 className="font-medium text-blue-900 mb-2">Common Issues:</h3>
                        <ul className="text-blue-800 space-y-1 list-disc list-inside">
                            <li>Check that the user code is spelled correctly</li>
                            <li>User codes are case-sensitive (usually uppercase)</li>
                            <li>The profile may still be in setup mode</li>
                        </ul>
                        <div className="mt-3 pt-3 border-t border-blue-200">
                            <p className="text-blue-800">
                                Need help? Contact{' '}
                                <a
                                    href={`mailto:${APP_CONFIG.SUPPORT_EMAIL}`}
                                    className="underline hover:no-underline"
                                >
                                    {APP_CONFIG.SUPPORT_EMAIL}
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Go home button */}
                    <div className="text-center">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go to {APP_CONFIG.NAME} Home
                        </button>
                    </div>
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

    // Show completed profile with enhanced data
    return (
        <CompletedProfile
            user={user}
            userLinks={userLinks}
        />
    );
};

export default UserProfile;