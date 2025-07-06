import React, { useState } from 'react';
import { Camera, User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StepComponentProps } from '@/types';

const PhotoBioStep: React.FC<StepComponentProps> = ({
    formData,
    onFormDataChange,
    onNext,
    onBack,
    loading
}) => {
    const [uploading, setUploading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        formData.profile_photo_url || null
    );

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a JPEG, PNG, or WebP image.');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Please upload an image smaller than 5MB.');
            return;
        }

        setUploading(true);
        try {
            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // TODO: Upload to your backend and get URL
            // For now, we'll use the preview URL
            onFormDataChange('profile_photo_url', URL.createObjectURL(file));
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const countWords = (text: string): number => {
        if (!text || text.trim() === '') return 0;
        return text.trim().split(/\s+/).length;
    };

    // Updated validation constants
    const MIN_WORDS = 5;
    const MAX_WORDS = 50;

    // Get current word count
    const currentWordCount = countWords(formData.bio_description || '');

    // Bio validation function
    const getBioValidation = () => {
        const bio = formData.bio_description || '';
        const wordCount = countWords(bio);

        if (bio.trim().length === 0) {
            return {
                isValid: false,
                message: 'Bio is required',
                type: 'error' as const
            };
        }

        if (wordCount < MIN_WORDS) {
            return {
                isValid: false,
                message: `Bio must be at least ${MIN_WORDS} words. Currently ${wordCount} word${wordCount !== 1 ? 's' : ''}.`,
                type: 'error' as const
            };
        }

        if (wordCount > MAX_WORDS) {
            return {
                isValid: false,
                message: `Bio must be no more than ${MAX_WORDS} words. Currently ${wordCount} words.`,
                type: 'error' as const
            };
        }

        // Warning when approaching limit
        if (wordCount >= MAX_WORDS - 5) {
            return {
                isValid: true,
                message: `Approaching word limit: ${wordCount}/${MAX_WORDS} words`,
                type: 'warning' as const
            };
        }

        return {
            isValid: true,
            message: '',
            type: 'success' as const
        };
    };

    const bioValidation = getBioValidation();

    const isValid = () => {
        return formData.bio_description &&
            formData.bio_description.trim().length > 0 &&
            bioValidation.isValid;
    };

    // Get counter color based on validation state
    const getCounterColor = () => {
        if (bioValidation.type === 'error') return 'text-red-400';
        if (bioValidation.type === 'warning') return 'text-yellow-400';
        return 'text-white/60';
    };

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
                                        <Camera className="h-16 w-16 text-white/40" />
                                    )}
                                </div>
                                <Label
                                    htmlFor="photo-upload"
                                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer"
                                >
                                    <div className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
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
                                    placeholder={`Tell us about yourself.`}
                                    rows={8}
                                    className={`bg-transparent border-2 rounded-2xl text-lg text-white placeholder:text-white/40 focus:ring-0 transition-all duration-300 resize-none pt-6 ${bioValidation.type === 'error'
                                        ? 'border-red-400 focus:border-red-400 hover:border-red-400'
                                        : bioValidation.type === 'warning'
                                            ? 'border-yellow-400 focus:border-yellow-400 hover:border-yellow-400'
                                            : 'border-white/10 focus:border-white hover:border-white/30'
                                        }`}
                                />
                                <div className="flex justify-between items-center mt-3">
                                    <p className={`text-sm font-medium ${getCounterColor()}`}>
                                        {currentWordCount} / {MAX_WORDS} words
                                        {currentWordCount < MIN_WORDS && (
                                            <span className="text-red-400 ml-2">
                                                (minimum {MIN_WORDS})
                                            </span>
                                        )}
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
                        title={!isValid() ? 'Please complete your bio with 5-50 words to continue' : ''}
                    >
                        {loading ? "Saving..." : "Continue"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PhotoBioStep;