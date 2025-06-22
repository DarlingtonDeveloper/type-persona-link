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
        <div className="space-y-8">
            <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">Profile Photo & Bio</h3>
                <p className="text-gray-600 text-lg">
                    Add a photo and tell others about yourself.
                </p>
            </div>

            {/* Profile Photo Section */}
            <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-800 border-b pb-2">Profile Photo</h4>

                <div className="flex flex-col items-center space-y-6">
                    <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden bg-gray-50 hover:border-gray-400 transition-colors">
                        {photoPreview ? (
                            <img
                                src={photoPreview}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-16 h-16 text-gray-400" />
                        )}
                    </div>

                    <div className="text-center">
                        <Label htmlFor="photo-upload" className="cursor-pointer">
                            <div className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                <Upload className="w-5 h-5 mr-3" />
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
                        <p className="text-sm text-gray-500 mt-2">
                            JPEG, PNG, or WebP. Max 5MB.
                        </p>
                    </div>
                </div>
            </div>

            {/* Job Information */}
            <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-800 border-b pb-2">Professional Information</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="jobTitle" className="text-base font-medium">Job Title *</Label>
                        <Input
                            id="jobTitle"
                            value={formData.job_title || ''}
                            onChange={(e) => onFormDataChange('job_title', e.target.value)}
                            placeholder="e.g., Software Developer"
                            maxLength={100}
                            className="h-12 text-lg mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="jobCategory" className="text-base font-medium">Job Category *</Label>
                        <Select
                            value={formData.job_category || ''}
                            onValueChange={(value) => onFormDataChange('job_category', value)}
                        >
                            <SelectTrigger className="h-12 text-lg mt-2">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {JOB_CATEGORY_OPTIONS.map(option => (
                                    <SelectItem key={option.value} value={option.value} className="text-lg">
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Bio Description */}
            <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-800 border-b pb-2">Bio</h4>

                <div>
                    <Label htmlFor="bioDescription" className="text-base font-medium">Tell others about yourself</Label>
                    <Textarea
                        id="bioDescription"
                        value={formData.bio_description || ''}
                        onChange={(e) => onFormDataChange('bio_description', e.target.value)}
                        placeholder="Write a brief description about yourself, your interests, or what you do..."
                        maxLength={VALIDATION_RULES.BIO_DESCRIPTION.MAX_LENGTH}
                        rows={5}
                        className="text-lg mt-2 resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        {(formData.bio_description || '').length} / {VALIDATION_RULES.BIO_DESCRIPTION.MAX_LENGTH} characters
                    </p>
                </div>
            </div>

            {/* Interests */}
            <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-800 border-b pb-2">Interests</h4>
                <p className="text-gray-600">
                    Share up to 3 things you're interested in or passionate about.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[0, 1, 2].map((index) => (
                        <div key={index}>
                            <Label htmlFor={`interest-${index}`} className="text-base font-medium">Interest {index + 1}</Label>
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
                                className="h-12 text-lg mt-2"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <Alert className="border-l-4 border-blue-500">
                <AlertDescription className="text-base">
                    Your photo and bio will be visible to anyone who visits your profile.
                    Make sure to only share information you're comfortable with being public.
                </AlertDescription>
            </Alert>

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

export default PhotoBioStep;