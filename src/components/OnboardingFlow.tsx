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
        // New fields
        postcode: '',
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
        const updates: Partial<User> = {
            ...formData,
            onboarding_step: currentStep + 1,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', user.id);

        if (error) throw error;

        // Update local user state
        onUpdate({ ...user, ...updates });
    };

    const completeOnboarding = async () => {
        try {
            // Final user update
            const finalUserData: Partial<User> = {
                ...formData,
                is_onboarding_complete: true,
                onboarding_step: ONBOARDING_STEPS.length,
                updated_at: new Date().toISOString()
            };

            const { error: userError } = await supabase
                .from('users')
                .update(finalUserData)
                .eq('id', user.id);

            if (userError) throw userError;

            // Save links
            const userLinks: UserLink[] = [];
            if (formData.links) {
                for (const [index, link] of formData.links.entries()) {
                    if (link.label && link.url && link.categoryId) {
                        const { data: linkData, error: linkError } = await supabase
                            .from('user_links')
                            .insert({
                                user_id: user.id,
                                label: link.label,
                                url: link.url,
                                category_id: link.categoryId,
                                description: link.description || null,
                                display_order: index + 1,
                                is_primary: index === 0
                            })
                            .select()
                            .single();

                        if (linkError) throw linkError;
                        if (linkData) userLinks.push(linkData);
                    }
                }
            }

            // Show success message
            toast({
                title: "Success!",
                description: SUCCESS_MESSAGES.ONBOARDING_COMPLETE,
            });

            // Complete after short delay
            setTimeout(() => {
                onComplete({ ...user, ...finalUserData }, userLinks);
            }, 1500);

        } catch (error: any) {
            console.error('Error completing onboarding:', error);
            toast({
                title: "Error",
                description: error.message || ERROR_MESSAGES.GENERIC_ERROR,
                variant: "destructive"
            });
        }
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
                // Welcome step renders full screen with no wrapper padding
                renderStep()
            ) : (
                // Other steps use DynamicBackground
                <DynamicBackground>
                    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
                        <div className="w-full max-w-4xl mx-auto">
                            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
                                <CardHeader className="pb-6">
                                    <div className="space-y-4">
                                        <Progress value={progress} className="w-full h-2" />
                                        <CardTitle className="text-center text-2xl md:text-3xl font-bold">
                                            {ONBOARDING_STEPS[currentStep]}
                                        </CardTitle>
                                        <p className="text-center text-gray-600 text-lg">
                                            Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                                        </p>
                                    </div>
                                </CardHeader>

                                <CardContent className="px-6 md:px-12 pb-8">
                                    <div className="max-w-3xl mx-auto">
                                        {renderStep()}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </DynamicBackground>
            )}
        </>
    );
};

export default OnboardingFlow;