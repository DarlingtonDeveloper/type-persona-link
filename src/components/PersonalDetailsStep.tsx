import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePasswordChange = (field: 'password' | 'confirmPassword', value: string) => {
        onPasswordChange({
            ...passwords,
            [field]: value
        });
    };

    const isValid = () => {
        return (
            formData.email &&
            formData.name &&
            passwords.password &&
            passwords.confirmPassword &&
            passwords.password === passwords.confirmPassword &&
            formData.date_of_birth &&
            formData.gender &&
            formData.eye_color &&
            formData.mobile
        );
    };

    return (
        <div className="space-y-8">
            {/* Registration Section */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Account Registration</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <Label htmlFor="userCode" className="text-base font-medium">E3 Number</Label>
                        <Input
                            id="userCode"
                            value={userCode}
                            disabled
                            className="bg-gray-100 h-12 text-lg mt-2"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="email" className="text-base font-medium">Email Address *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => onFormDataChange('email', e.target.value)}
                            placeholder="Enter your email"
                            maxLength={VALIDATION_RULES.EMAIL.MAX_LENGTH}
                            className="h-12 text-lg mt-2"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" className="text-base font-medium">Password *</Label>
                        <div className="relative mt-2">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={passwords.password}
                                onChange={(e) => handlePasswordChange('password', e.target.value)}
                                placeholder="Enter password"
                                minLength={VALIDATION_RULES.PASSWORD.MIN_LENGTH}
                                maxLength={VALIDATION_RULES.PASSWORD.MAX_LENGTH}
                                className="h-12 text-lg pr-12"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="confirmPassword" className="text-base font-medium">Re-enter Password *</Label>
                        <div className="relative mt-2">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwords.confirmPassword}
                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                placeholder="Confirm password"
                                className="h-12 text-lg pr-12"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                        {passwords.password && passwords.confirmPassword && passwords.password !== passwords.confirmPassword && (
                            <p className="text-sm text-red-600 mt-2">Passwords do not match</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="name" className="text-base font-medium">Full Name *</Label>
                        <Input
                            id="name"
                            value={formData.name || ''}
                            onChange={(e) => onFormDataChange('name', e.target.value)}
                            placeholder="Enter your full name"
                            maxLength={VALIDATION_RULES.NAME.MAX_LENGTH}
                            className="h-12 text-lg mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="dateOfBirth" className="text-base font-medium">Date of Birth *</Label>
                        <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.date_of_birth || ''}
                            onChange={(e) => onFormDataChange('date_of_birth', e.target.value)}
                            className="h-12 text-lg mt-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="gender" className="text-base font-medium">Gender *</Label>
                        <Select
                            value={formData.gender || ''}
                            onValueChange={(value) => onFormDataChange('gender', value)}
                        >
                            <SelectTrigger className="h-12 text-lg mt-2">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                {GENDER_OPTIONS.map(option => (
                                    <SelectItem key={option.value} value={option.value} className="text-lg">
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="eyeColor" className="text-base font-medium">Eye Colour *</Label>
                        <Select
                            value={formData.eye_color || ''}
                            onValueChange={(value) => onFormDataChange('eye_color', value)}
                        >
                            <SelectTrigger className="h-12 text-lg mt-2">
                                <SelectValue placeholder="Select eye colour" />
                            </SelectTrigger>
                            <SelectContent>
                                {EYE_COLOR_OPTIONS.map(option => (
                                    <SelectItem key={option.value} value={option.value} className="text-lg">
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="relationshipStatus" className="text-base font-medium">Relationship Status</Label>
                        <Select
                            value={formData.relationship_status || ''}
                            onValueChange={(value) => onFormDataChange('relationship_status', value)}
                        >
                            <SelectTrigger className="h-12 text-lg mt-2">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {RELATIONSHIP_STATUS_OPTIONS.map(option => (
                                    <SelectItem key={option.value} value={option.value} className="text-lg">
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="mobile" className="text-base font-medium">Mobile Number *</Label>
                        <Input
                            id="mobile"
                            type="tel"
                            value={formData.mobile || ''}
                            onChange={(e) => onFormDataChange('mobile', e.target.value)}
                            placeholder="Enter mobile number"
                            minLength={VALIDATION_RULES.MOBILE.MIN_LENGTH}
                            maxLength={VALIDATION_RULES.MOBILE.MAX_LENGTH}
                            className="h-12 text-lg mt-2"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="postcode" className="text-base font-medium">Postcode</Label>
                    <Input
                        id="postcode"
                        value={formData.postcode || ''}
                        onChange={(e) => onFormDataChange('postcode', e.target.value)}
                        placeholder="Enter your postcode"
                        maxLength={VALIDATION_RULES.POSTCODE.MAX_LENGTH}
                        className="h-12 text-lg mt-2"
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-6">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 h-12 text-lg"
                >
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={loading || !isValid()}
                    className="flex-1 h-12 text-lg"
                >
                    {loading ? "Saving..." : "Continue"}
                </Button>
            </div>
        </div>
    );
};

export default PersonalDetailsStep;