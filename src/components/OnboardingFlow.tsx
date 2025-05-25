import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { User, UserLink } from '@/pages/UserProfile';
import DynamicBackground from '@/components/DynamicBackground';
import { Eye, EyeOff, ArrowLeft, ArrowRight, Upload, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
    hashPassword,
    isValidEmail,
    isValidPhone,
    isValidUrl,
    checkPasswordStrength,
    rateLimiter,
    secureApiCall,
    validateFileUpload
} from '@/utils/security';

interface OnboardingFlowProps {
    user: User;
    onUpdate: (user: User) => void;
    onComplete: (user: User, links: UserLink[]) => void;
}

interface LinkCategory {
    id: string;
    name: string;
    icon_name: string;
}

const ONBOARDING_STEPS = [
    'E3 Circle Registration',
    'Personal Details',
    'Additional Information',
    'Profile Display',
    'Terms & Privacy'
];

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onUpdate, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(user.onboarding_step || 0);
    const [formData, setFormData] = useState<Partial<User>>({
        ...user,
        email: user.email || '',
        name: user.name || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        eye_color: user.eye_color || '',
        relationship_status: user.relationship_status || '',
        job_title: user.job_title || '',
        job_category: user.job_category || '',
        mobile: user.mobile || '',
        profile_photo_url: user.profile_photo_url || ''
    });

    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [links, setLinks] = useState<Array<{ label: string; url: string; categoryId: string }>>([
        { label: '', url: '', categoryId: '' },
        { label: '', url: '', categoryId: '' }
    ]);
    const [linkCategories, setLinkCategories] = useState<LinkCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [showUrlHelp, setShowUrlHelp] = useState(false);

    const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

    useEffect(() => {
        fetchLinkCategories();
    }, []);

    const fetchLinkCategories = async () => {
        const { data, error } = await supabase
            .from('link_categories')
            .select('*')
            .order('name');

        if (!error && data) {
            setLinkCategories(data);
        }
    };

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const saveProgress = async (stepData: Partial<User>, step: number) => {
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

            const updatedUser = { ...user, ...stepData, onboarding_step: step };
            onUpdate(updatedUser);

        } catch (error) {
            console.error('Error saving progress:', error);
            toast({
                title: "Error",
                description: "Failed to save progress. Please try again.",
                variant: "destructive"
            });
        }
    };

    const validateStep = () => {
        switch (currentStep) {
            case 0: // E3 Circle Registration
                if (!formData.email || !passwords.password || !passwords.confirmPassword) {
                    toast({
                        title: "Validation Error",
                        description: "Please fill in all required fields.",
                        variant: "destructive"
                    });
                    return false;
                }

                if (!isValidEmail(formData.email)) {
                    toast({
                        title: "Validation Error",
                        description: "Please enter a valid email address.",
                        variant: "destructive"
                    });
                    return false;
                }

                if (passwords.password !== passwords.confirmPassword) {
                    toast({
                        title: "Validation Error",
                        description: "Passwords do not match.",
                        variant: "destructive"
                    });
                    return false;
                }

                const passwordCheck = checkPasswordStrength(passwords.password);
                if (!passwordCheck.isValid) {
                    toast({
                        title: "Password too weak",
                        description: passwordCheck.feedback.join('. '),
                        variant: "destructive"
                    });
                    return false;
                }
                return true;

            case 1: // Personal Details
                if (!formData.name || !formData.date_of_birth || !formData.gender) {
                    toast({
                        title: "Validation Error",
                        description: "Please fill in all required fields.",
                        variant: "destructive"
                    });
                    return false;
                }

                // Validate age (must be at least 13)
                const birthDate = new Date(formData.date_of_birth);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 13) {
                    toast({
                        title: "Age Restriction",
                        description: "You must be at least 13 years old to create a profile.",
                        variant: "destructive"
                    });
                    return false;
                }
                return true;

            case 2: // Additional Information  
                if (!formData.eye_color || !formData.relationship_status || !formData.job_category) {
                    toast({
                        title: "Validation Error",
                        description: "Please fill in all required fields.",
                        variant: "destructive"
                    });
                    return false;
                }
                return true;

            case 3: // Profile Display
                if (!formData.mobile) {
                    toast({
                        title: "Validation Error",
                        description: "Mobile number is required.",
                        variant: "destructive"
                    });
                    return false;
                }

                if (!isValidPhone(formData.mobile)) {
                    toast({
                        title: "Validation Error",
                        description: "Please enter a valid mobile number.",
                        variant: "destructive"
                    });
                    return false;
                }

                // Validate at least one link
                const validLinks = links.filter(link => link.url.trim() && link.categoryId);
                if (validLinks.length === 0) {
                    toast({
                        title: "Validation Error",
                        description: "Please add at least one link.",
                        variant: "destructive"
                    });
                    return false;
                }

                // Validate all provided URLs
                for (const link of validLinks) {
                    if (!isValidUrl(link.url)) {
                        toast({
                            title: "Invalid URL",
                            description: `Please enter a valid URL for ${link.label || 'your link'}.`,
                            variant: "destructive"
                        });
                        return false;
                    }
                }
                return true;

            case 4: // Terms & Privacy
                if (!formData.terms_accepted || !formData.privacy_accepted) {
                    toast({
                        title: "Validation Error",
                        description: "Please accept the Terms & Conditions and Privacy Policy.",
                        variant: "destructive"
                    });
                    return false;
                }
                return true;

            default:
                return true;
        }
    };

    const handleNext = async () => {
        if (!validateStep()) return;

        setLoading(true);

        try {
            if (currentStep < ONBOARDING_STEPS.length - 1) {
                await saveProgress(formData, currentStep + 1);
                setCurrentStep(currentStep + 1);
            } else {
                // Complete onboarding
                await completeOnboarding();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const completeOnboarding = async () => {
        const rateLimitKey = `onboarding_${user.user_code}`;

        const result = await secureApiCall(async () => {
            // Hash password for storage (in production, do this server-side)
            const hashedPassword = await hashPassword(passwords.password);

            // Update user as completed
            const { error: userError } = await supabase
                .from('users')
                .update({
                    ...formData,
                    is_onboarding_complete: true,
                    onboarding_step: ONBOARDING_STEPS.length,
                    password_hash: hashedPassword
                })
                .eq('id', user.id);

            if (userError) throw userError;

            // Save user links
            const validLinks = links.filter(link => link.url.trim() && link.categoryId);
            const userLinks: UserLink[] = [];

            for (let i = 0; i < validLinks.length; i++) {
                const link = validLinks[i];
                const { data, error } = await supabase
                    .from('user_links')
                    .insert({
                        user_id: user.id,
                        label: link.label || linkCategories.find(c => c.id === link.categoryId)?.name || 'Link',
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

            return userLinks;
        }, rateLimitKey);

        if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive"
            });
            return;
        }

        const completedUser = {
            ...user,
            ...formData,
            is_onboarding_complete: true,
            onboarding_step: ONBOARDING_STEPS.length
        };

        onComplete(completedUser, result.data || []);

        toast({
            title: "Welcome!",
            description: "Your profile has been set up successfully.",
        });
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0: // E3 Circle Registration
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="userCode">E3 Number</Label>
                            <Input id="userCode" value={user.user_code} disabled className="bg-gray-100" />
                        </div>
                        <div>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateFormData('email', e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password *</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={passwords.password}
                                    onChange={(e) => setPasswords(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder="Enter password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword">Re-enter Password *</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="Confirm password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                );

            case 1: // Personal Details
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => updateFormData('name', e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) => updateFormData('date_of_birth', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="gender">Gender *</Label>
                            <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="non-binary">Non-binary</SelectItem>
                                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );

            case 2: // Additional Information
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="eyeColor">Eye Color *</Label>
                            <Select value={formData.eye_color} onValueChange={(value) => updateFormData('eye_color', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select eye color" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="brown">Brown</SelectItem>
                                    <SelectItem value="blue">Blue</SelectItem>
                                    <SelectItem value="green">Green</SelectItem>
                                    <SelectItem value="hazel">Hazel</SelectItem>
                                    <SelectItem value="gray">Gray</SelectItem>
                                    <SelectItem value="amber">Amber</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="relationship">Relationship Status *</Label>
                            <Select value={formData.relationship_status} onValueChange={(value) => updateFormData('relationship_status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select relationship status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="single">Single</SelectItem>
                                    <SelectItem value="in-relationship">In a relationship</SelectItem>
                                    <SelectItem value="married">Married</SelectItem>
                                    <SelectItem value="divorced">Divorced</SelectItem>
                                    <SelectItem value="widowed">Widowed</SelectItem>
                                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="jobCategory">Job Category *</Label>
                            <Select value={formData.job_category} onValueChange={(value) => updateFormData('job_category', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select job category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fitness">Fitness</SelectItem>
                                    <SelectItem value="clothing">Clothing</SelectItem>
                                    <SelectItem value="beauty">Beauty</SelectItem>
                                    <SelectItem value="business">Business</SelectItem>
                                    <SelectItem value="technology">Technology</SelectItem>
                                    <SelectItem value="creative-art">Creative & Art</SelectItem>
                                    <SelectItem value="academic">Academic</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {formData.job_category && (
                            <div>
                                <Label htmlFor="jobTitle">Job Title</Label>
                                <Input
                                    id="jobTitle"
                                    value={formData.job_title}
                                    onChange={(e) => updateFormData('job_title', e.target.value)}
                                    placeholder="Enter your job title"
                                />
                            </div>
                        )}
                    </div>
                );

            case 3: // Profile Display
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="mobile">Mobile Number *</Label>
                            <Input
                                id="mobile"
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => updateFormData('mobile', e.target.value)}
                                placeholder="Enter your mobile number"
                            />
                        </div>

                        <div>
                            <Label>Links</Label>
                            {links.map((link, index) => (
                                <div key={index} className="space-y-2 p-3 border rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-sm">Link {index + 1}</Label>
                                        {index === 0 && <span className="text-xs text-gray-500">(Required)</span>}
                                    </div>

                                    <div>
                                        <Label htmlFor={`linkUrl${index}`}>URL</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id={`linkUrl${index}`}
                                                value={link.url}
                                                onChange={(e) => {
                                                    const newLinks = [...links];
                                                    newLinks[index].url = e.target.value;
                                                    setLinks(newLinks);
                                                }}
                                                placeholder="Paste your URL here"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowUrlHelp(!showUrlHelp)}
                                            >
                                                <HelpCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {showUrlHelp && (
                                            <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                                                <p className="font-medium mb-1">How to copy a URL:</p>
                                                <p>1. Go to your social media profile or website</p>
                                                <p>2. Copy the web address from your browser's address bar</p>
                                                <p>3. Paste it in the URL field above</p>
                                                <p className="text-blue-600 mt-1">Example: https://instagram.com/yourusername</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor={`linkCategory${index}`}>Category</Label>
                                        <Select
                                            value={link.categoryId}
                                            onValueChange={(value) => {
                                                const newLinks = [...links];
                                                newLinks[index].categoryId = value;
                                                newLinks[index].label = linkCategories.find(c => c.id === value)?.name || '';
                                                setLinks(newLinks);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {linkCategories.map(category => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <Label htmlFor="profilePhoto">Profile Photo</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="profilePhoto"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const validation = validateFileUpload(file);
                                            if (!validation.isValid) {
                                                toast({
                                                    title: "Invalid File",
                                                    description: validation.error,
                                                    variant: "destructive"
                                                });
                                                e.target.value = ''; // Clear the input
                                                return;
                                            }

                                            // In production, upload to secure storage service
                                            // For demo, create object URL
                                            updateFormData('profile_photo_url', URL.createObjectURL(file));
                                            toast({
                                                title: "Photo uploaded",
                                                description: "Profile photo has been selected successfully.",
                                            });
                                        }
                                    }}
                                />
                                <Button type="button" variant="outline" size="sm">
                                    <Upload className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Max size: 5MB. Supported formats: JPEG, PNG, WebP
                            </p>
                        </div>
                    </div>
                );

            case 4: // Terms & Privacy
                return (
                    <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="terms"
                                checked={formData.terms_accepted}
                                onCheckedChange={(checked) => updateFormData('terms_accepted', checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    I accept the Terms and Conditions *
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    By checking this box, you agree to our terms of service.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="privacy"
                                checked={formData.privacy_accepted}
                                onCheckedChange={(checked) => updateFormData('privacy_accepted', checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="privacy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    I accept the Privacy Policy *
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    By checking this box, you agree to our privacy policy.
                                </p>
                            </div>
                        </div>

                        <Alert>
                            <AlertDescription>
                                Welcome to E3 Circle! Once you complete this step, your profile will be live and accessible to others.
                            </AlertDescription>
                        </Alert>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <DynamicBackground>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                        <CardHeader>
                            <div className="space-y-2">
                                <Progress value={progress} className="w-full" />
                                <CardTitle className="text-center">
                                    {ONBOARDING_STEPS[currentStep]}
                                </CardTitle>
                                <p className="text-sm text-center text-gray-600">
                                    Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                                </p>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {renderStep()}

                            <div className="flex gap-2">
                                {currentStep > 0 && (
                                    <Button
                                        variant="outline"
                                        onClick={handleBack}
                                        className="flex-1"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back
                                    </Button>
                                )}

                                <Button
                                    onClick={handleNext}
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    {loading ? (
                                        "Saving..."
                                    ) : currentStep === ONBOARDING_STEPS.length - 1 ? (
                                        "Complete Setup"
                                    ) : (
                                        <>
                                            Next
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DynamicBackground>
    );
};

export default OnboardingFlow;