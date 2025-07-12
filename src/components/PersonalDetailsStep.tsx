import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, Eye, Mail, Phone, MapPin, Users, Heart, Briefcase } from 'lucide-react';
import {
    VALIDATION_RULES,
    GENDER_OPTIONS,
    EYE_COLOR_OPTIONS,
    RELATIONSHIP_STATUS_OPTIONS,
    JOB_TITLE_OPTIONS
} from '@/constants';
import { OnboardingFormData } from '@/types';

interface PersonalDetailsStepProps {
    formData: Partial<OnboardingFormData>;
    passwords: { password: string; confirmPassword: string };
    onFormDataChange: (field: string, value: any) => void;
    onPasswordChange: (passwords: { password: string; confirmPassword: string }) => void;
    onNext: () => void;
    onBack: () => void;
    loading: boolean;
    userCode: string;
}

const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({
    formData,
    passwords,
    onFormDataChange,
    onPasswordChange,
    onNext,
    onBack,
    loading,
    userCode
}) => {
    // Location options for London areas
    const LOCATION_OPTIONS = [
        { value: 'north_london', label: 'North London' },
        { value: 'east_london', label: 'East London' },
        { value: 'west_london', label: 'West London' },
        { value: 'south_london', label: 'South London' },
        { value: 'central_london', label: 'Central London' },
        { value: 'other', label: 'Other' }
    ];

    const isValid = () => {
        // Core required fields that exist in the database
        const requiredFields = {
            name: formData.name,
            date_of_birth: formData.date_of_birth,
            gender: formData.gender,
            eye_color: formData.eye_color,
            email: formData.email,
            mobile: formData.mobile,
            location: formData.location,
            relationship_status: formData.relationship_status,
            job_title: formData.job_title
        };

        // Check all required fields are filled
        const allFieldsFilled = Object.values(requiredFields).every(field => field && field.trim() !== '');

        // Log for debugging
        if (!allFieldsFilled) {
            console.log('Missing fields:', Object.entries(requiredFields).filter(([key, value]) => !value || value.trim() === ''));
        }

        return allFieldsFilled;
    };

    const filledFields = Object.keys(formData).filter(key =>
        ['name', 'date_of_birth', 'eye_color', 'email', 'mobile', 'location', 'gender', 'relationship_status', 'job_title'].includes(key) &&
        formData[key as keyof OnboardingFormData]
    ).length;

    return (
        <div className="min-h-screen bg-brand-white px-4 sm:px-6 md:px-8 pb-16">
            <div className="max-w-6xl mx-auto">

                {/* FLOATING HEADER */}
                <div className="text-center mb-12 md:mb-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-black/10 to-transparent h-px top-1/2"></div>
                    <div className="relative bg-brand-white px-6 sm:px-12 inline-block">
                        <h1 className="text-4xl md:text-6xl font-light text-brand-black tracking-wide mb-3 md:mb-4">
                            Personal <span className="font-semibold">Details</span>
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-brand-black/60">
                            <div className="w-6 md:w-8 h-px bg-brand-black/20"></div>
                            <span className="text-sm md:text-lg tracking-widest uppercase">Complete Your Profile</span>
                            <div className="w-6 md:w-8 h-px bg-brand-black/20"></div>
                        </div>
                    </div>
                </div>

                {/* Progress Arc */}
                <div className="flex justify-center mb-12 md:mb-16">
                    <div className="relative w-24 md:w-32 h-12 md:h-16">
                        <svg className="w-full h-full" viewBox="0 0 100 50">
                            <path
                                d="M 10 40 Q 50 10 90 40"
                                stroke="var(--brand-black)"
                                strokeWidth="1"
                                fill="none"
                                opacity="0.2"
                            />
                            <path
                                d="M 10 40 Q 50 10 90 40"
                                stroke="var(--brand-black)"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="100"
                                strokeDashoffset={100 - (filledFields / 9) * 100}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-end justify-center">
                            <span className="text-xs font-medium text-brand-black/60 tracking-wider">
                                {filledFields}/9
                            </span>
                        </div>
                    </div>
                </div>

                {/* THREE HORIZONTAL CONTAINERS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">

                    {/* Container 1: Identity */}
                    <div className="bg-brand-black rounded-2xl p-8 backdrop-blur-sm shadow-lg border border-brand-black/20 hover:transform hover:translateY(-2px) transition-all duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-brand-white to-brand-white/80 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                <User className="h-8 w-8 text-brand-black" />
                            </div>
                            <h3 className="text-2xl font-light text-brand-white tracking-wide">Identity</h3>
                            <div className="w-12 h-px bg-brand-white/20 mx-auto mt-2"></div>
                        </div>

                        <div className="space-y-6">
                            <div className="relative">
                                <Label className="absolute -top-2 left-4 bg-brand-black px-2 text-sm font-medium text-brand-white/70 z-10">
                                    Full Name
                                </Label>
                                <Input
                                    value={formData.name || ''}
                                    onChange={(e) => onFormDataChange('name', e.target.value)}
                                    className="h-14 bg-transparent border-2 border-brand-white/10 rounded-2xl text-lg text-brand-white focus:border-brand-white focus:ring-0 transition-all duration-300 hover:border-brand-white/30"
                                    maxLength={VALIDATION_RULES.NAME.MAX_LENGTH}
                                />
                            </div>

                            <div className="relative">
                                <Label className="absolute -top-2 left-4 bg-brand-black px-2 text-sm font-medium text-brand-white/70 z-10">
                                    Date of Birth
                                </Label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={formData.date_of_birth || ''}
                                        onChange={(e) => onFormDataChange('date_of_birth', e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="h-14 bg-transparent border-2 border-brand-white/10 rounded-2xl text-lg text-brand-white focus:border-brand-white focus:ring-0 transition-all duration-300 hover:border-brand-white/30 pl-12"
                                    />
                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-white/40" />
                                </div>
                            </div>

                            <div className="relative">
                                <Label className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-brand-black px-2 text-sm font-medium text-brand-white/70 z-10">
                                    Eye Color
                                </Label>
                                <div className="pt-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        {/* Blue - Sea/Waves */}
                                        <Button
                                            onClick={() => onFormDataChange('eye_color', 'blue')}
                                            variant="ghost"
                                            className={`h-16 flex-col gap-2 border-2 rounded-xl transition-all duration-300 text-brand-white hover:text-brand-white hover:scale-105 ${formData.eye_color === 'blue'
                                                ? 'bg-brand-white/25 border-brand-white/50 shadow-lg'
                                                : 'bg-brand-white/15 border-brand-white/30 hover:bg-brand-white/25 hover:border-brand-white/50'
                                                }`}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                                                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                                                <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                                            </svg>
                                            <span className="text-xs text-center">Blue</span>
                                        </Button>

                                        {/* Brown - Earth/Circle */}
                                        <Button
                                            onClick={() => onFormDataChange('eye_color', 'brown')}
                                            variant="ghost"
                                            className={`h-16 flex-col gap-2 border-2 rounded-xl transition-all duration-300 text-brand-white hover:text-brand-white hover:scale-105 ${formData.eye_color === 'brown'
                                                ? 'bg-brand-white/25 border-brand-white/50 shadow-lg'
                                                : 'bg-brand-white/15 border-brand-white/30 hover:bg-brand-white/25 hover:border-brand-white/50'
                                                }`}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M8 12h4" />
                                                <path d="M8 16h2" />
                                                <path d="M16 8h2" />
                                                <path d="M14 12h2" />
                                                <path d="M10 8h2" />
                                            </svg>
                                            <span className="text-xs text-center">Brown</span>
                                        </Button>

                                        {/* Green - Plant/Leaf */}
                                        <Button
                                            onClick={() => onFormDataChange('eye_color', 'green')}
                                            variant="ghost"
                                            className={`h-16 flex-col gap-2 border-2 rounded-xl transition-all duration-300 text-brand-white hover:text-brand-white hover:scale-105 ${formData.eye_color === 'green'
                                                ? 'bg-brand-white/25 border-brand-white/50 shadow-lg'
                                                : 'bg-brand-white/15 border-brand-white/30 hover:bg-brand-white/25 hover:border-brand-white/50'
                                                }`}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M7 20s-4-7 6-11c0 0-3 1-3 5 0 0 4-2 8 2" />
                                                <path d="M12 19s4-7-6-11c0 0 3 1 3 5 0 0-4-2-8 2" />
                                                <path d="M12 22v-8" />
                                            </svg>
                                            <span className="text-xs text-center">Green</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Container 2: Contact */}
                    <div className="bg-brand-black rounded-2xl p-8 backdrop-blur-sm shadow-lg border border-brand-black/20 hover:transform hover:translateY(-2px) transition-all duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-brand-white to-brand-white/80 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                <Mail className="h-8 w-8 text-brand-black" />
                            </div>
                            <h3 className="text-2xl font-light text-brand-white tracking-wide">Contact</h3>
                            <div className="w-12 h-px bg-brand-white/20 mx-auto mt-2"></div>
                        </div>

                        <div className="space-y-6">
                            <div className="relative">
                                <Label className="absolute -top-2 left-4 bg-brand-black px-2 text-sm font-medium text-brand-white/70 z-10">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={(e) => onFormDataChange('email', e.target.value)}
                                        className="h-14 bg-transparent border-2 border-brand-white/10 rounded-2xl text-lg text-brand-white focus:border-brand-white focus:ring-0 transition-all duration-300 hover:border-brand-white/30 pl-12"
                                    />
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-white/40" />
                                </div>
                            </div>

                            <div className="relative">
                                <Label className="absolute -top-2 left-4 bg-brand-black px-2 text-sm font-medium text-brand-white/70 z-10">
                                    Phone Number
                                </Label>
                                <div className="relative">
                                    <Input
                                        type="tel"
                                        value={formData.mobile || ''}
                                        onChange={(e) => onFormDataChange('mobile', e.target.value)}
                                        className="h-14 bg-transparent border-2 border-brand-white/10 rounded-2xl text-lg text-brand-white focus:border-brand-white focus:ring-0 transition-all duration-300 hover:border-brand-white/30 pl-12"
                                        minLength={VALIDATION_RULES.MOBILE.MIN_LENGTH}
                                        maxLength={VALIDATION_RULES.MOBILE.MAX_LENGTH}
                                    />
                                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-white/40" />
                                </div>
                            </div>

                            <div className="relative">
                                <Label className="absolute -top-2 left-4 bg-brand-black px-2 text-sm font-medium text-brand-white/70 z-10">
                                    Location
                                </Label>
                                <div className="relative">
                                    <Select value={formData.location || ''} onValueChange={(value) => onFormDataChange('location', value)}>
                                        <SelectTrigger className="h-14 bg-transparent border-2 border-brand-white/10 rounded-2xl text-lg text-brand-white focus:border-brand-white focus:ring-0 transition-all duration-300 hover:border-brand-white/30 pl-12">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LOCATION_OPTIONS.map((location) => (
                                                <SelectItem key={location.value} value={location.value}>
                                                    {location.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-white/40" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Container 3: Personal */}
                    <div className="bg-brand-black rounded-2xl p-8 backdrop-blur-sm shadow-lg border border-brand-black/20 hover:transform hover:translateY(-2px) transition-all duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-brand-white to-brand-white/80 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                <Heart className="h-8 w-8 text-brand-black" />
                            </div>
                            <h3 className="text-2xl font-light text-brand-white tracking-wide">Personal</h3>
                            <div className="w-12 h-px bg-brand-white/20 mx-auto mt-2"></div>
                        </div>

                        <div className="space-y-6">
                            <div className="relative">
                                <Label className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-brand-black px-2 text-sm font-medium text-brand-white/70 z-10">
                                    Gender
                                </Label>
                                <div className="pt-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        {/* Male */}
                                        <Button
                                            onClick={() => onFormDataChange('gender', 'male')}
                                            variant="ghost"
                                            className={`h-16 flex-col gap-2 border-2 rounded-xl transition-all duration-300 text-brand-white hover:text-brand-white hover:scale-105 ${formData.gender === 'male'
                                                ? 'bg-brand-white/25 border-brand-white/50 shadow-lg'
                                                : 'bg-brand-white/15 border-brand-white/30 hover:bg-brand-white/25 hover:border-brand-white/50'
                                                }`}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="10" cy="14" r="6" />
                                                <path d="m15 9 5-5" />
                                                <path d="m20 4-2 2" />
                                                <path d="m20 4 2 2" />
                                            </svg>
                                            <span className="text-xs text-center">Male</span>
                                        </Button>

                                        {/* Female */}
                                        <Button
                                            onClick={() => onFormDataChange('gender', 'female')}
                                            variant="ghost"
                                            className={`h-16 flex-col gap-2 border-2 rounded-xl transition-all duration-300 text-brand-white hover:text-brand-white hover:scale-105 ${formData.gender === 'female'
                                                ? 'bg-brand-white/25 border-brand-white/50 shadow-lg'
                                                : 'bg-brand-white/15 border-brand-white/30 hover:bg-brand-white/25 hover:border-brand-white/50'
                                                }`}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="8" r="7" />
                                                <path d="M12 15v6" />
                                                <path d="M9 18h6" />
                                            </svg>
                                            <span className="text-xs text-center">Female</span>
                                        </Button>

                                        {/* Other */}
                                        <Button
                                            onClick={() => onFormDataChange('gender', 'other')}
                                            variant="ghost"
                                            className={`h-16 flex-col gap-2 border-2 rounded-xl transition-all duration-300 text-brand-white hover:text-brand-white hover:scale-105 ${formData.gender === 'other'
                                                ? 'bg-brand-white/25 border-brand-white/50 shadow-lg'
                                                : 'bg-brand-white/15 border-brand-white/30 hover:bg-brand-white/25 hover:border-brand-white/50'
                                                }`}
                                        >
                                            <Users size={20} />
                                            <span className="text-xs text-center">Other</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <Label className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-brand-black px-2 text-sm text-brand-white/70 z-10">Relationship</Label>
                                <div className="pt-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: 'single', label: 'Single' },
                                            { value: 'complicated', label: "It's\nComplicated" },
                                            { value: 'in-relationship', label: 'In a\nRelationship' }
                                        ].map(({ value, label }) => (
                                            <Button
                                                key={value}
                                                onClick={() => onFormDataChange('relationship_status', value)}
                                                variant="ghost"
                                                className={`h-20 flex-col gap-1 border-2 rounded-xl transition-all duration-300 text-brand-white hover:text-brand-white hover:scale-105 text-xs text-center leading-snug ${formData.relationship_status === value ? 'bg-brand-white/25 border-brand-white/50 shadow-lg' : 'bg-brand-white/15 border-brand-white/30 hover:bg-brand-white/25 hover:border-brand-white/50'}`}
                                            >
                                                <Users size={20} />
                                                <span className="whitespace-pre-line">{label}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            <div className="relative">
                                <Label className="absolute -top-2 left-4 bg-brand-black px-2 text-sm font-medium text-brand-white/70 z-10">
                                    Job Title
                                </Label>
                                <div className="relative">
                                    <Select value={formData.job_title || ''} onValueChange={(value) => onFormDataChange('job_title', value)}>
                                        <SelectTrigger className="h-14 bg-transparent border-2 border-brand-white/10 rounded-2xl text-lg text-brand-white focus:border-brand-white focus:ring-0 transition-all duration-300 hover:border-brand-white/30 pl-12">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {JOB_TITLE_OPTIONS.map((job) => (
                                                <SelectItem key={job.value} value={job.value}>
                                                    {job.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-white/40" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Single Continue Button */}
                <div className="flex justify-center">
                    <Button
                        onClick={onNext}
                        disabled={loading || !isValid()}
                        className={`h-12 px-6 sm:px-8 rounded-full transition-all duration-300 w-full max-w-xs sm:max-w-sm md:max-w-md
          ${isValid() && !loading
                                ? 'bg-brand-black hover:bg-brand-black/90 animate-pulse cursor-pointer text-brand-white'
                                : 'bg-brand-black/50 cursor-not-allowed opacity-50 text-brand-white'}`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-brand-white/30 border-t-brand-white rounded-full animate-spin"></div>
                                Saving
                            </div>
                        ) : (
                            'Continue'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetailsStep;