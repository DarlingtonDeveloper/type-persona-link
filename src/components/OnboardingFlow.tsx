import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import DynamicBackground from '@/components/DynamicBackground';
import WelcomeGif from '@/components/WelcomeGif';
import PersonalDetailsStep from '@/components/PersonalDetailsStep';
import LinksStep from '@/components/LinksStep';
import PhotoBioStep from '@/components/PhotoBioStep';
import TermsPrivacyStep from '@/components/TermsPrivacyStep';
import { toast } from '@/hooks/use-toast';
import {
    User,
    UserLink,
    LinkCategory,
    OnboardingFormData
} from '@/types';
import {
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ONBOARDING_STEPS
} from '@/constants';

interface OnboardingFlowProps {
    user: User;
    onUpdate: (user: User) => void;
    onComplete: (user: User, links: UserLink[]) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onUpdate, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(user.onboarding_step || 0);
    const [formData, setFormData] = useState<Partial<OnboardingFormData>>({
        // Initialize with existing user data
        email: user.email || '',
        name: user.name || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        eye_color: user.eye_color || '',
        relationship_status: user.relationship_status || '',
        job_title: user.job_title || '',
        job_category: user.job_category || '',
        mobile: user.mobile || '',
        profile_photo_url: user.profile_photo_url || '',
        terms_accepted: user.terms_accepted || false,
        privacy_accepted: user.privacy_accepted || false,
        location: user.location || '',
        bio_description: '',
        interests: ['', '', ''],
        communication_preferences: false,
        links: [
            { label: '', url: '', categoryId: '', description: '' },
            { label: '', url: '', categoryId: '', description: '' },
            { label: '', url: '', categoryId: '', description: '' }
        ]
    });

    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    });

    const [linkCategories, setLinkCategories] = useState<LinkCategory[]>([]);
    const [loading, setLoading] = useState(false);

    const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

    useEffect(() => {
        fetchLinkCategories();
    }, []);

    const fetchLinkCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('link_categories')
                .select('*')
                .order('name');

            if (error) throw error;
            setLinkCategories(data || []);
        } catch (error) {
            console.error('Error fetching link categories:', error);
            toast({
                title: "Error",
                description: "Failed to load link categories",
                variant: "destructive"
            });
        }
    };

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNext = async () => {
        try {
            setLoading(true);

            // Save current step data
            await saveStepData();

            if (currentStep < ONBOARDING_STEPS.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                // Complete onboarding
                await completeOnboarding();
            }
        } catch (error) {
            console.error('Error proceeding to next step:', error);
            toast({
                title: "Error",
                description: "Failed to save progress. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const saveStepData = async () => {
        const { links, ...userUpdateData } = formData;

        const updates: Partial<User> = {
            ...userUpdateData,
            onboarding_step: currentStep + 1,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', user.id);

        if (error) throw error;
    };

    const completeOnboarding = async () => {
        const { links, ...finalUserData } = formData;

        const userUpdates: Partial<User> = {
            ...finalUserData,
            is_onboarding_complete: true,
            onboarding_step: ONBOARDING_STEPS.length,
            updated_at: new Date().toISOString()
        };

        const { error: userError } = await supabase
            .from('users')
            .update(userUpdates)
            .eq('id', user.id);

        if (userError) throw userError;
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0: // Welcome
                return (
                    <WelcomeGif
                        onComplete={() => setCurrentStep(1)}
                        userCode={user.user_code}
                    />
                );

            case 1: // Personal Details
                return (
                    <PersonalDetailsStep
                        formData={formData}
                        passwords={passwords}
                        onFormDataChange={updateFormData}
                        onPasswordChange={setPasswords}
                        onNext={handleNext}
                        onBack={handleBack}
                        loading={loading}
                        userCode={user.user_code}
                    />
                );

            case 2: // Links
                return (
                    <LinksStep
                        formData={formData}
                        linkCategories={linkCategories}
                        onFormDataChange={updateFormData}
                        onNext={handleNext}
                        onBack={handleBack}
                        loading={loading}
                    />
                );

            case 3: // Photo & Bio
                return (
                    <PhotoBioStep
                        formData={formData}
                        onFormDataChange={updateFormData}
                        onNext={handleNext}
                        onBack={handleBack}
                        loading={loading}
                    />
                );

            case 4: // Terms & Privacy
                return (
                    <TermsPrivacyStep
                        formData={formData}
                        onFormDataChange={updateFormData}
                        onNext={handleNext}
                        onBack={handleBack}
                        loading={loading}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <>
            {currentStep === 0 ? (
                // Welcome step renders full screen with no wrapper
                renderStep()
            ) : (
                <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-7xl mx-auto">
                        <div className="w-full">
                            {/* Progress bar only - no duplicate title or step text */}
                            <div className="mb-8">
                                <Progress value={progress} className="w-full h-2" />
                            </div>

                            {/* Render the step component directly */}
                            {renderStep()}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OnboardingFlow;