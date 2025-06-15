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
        <div className="space-y-6">
            {/* Registration Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Registration</h3>

                <div>
                    <Label htmlFor="userCode">E3 Number</Label>
                    <Input
                        id="userCode"
                        value={userCode}
                        disabled
                        className="bg-gray-100"
                    />
                </div>

                <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => onFormDataChange('email', e.target.value)}
                        placeholder="Enter your email"
                        maxLength={VALIDATION_RULES.EMAIL.MAX_LENGTH}
                    />
                </div>

                <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={passwords.password}
                            onChange={(e) => handlePasswordChange('password', e.target.value)}
                            placeholder="Enter password"
                            minLength={VALIDATION_RULES.PASSWORD.MIN_LENGTH}
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
                    <Label htmlFor="confirmPassword">Re-enter Password *</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwords.confirmPassword}
                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
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
                    {passwords.password && passwords.confirmPassword && passwords.password !== passwords.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
                    )}
                </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            value={formData.name || ''}
                            onChange={(e) => onFormDataChange('name', e.target.value)}
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
                            onChange={(e) => onFormDataChange('date_of_birth', e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="gender">Gender *</Label>
                        <Select
                            value={formData.gender || ''}
                            onValueChange={(value) => onFormDataChange('gender', value)}
                        >
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
                    <div>
                        <Label htmlFor="eyeColor">Eye Colour *</Label>
                        <Select
                            value={formData.eye_color || ''}
                            onValueChange={(value) => onFormDataChange('eye_color', value)}
                        >
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="relationshipStatus">Relationship Status</Label>
                        <Select
                            value={formData.relationship_status || ''}
                            onValueChange={(value) => onFormDataChange('relationship_status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
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
                    <div>
                        <Label htmlFor="mobile">Mobile Number *</Label>
                        <Input
                            id="mobile"
                            type="tel"
                            value={formData.mobile || ''}
                            onChange={(e) => onFormDataChange('mobile', e.target.value)}
                            placeholder="Enter mobile number"
                            minLength={VALIDATION_RULES.MOBILE.MIN_LENGTH}
                            maxLength={VALIDATION_RULES.MOBILE.MAX_LENGTH}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                        id="postcode"
                        value={formData.postcode || ''}
                        onChange={(e) => onFormDataChange('postcode', e.target.value)}
                        placeholder="Enter your postcode"
                        maxLength={VALIDATION_RULES.POSTCODE.MAX_LENGTH}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1"
                >
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={loading || !isValid()}
                    className="flex-1"
                >
                    {loading ? "Saving..." : "Continue"}
                </Button>
            </div>
        </div>
    );
};

export default PersonalDetailsStep;