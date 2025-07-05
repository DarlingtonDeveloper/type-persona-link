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
    RELATIONSHIP_STATUS_OPTIONS
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
            location: formData.location,  // New location field
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
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-7xl mx-auto">

                {/* FLOATING HEADER */}
                <div className="text-center mb-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent h-px top-1/2"></div>
                    <div className="relative bg-black px-12 inline-block">
                        <h1 className="text-6xl font-light text-white tracking-wide mb-4">
                            Personal <span className="font-semibold">Details</span>
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-white/60">
                            <div className="w-8 h-px bg-white/20"></div>
                            <span className="text-lg tracking-widest uppercase">Complete Your Profile</span>
                            <div className="w-8 h-px bg-white/20"></div>
                        </div>
                    </div>
                </div>

                {/* Progress Arc */}
                <div className="flex justify-center mb-16">
                    <div className="relative w-32 h-16">
                        <svg className="w-full h-full" viewBox="0 0 100 50">
                            <path
                                d="M 10 40 Q 50 10 90 40"
                                stroke="#ffffff"
                                strokeWidth="1"
                                fill="none"
                                opacity="0.2"
                            />
                            <path
                                d="M 10 40 Q 50 10 90 40"
                                stroke="#ffffff"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="100"
                                strokeDashoffset={100 - (filledFields / 9) * 100}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-end justify-center">
                            <span className="text-xs font-medium text-white/60 tracking-wider">
                                {filledFields}/9
                            </span>
                        </div>
                    </div>
                </div>

                {/* THREE HORIZONTAL CONTAINERS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                    {/* Container 1: Identity */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-white to-white/80 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                    <User className="h-8 w-8 text-black" />
                                </div>
                                <h3 className="text-2xl font-light text-white tracking-wide">Identity</h3>
                                <div className="w-12 h-px bg-white/20 mx-auto mt-2"></div>
                            </div>

                            <div className="space-y-6">
                                <div className="relative">
                                    <Label className="absolute -top-2 left-4 bg-black px-2 text-sm font-medium text-white/70 z-10">
                                        Full Name
                                    </Label>
                                    <Input
                                        value={formData.name || ''}
                                        onChange={(e) => onFormDataChange('name', e.target.value)}
                                        className="h-14 bg-transparent border-2 border-white/10 rounded-2xl text-lg text-white focus:border-white focus:ring-0 transition-all duration-300 hover:border-white/30"
                                        maxLength={VALIDATION_RULES.NAME.MAX_LENGTH}
                                    />
                                </div>

                                <div className="relative">
                                    <Label className="absolute -top-2 left-4 bg-black px-2 text-sm font-medium text-white/70 z-10">
                                        Date of Birth
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            value={formData.date_of_birth || ''}
                                            onChange={(e) => onFormDataChange('date_of_birth', e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                            className="h-14 bg-transparent border-2 border-white/10 rounded-2xl text-lg text-white focus:border-white focus:ring-0 transition-all duration-300 hover:border-white/30 pl-12"
                                        />
                                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                                    </div>
                                </div>

                                <div className="relative">
                                    <Label className="absolute -top-2 left-4 bg-black px-2 text-sm font-medium text-white/70 z-10">
                                        Eye Colour
                                    </Label>
                                    <div className="relative">
                                        <Select value={formData.eye_color || ''} onValueChange={(value) => onFormDataChange('eye_color', value)}>
                                            <SelectTrigger className="h-14 bg-transparent border-2 border-white/10 rounded-2xl text-lg text-white focus:border-white focus:ring-0 transition-all duration-300 hover:border-white/30 pl-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {EYE_COLOR_OPTIONS.map((color) => (
                                                    <SelectItem key={color.value} value={color.value}>
                                                        {color.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Eye className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Container 2: Contact */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-white to-white/80 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                    <Mail className="h-8 w-8 text-black" />
                                </div>
                                <h3 className="text-2xl font-light text-white tracking-wide">Contact</h3>
                                <div className="w-12 h-px bg-white/20 mx-auto mt-2"></div>
                            </div>

                            <div className="space-y-6">
                                <div className="relative">
                                    <Label className="absolute -top-2 left-4 bg-black px-2 text-sm font-medium text-white/70 z-10">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => onFormDataChange('email', e.target.value)}
                                            className="h-14 bg-transparent border-2 border-white/10 rounded-2xl text-lg text-white focus:border-white focus:ring-0 transition-all duration-300 hover:border-white/30 pl-12"
                                        />
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                                    </div>
                                </div>

                                <div className="relative">
                                    <Label className="absolute -top-2 left-4 bg-black px-2 text-sm font-medium text-white/70 z-10">
                                        Phone Number
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="tel"
                                            value={formData.mobile || ''}
                                            onChange={(e) => onFormDataChange('mobile', e.target.value)}
                                            className="h-14 bg-transparent border-2 border-white/10 rounded-2xl text-lg text-white focus:border-white focus:ring-0 transition-all duration-300 hover:border-white/30 pl-12"
                                            minLength={VALIDATION_RULES.MOBILE.MIN_LENGTH}
                                            maxLength={VALIDATION_RULES.MOBILE.MAX_LENGTH}
                                        />
                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                                    </div>
                                </div>

                                <div className="relative">
                                    <Label className="absolute -top-2 left-4 bg-black px-2 text-sm font-medium text-white/70 z-10">
                                        Location
                                    </Label>
                                    <div className="relative">
                                        <Select value={formData.location || ''} onValueChange={(value) => onFormDataChange('location', value)}>
                                            <SelectTrigger className="h-14 bg-transparent border-2 border-white/10 rounded-2xl text-lg text-white focus:border-white focus:ring-0 transition-all duration-300 hover:border-white/30 pl-12">
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
                                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Container 3: Personal */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-white to-white/80 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                    <Heart className="h-8 w-8 text-black" />
                                </div>
                                <h3 className="text-2xl font-light text-white tracking-wide">Personal</h3>
                                <div className="w-12 h-px bg-white/20 mx-auto mt-2"></div>
                            </div>

                            <div className="space-y-6">
                                <div className="relative">
                                    <Label className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-black px-2 text-sm font-medium text-white/70 z-10">
                                        Gender
                                    </Label>
                                    <div className="pt-4">
                                        <div className="grid grid-cols-3 gap-3">
                                            {/* Male */}
                                            <Button
                                                onClick={() => onFormDataChange('gender', 'male')}
                                                variant="ghost"
                                                className={`h-16 flex-col gap-2 border-2 rounded-xl transition-all duration-300 text-white hover:text-white hover:scale-105 ${formData.gender === 'male'
                                                    ? 'bg-white/25 border-white/50 shadow-lg'
                                                    : 'bg-white/15 border-white/30 hover:bg-white/25 hover:border-white/50'
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
                                                className={`h-16 flex-col gap-2 border-2 rounded-xl transition-all duration-300 text-white hover:text-white hover:scale-105 ${formData.gender === 'female'
                                                    ? 'bg-white/25 border-white/50 shadow-lg'
                                                    : 'bg-white/15 border-white/30 hover:bg-white/25 hover:border-white/50'
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
                                                className={`h-16 flex-col gap-2 border-2 rounded-xl transition-all duration-300 text-white hover:text-white hover:scale-105 ${formData.gender === 'other'
                                                    ? 'bg-white/25 border-white/50 shadow-lg'
                                                    : 'bg-white/15 border-white/30 hover:bg-white/25 hover:border-white/50'
                                                    }`}
                                            >
                                                <Users size={20} />
                                                <span className="text-xs text-center">Other</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <Label className="absolute -top-2 left-4 bg-black px-2 text-sm font-medium text-white/70 z-10">
                                        Relationship
                                    </Label>
                                    <div className="relative">
                                        <Select value={formData.relationship_status || ''} onValueChange={(value) => onFormDataChange('relationship_status', value)}>
                                            <SelectTrigger className="h-14 bg-transparent border-2 border-white/10 rounded-2xl text-lg text-white focus:border-white focus:ring-0 transition-all duration-300 hover:border-white/30 pl-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {RELATIONSHIP_STATUS_OPTIONS.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Heart className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                                    </div>
                                </div>

                                <div className="relative">
                                    <Label className="absolute -top-2 left-4 bg-black px-2 text-sm font-medium text-white/70 z-10">
                                        Job Title
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            value={formData.job_title || ''}
                                            onChange={(e) => onFormDataChange('job_title', e.target.value)}
                                            className="h-14 bg-transparent border-2 border-white/10 rounded-2xl text-lg text-white focus:border-white focus:ring-0 transition-all duration-300 hover:border-white/30 pl-12"
                                            maxLength={100}
                                        />
                                        <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Single Continue Button - Welcome Gif Style */}
                <div className="flex justify-center">
                    <Button
                        onClick={onNext}
                        disabled={loading || !isValid()}
                        className={`h-12 px-8 rounded-full transition-all duration-300 ${isValid() && !loading
                            ? 'bg-gray-600 hover:bg-gray-500 animate-pulse cursor-pointer text-white'
                            : 'bg-gray-800 cursor-not-allowed opacity-50 text-white'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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