import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import DynamicBackground from '@/components/DynamicBackground';
import { Eye, EyeOff, ArrowLeft, ArrowRight, Upload, HelpCircle, CheckCircle } from 'lucide-react';
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
import {
    User,
    UserLink,
    LinkCategory,
    OnboardingFormData
} from '@/types';
import {
    VALIDATION_RULES,
    GENDER_OPTIONS,
    EYE_COLOR_OPTIONS,
    RELATIONSHIP_STATUS_OPTIONS,
    JOB_CATEGORY_OPTIONS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    FILE_UPLOAD,
    EXTERNAL_LINKS
} from '@/constants';

interface OnboardingFlowProps {
    user: User;
    onUpdate: (user: User) => void;
    onComplete: (user: User, links: UserLink[]) => void;
}

const NEW_ONBOARDING_STEPS = [
    'Welcome to E3 Circle',
    'Personal Details',
    'Your Links',
    'Photo & Bio',
    'Terms & Privacy',
    'Complete Setup'
] as const;

// Position-specific link categories based on client requirements
const LINK_CATEGORIES_BY_POSITION = {
    0: [ // Link 1
        { value: 'social-media', label: 'Social Media' },
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone Number' },
        { value: 'business-website', label: 'Business Website' },
        { value: 'personal-website', label: 'Personal Website' },
        { value: 'other', label: 'Other' }
    ],
    1: [ // Link 2
        { value: 'social-media', label: 'Social Media' },
        { value: 'favorite-song', label: 'What is your favourite song?' },
        { value: 'favorite-restaurant', label: 'What is your favourite restaurant?' },
        { value: 'favorite-art', label: 'What is your favourite piece of art?' },
        { value: 'other', label: 'Other' }
    ],
    2: [ // Link 3
        { value: 'social-media', label: 'Social Media' },
        { value: 'affiliation-link', label: 'Affiliation Link' },
        { value: 'business-email', label: 'Business Email' },
        { value: 'portfolio-cv', label: 'Portfolio / CV' },
        { value: 'other', label: 'Other' }
    ]
};

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

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [linkCategories, setLinkCategories] = useState<LinkCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [showUrlHelp, setShowUrlHelp] = useState(false);

    // Welcome GIF state
    const [gifTimeLeft, setGifTimeLeft] = useState(30);
    const [canSkipGif, setCanSkipGif] = useState(false);

    const progress = ((currentStep + 1) / NEW_ONBOARDING_STEPS.length) * 100;

    useEffect(() => {
        fetchLinkCategories();
    }, []);

    // Welcome GIF timer
    useEffect(() => {
        if (currentStep === 0) {
            setCanSkipGif(true); // Allow immediate skip

            const timer = setInterval(() => {
                setGifTimeLeft(prev => {
                    if (prev <= 1) {
                        setCurrentStep(1); // Auto-advance to Personal Details
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [currentStep]);

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

    const updateLinks = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            links: prev.links?.map((link, i) =>
                i === index ? { ...link, [field]: value } : link
            )
        }));
    };

    const updateInterest = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests?.map((interest, i) =>
                i === index ? value : interest
            )
        }));
    };

    const skipWelcome = () => {
        if (canSkipGif) {
            setCurrentStep(1);
        }
    };

    const validateStep = () => {
        switch (currentStep) {
            case 0: // Welcome - no validation needed
                return true;

            case 1: // Personal Details
                const requiredFields = ['name', 'date_of_birth', 'eye_color', 'email', 'mobile', 'postcode', 'gender', 'relationship_status', 'job_category'];

                for (const field of requiredFields) {
                    if (!formData[field]) {
                        toast({
                            title: "Validation Error",
                            description: `${field.replace('_', ' ')} is required.`,
                            variant: "destructive"
                        });
                        return false;
                    }
                }

                if (!isValidEmail(formData.email)) {
                    toast({
                        title: "Validation Error",
                        description: "Please enter a valid email address.",
                        variant: "destructive"
                    });
                    return false;
                }

                if (!isValidPhone(formData.mobile)) {
                    toast({
                        title: "Validation Error",
                        description: "Please enter a valid phone number.",
                        variant: "destructive"
                    });
                    return false;
                }

                // Password validation
                if (!passwords.password || !passwords.confirmPassword) {
                    toast({
                        title: "Validation Error",
                        description: "Password is required.",
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

            case 2: // Links
                const validLinks = formData.links?.filter(link => link.url.trim() && link.categoryId) || [];
                if (validLinks.length === 0) {
                    toast({
                        title: "Validation Error",
                        description: "Please add at least one link.",
                        variant: "destructive"
                    });
                    return false;
                }

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

            case 3: // Photo & Bio
                if (!formData.bio_description?.trim()) {
                    toast({
                        title: "Validation Error",
                        description: "Bio description is required.",
                        variant: "destructive"
                    });
                    return false;
                }

                const filledInterests = formData.interests?.filter(interest => interest.trim()) || [];
                if (filledInterests.length < 3) {
                    toast({
                        title: "Validation Error",
                        description: "Please name 3 things that interest you.",
                        variant: "destructive"
                    });
                    return false;
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

            case 5: // Completion - no validation needed
                return true;

            default:
                return true;
        }
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
                description: ERROR_MESSAGES.GENERIC_ERROR,
                variant: "destructive"
            });
        }
    };

    const handleNext = async () => {
        if (!validateStep()) return;

        setLoading(true);

        try {
            if (currentStep < NEW_ONBOARDING_STEPS.length - 1) {
                await saveProgress(formData as Partial<User>, currentStep + 1);
                setCurrentStep(currentStep + 1);
            } else {
                await completeOnboarding();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) { // Can't go back to welcome GIF
            setCurrentStep(currentStep - 1);
        }
    };

    const completeOnboarding = async () => {
        try {
            // Hash password
            const hashedPassword = await hashPassword(passwords.password);

            // Update user as completed
            const { error: userError } = await supabase
                .from('users')
                .update({
                    ...formData,
                    is_onboarding_complete: true,
                    onboarding_step: NEW_ONBOARDING_STEPS.length,
                    password_hash: hashedPassword
                })
                .eq('id', user.id);

            if (userError) throw userError;

            // Save user links
            const validLinks = formData.links?.filter(link => link.url.trim() && link.categoryId) || [];
            const userLinks: UserLink[] = [];

            for (let i = 0; i < validLinks.length; i++) {
                const link = validLinks[i];
                const { data, error } = await supabase
                    .from('user_links')
                    .insert({
                        user_id: user.id,
                        label: link.label || 'Link',
                        url: link.url,
                        category_id: link.categoryId,
                        description: link.description,
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

            const completedUser = {
                ...user,
                ...formData,
                is_onboarding_complete: true,
                onboarding_step: NEW_ONBOARDING_STEPS.length
            } as User;

            // Show completion step briefly, then complete
            setCurrentStep(5);

            setTimeout(() => {
                onComplete(completedUser, userLinks);
                toast({
                    title: "Welcome!",
                    description: SUCCESS_MESSAGES.ONBOARDING_COMPLETE,
                });
            }, 3000); // Show completion for 3 seconds

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
            case 0: // Welcome GIF
                return (
                    <div className="text-center space-y-6">
                        <div className="w-full max-w-md mx-auto">
                            <img
                                src="/welcome.gif"
                                alt="Welcome to E3 Circle"
                                className="w-full h-auto rounded-lg shadow-lg"
                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                            />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl font-bold text-white">Welcome to E3 Circle!</h2>
                            <p className="text-xl text-white/80">Let's set up your profile</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <p className="text-white text-lg">Auto-advancing in {gifTimeLeft} seconds</p>
                            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                <div
                                    className="bg-white h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${((30 - gifTimeLeft) / 30) * 100}%` }}
                                />
                            </div>
                        </div>

                        {canSkipGif && (
                            <Button
                                onClick={skipWelcome}
                                size="lg"
                                className="bg-white text-black hover:bg-white/90"
                            >
                                Skip Introduction
                            </Button>
                        )}
                    </div>
                );

            case 1: // Personal Details (Consolidated)
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name || ''}
                                    onChange={(e) => updateFormData('name', e.target.value)}
                                    placeholder="Enter your full name"
                                    maxLength={VALIDATION_RULES.NAME.MAX_LENGTH}
                                />
                            </div>
                            <div>
                                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    value={formData.date_of_birth || ''}
                                    onChange={(e) => updateFormData('date_of_birth', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="eyeColor">Eye Colour *</Label>
                                <Select value={formData.eye_color || ''} onValueChange={(value) => updateFormData('eye_color', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select eye colour" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EYE_COLOR_OPTIONS.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="gender">Gender *</Label>
                                <Select value={formData.gender || ''} onValueChange={(value) => updateFormData('gender', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GENDER_OPTIONS.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email || ''}
                                onChange={(e) => updateFormData('email', e.target.value)}
                                placeholder="Enter your email"
                                maxLength={VALIDATION_RULES.EMAIL.MAX_LENGTH}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="mobile">Phone Number *</Label>
                                <Input
                                    id="mobile"
                                    type="tel"
                                    value={formData.mobile || ''}
                                    onChange={(e) => updateFormData('mobile', e.target.value)}
                                    placeholder="Enter your phone number"
                                    maxLength={VALIDATION_RULES.MOBILE.MAX_LENGTH}
                                />
                            </div>
                            <div>
                                <Label htmlFor="postcode">Postcode *</Label>
                                <Input
                                    id="postcode"
                                    value={formData.postcode || ''}
                                    onChange={(e) => updateFormData('postcode', e.target.value)}
                                    placeholder="Enter your postcode"
                                    maxLength={20}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="relationship">Relationship Status *</Label>
                            <Select value={formData.relationship_status || ''} onValueChange={(value) => updateFormData('relationship_status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select relationship status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {RELATIONSHIP_STATUS_OPTIONS.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="jobCategory">Occupation *</Label>
                                <Select value={formData.job_category || ''} onValueChange={(value) => updateFormData('job_category', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select occupation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {JOB_CATEGORY_OPTIONS.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {formData.job_category && (
                                <div>
                                    <Label htmlFor="jobTitle">Job Title</Label>
                                    <Input
                                        id="jobTitle"
                                        value={formData.job_title || ''}
                                        onChange={(e) => updateFormData('job_title', e.target.value)}
                                        placeholder="Enter your job title"
                                        maxLength={100}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Password Section */}
                        <div className="border-t pt-4 mt-6">
                            <h3 className="text-lg font-semibold mb-4">Account Security</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="password">Password *</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={passwords.password}
                                            onChange={(e) => setPasswords(prev => ({ ...prev, password: e.target.value }))}
                                            placeholder="Enter password"
                                            maxLength={VALIDATION_RULES.PASSWORD.MAX_LENGTH}
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
                                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            placeholder="Confirm password"
                                            maxLength={VALIDATION_RULES.PASSWORD.MAX_LENGTH}
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
                        </div>
                    </div>
                );

            case 2: // Your Links (3 links with position-specific categories)
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">Add Your Links</h3>
                            <p className="text-sm text-gray-600">Share your social media, websites, and other important links</p>
                        </div>

                        {formData.links?.map((link, index) => (
                            <div key={index} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-semibold">Link {index + 1}</Label>
                                    {index === 0 && <span className="text-xs text-red-500">(Required)</span>}
                                </div>

                                <div>
                                    <Label htmlFor={`linkCategory${index}`}>Category</Label>
                                    <Select
                                        value={link.categoryId}
                                        onValueChange={(value) => updateLinks(index, 'categoryId', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LINK_CATEGORIES_BY_POSITION[index as keyof typeof LINK_CATEGORIES_BY_POSITION]?.map(category => (
                                                <SelectItem key={category.value} value={category.value}>
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor={`linkUrl${index}`}>URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id={`linkUrl${index}`}
                                            value={link.url}
                                            onChange={(e) => updateLinks(index, 'url', e.target.value)}
                                            placeholder="Paste your URL here"
                                            maxLength={VALIDATION_RULES.URL.MAX_LENGTH}
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
                                </div>

                                <div>
                                    <Label htmlFor={`linkDescription${index}`}>Description</Label>
                                    <Input
                                        id={`linkDescription${index}`}
                                        value={link.description || ''}
                                        onChange={(e) => updateLinks(index, 'description', e.target.value)}
                                        placeholder="Describe this link (optional)"
                                        maxLength={200}
                                    />
                                </div>
                            </div>
                        ))}

                        {showUrlHelp && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
                                <p className="font-medium mb-2">How to copy a URL:</p>
                                <p>1. Go to your social media profile or website</p>
                                <p>2. Copy the web address from your browser's address bar</p>
                                <p>3. Paste it in the URL field above</p>
                                <p className="text-blue-600 mt-2">Example: https://instagram.com/yourusername</p>
                            </div>
                        )}
                    </div>
                );

            case 3: // Photo & Bio
                return (
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="profilePhoto">Profile Photo</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="profilePhoto"
                                    type="file"
                                    accept={FILE_UPLOAD.ALLOWED_TYPES.join(',')}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const validation = validateFileUpload(file);
                                            if (!validation.isValid) {
                                                toast({
                                                    title: "Invalid File",
                                                    description: validation.errors[0],
                                                    variant: "destructive"
                                                });
                                                e.target.value = '';
                                                return;
                                            }
                                            updateFormData('profile_photo_url', URL.createObjectURL(file));
                                            toast({
                                                title: "Photo uploaded",
                                                description: SUCCESS_MESSAGES.PHOTO_UPLOADED,
                                            });
                                        }
                                    }}
                                />
                                <Button type="button" variant="outline" size="sm">
                                    <Upload className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Max size: {FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB.
                                This picture will represent you.
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="bioDescription">Bio Description *</Label>
                            <Textarea
                                id="bioDescription"
                                value={formData.bio_description || ''}
                                onChange={(e) => updateFormData('bio_description', e.target.value)}
                                placeholder="Write a short description of who you are..."
                                rows={4}
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {(formData.bio_description || '').length}/500 characters
                            </p>
                        </div>

                        <div>
                            <Label>Name 3 things that interest you *</Label>
                            <div className="space-y-2 mt-2">
                                {[0, 1, 2].map((index) => (
                                    <Input
                                        key={index}
                                        value={formData.interests?.[index] || ''}
                                        onChange={(e) => updateInterest(index, e.target.value)}
                                        placeholder={`Interest ${index + 1}`}
                                        maxLength={100}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 4: // Terms & Privacy
                return (
                    <div className="space-y-6">
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="terms"
                                checked={formData.terms_accepted}
                                onCheckedChange={(checked) => updateFormData('terms_accepted', checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    I accept the{' '}
                                    <a
                                        href={EXTERNAL_LINKS.TERMS_OF_SERVICE}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Terms and Conditions
                                    </a> *
                                </Label>
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
                                    I accept the{' '}
                                    <a
                                        href={EXTERNAL_LINKS.PRIVACY_POLICY}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Privacy Policy
                                    </a> *
                                </Label>
                            </div>
                        </div>

                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="communication"
                                checked={formData.communication_preferences}
                                onCheckedChange={(checked) => updateFormData('communication_preferences', checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="communication" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Contact me about updates (no marketing emails)
                                </Label>
                            </div>
                        </div>

                        <Alert>
                            <AlertDescription>
                                Welcome to E3 Circle! Once you complete this step, your profile will be live and accessible to others.
                            </AlertDescription>
                        </Alert>
                    </div>
                );

            case 5: // Completion Page
                return (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
                            <p className="text-gray-600">Your E3 Circle profile is now live</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-2">⚠️ Important:</p>
                            <p className="text-sm">These details are now fixed and complete the transaction. Redirecting to your live profile...</p>
                        </div>

                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Don't show progress and navigation for welcome and completion steps
    const showNavigation = currentStep > 0 && currentStep < 5;
    const showProgress = currentStep > 0 && currentStep < 5;

    return (
        <DynamicBackground>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                        <CardHeader>
                            <div className="space-y-2">
                                {showProgress && (
                                    <Progress value={progress} className="w-full" />
                                )}
                                <CardTitle className="text-center text-3xl" style={{ fontSize: '50px' }}>
                                    {NEW_ONBOARDING_STEPS[currentStep]}
                                </CardTitle>
                                {showProgress && (
                                    <p className="text-sm text-center text-gray-600" style={{ fontSize: '30px' }}>
                                        Step {currentStep} of {NEW_ONBOARDING_STEPS.length - 2}
                                    </p>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {renderStep()}

                            {showNavigation && (
                                <div className="flex gap-2">
                                    {currentStep > 1 && (
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
                                        ) : currentStep === 4 ? (
                                            "Complete Setup"
                                        ) : (
                                            <>
                                                Next
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DynamicBackground>
    );
};

export default OnboardingFlow;