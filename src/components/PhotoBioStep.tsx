import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VALIDATION_RULES, JOB_CATEGORY_OPTIONS, FILE_UPLOAD } from '@/constants';
import { OnboardingFormData } from '@/types';

interface PhotoBioStepProps {
    formData: Partial<OnboardingFormData>;
    onFormDataChange: (field: string, value: any) => void;
    onNext: () => void;
    onBack: () => void;
    loading: boolean;
}

const PhotoBioStep: React.FC<PhotoBioStepProps> = ({
    formData,
    onFormDataChange,
    onNext,
    onBack,
    loading
}) => {
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        formData.profile_photo_url || null
    );
    const [uploading, setUploading] = useState(false);

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
            alert('Please upload a JPEG, PNG, or WebP image.');
            return;
        }

        if (file.size > FILE_UPLOAD.MAX_SIZE) {
            alert('File size must be less than 5MB.');
            return;
        }

        setUploading(true);

        try {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setPhotoPreview(result);
                onFormDataChange('profile_photo_url', result);
            };
            reader.readAsDataURL(file);

            // In a real app, you'd upload to your storage service here
            // For now, we'll just use the preview
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Failed to upload photo. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const updateInterest = (index: number, value: string) => {
        const updatedInterests = [...(formData.interests || ['', '', ''])];
        updatedInterests[index] = value;
        onFormDataChange('interests', updatedInterests);
    };

    const isValid = () => {
        return formData.job_title && formData.job_category;
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Profile Photo & Bio</h3>
                <p className="text-sm text-gray-600">
                    Add a photo and tell others about yourself.
                </p>
            </div>

            {/* Profile Photo Section */}
            <div className="space-y-4">
                <h4 className="font-medium">Profile Photo</h4>

                <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden bg-gray-50">
                        {photoPreview ? (
                            <img
                                src={photoPreview}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-12 h-12 text-gray-400" />
                        )}
                    </div>

                    <div className="text-center">
                        <Label htmlFor="photo-upload" className="cursor-pointer">
                            <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                <Upload className="w-4 h-4 mr-2" />
                                {uploading ? 'Uploading...' : photoPreview ? 'Change Photo' : 'Upload Photo'}
                            </div>
                        </Label>
                        <Input
                            id="photo-upload"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={handlePhotoUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            JPEG, PNG, or WebP. Max 5MB.
                        </p>
                    </div>
                </div>
            </div>

            {/* Job Information */}
            <div className="space-y-4">
                <h4 className="font-medium">Professional Information</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="jobTitle">Job Title *</Label>
                        <Input
                            id="jobTitle"
                            value={formData.job_title || ''}
                            onChange={(e) => onFormDataChange('job_title', e.target.value)}
                            placeholder="e.g., Software Developer"
                            maxLength={100}
                        />
                    </div>
                    <div>
                        <Label htmlFor="jobCategory">Job Category *</Label>
                        <Select
                            value={formData.job_category || ''}
                            onValueChange={(value) => onFormDataChange('job_category', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
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
                </div>
            </div>

            {/* Bio Description */}
            <div className="space-y-4">
                <h4 className="font-medium">Bio</h4>

                <div>
                    <Label htmlFor="bioDescription">Tell others about yourself</Label>
                    <Textarea
                        id="bioDescription"
                        value={formData.bio_description || ''}
                        onChange={(e) => onFormDataChange('bio_description', e.target.value)}
                        placeholder="Write a brief description about yourself, your interests, or what you do..."
                        maxLength={VALIDATION_RULES.BIO_DESCRIPTION.MAX_LENGTH}
                        rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {(formData.bio_description || '').length} / {VALIDATION_RULES.BIO_DESCRIPTION.MAX_LENGTH} characters
                    </p>
                </div>
            </div>

            {/* Interests */}
            <div className="space-y-4">
                <h4 className="font-medium">Interests</h4>
                <p className="text-sm text-gray-600">
                    Share up to 3 things you're interested in or passionate about.
                </p>

                <div className="space-y-3">
                    {[0, 1, 2].map((index) => (
                        <div key={index}>
                            <Label htmlFor={`interest-${index}`}>Interest {index + 1}</Label>
                            <Input
                                id={`interest-${index}`}
                                value={formData.interests?.[index] || ''}
                                onChange={(e) => updateInterest(index, e.target.value)}
                                placeholder={
                                    index === 0 ? "e.g., Photography" :
                                        index === 1 ? "e.g., Cooking" :
                                            "e.g., Travel"
                                }
                                maxLength={VALIDATION_RULES.INTEREST.MAX_LENGTH}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <Alert>
                <AlertDescription>
                    Your photo and bio will be visible to anyone who visits your profile.
                    Make sure to only share information you're comfortable with being public.
                </AlertDescription>
            </Alert>

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

export default PhotoBioStep;