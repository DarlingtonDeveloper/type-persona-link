import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, User, Camera } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VALIDATION_RULES, FILE_UPLOAD } from '@/constants';
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

    const isValid = () => {
        return formData.bio_description && formData.bio_description.trim().length > 0;
    };

    const countWords = (text) => {
        if (!text || text.trim() === '') return 0;
        return text.trim().split(/\s+/).length;
    };

    const MAX_WORDS = 100;

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-6xl mx-auto">

                {/* FLOATING HEADER */}
                <div className="text-center mb-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent h-px top-1/2"></div>
                    <div className="relative bg-black px-12 inline-block">
                        <h1 className="text-6xl font-light text-white tracking-wide mb-4">
                            Photo & <span className="font-semibold">Bio</span>
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-white/60">
                            <div className="w-8 h-px bg-white/20"></div>
                            <span className="text-lg tracking-widest uppercase">Express Yourself</span>
                            <div className="w-8 h-px bg-white/20"></div>
                        </div>
                    </div>
                </div>

                {/* TWO HORIZONTAL CONTAINERS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

                    {/* Container 1: Profile Photo */}
                    <div className="e3-container e3-container-hover">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-white to-white/80 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                <Camera className="h-8 w-8 text-black" />
                            </div>
                            <h3 className="text-2xl font-light text-white tracking-wide">Profile Photo</h3>
                            <div className="w-12 h-px bg-white/20 mx-auto mt-2"></div>
                        </div>

                        <div className="flex flex-col items-center space-y-8">
                            {/* Photo Preview Circle */}
                            <div className="relative group/photo">
                                <div className="w-48 h-48 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center overflow-hidden bg-white/5 hover:border-white/40 transition-all duration-300 group-hover/photo:scale-105">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-20 h-20 text-white/40" />
                                    )}
                                </div>

                                {/* Upload overlay on hover */}
                                <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-center">
                                        <Upload className="w-8 h-8 text-white mx-auto mb-2" />
                                        <p className="text-white text-sm font-medium">
                                            {photoPreview ? 'Change Photo' : 'Upload Photo'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Button */}
                            <div className="text-center w-full">
                                <Label htmlFor="photo-upload" className="cursor-pointer">
                                    <div className="inline-flex items-center px-8 py-4 border-2 border-white/20 rounded-2xl text-base font-medium text-white bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-1">
                                        <Upload className="w-5 h-5 mr-3" />
                                        {uploading ? 'Uploading...' : photoPreview ? 'Change Photo' : 'Upload Photo'}
                                    </div>
                                </Label>
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={handlePhotoUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                                <p className="text-white/40 text-sm mt-4">
                                    JPEG, PNG, or WebP • Maximum 5MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Container 2: Bio */}
                    <div className="e3-container e3-container-hover">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-white to-white/80 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                <User className="h-8 w-8 text-black" />
                            </div>
                            <h3 className="text-2xl font-light text-white tracking-wide">About You</h3>
                            <div className="w-12 h-px bg-white/20 mx-auto mt-2"></div>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="relative">
                                <Textarea
                                    value={formData.bio_description || ''}
                                    onChange={(e) => onFormDataChange('bio_description', e.target.value)}
                                    placeholder="Write something about you in less than 100 words."
                                    rows={8}
                                    className="bg-transparent border-2 border-white/10 rounded-2xl text-lg text-white placeholder:text-white/40 focus:border-white focus:ring-0 transition-all duration-300 hover:border-white/30 resize-none pt-6"
                                />
                                <div className="flex justify-between items-center mt-3">
                                    <p className="text-white/60 text-sm font-medium">
                                        {countWords(formData.bio_description || '')} / {MAX_WORDS} words
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy Notice */}
                <div className="mb-12">
                    <Alert className="bg-white/5 border-white/10 rounded-2xl backdrop-blur-sm">
                        <AlertDescription className="text-white/70 text-base text-center">
                            <span className="font-medium text-white">Privacy Notice:</span> Your photo and bio will be visible to anyone who visits your profile.
                            Make sure to only share information you're comfortable with being public.
                        </AlertDescription>
                    </Alert>
                </div>

                {/* Navigation */}
                <div className="flex gap-6">
                    <Button
                        variant="outline"
                        onClick={onBack}
                        className="flex-1 h-14 text-lg bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 rounded-2xl"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={onNext}
                        disabled={loading || !isValid()}
                        className={`flex-1 h-14 text-lg rounded-2xl transition-all duration-300 ${isValid()
                            ? 'bg-white text-black hover:bg-white/90 transform hover:-translate-y-1 shadow-lg'
                            : 'bg-white/20 text-white/50 cursor-not-allowed'
                            }`}
                    >
                        {loading ? "Saving..." : "Continue"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PhotoBioStep;