import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Camera, X, User } from 'lucide-react';
import { validateFileUpload } from '@/utils/security';
import { FILE_UPLOAD, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import { toast } from '@/hooks/use-toast';

interface ProfilePhotoUploadProps {
    currentPhotoUrl?: string;
    onPhotoChange: (photoUrl: string | null) => void;
    userCode: string;
    disabled?: boolean;
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
    currentPhotoUrl,
    onPhotoChange,
    userCode,
    disabled = false
}) => {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File): Promise<string | null> => {
        try {
            setUploading(true);

            // Validate file
            const validation = validateFileUpload(file);
            if (!validation.isValid) {
                toast({
                    title: "Invalid File",
                    description: validation.errors[0],
                    variant: "destructive"
                });
                return null;
            }

            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${userCode}_${Date.now()}.${fileExt}`;
            const filePath = `profile-photos/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('user-uploads')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                toast({
                    title: "Upload Failed",
                    description: "Failed to upload photo. Please try again.",
                    variant: "destructive"
                });
                return null;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('user-uploads')
                .getPublicUrl(filePath);

            if (!urlData?.publicUrl) {
                throw new Error('Failed to get public URL');
            }

            toast({
                title: "Upload Successful",
                description: SUCCESS_MESSAGES.PHOTO_UPLOADED,
            });

            return urlData.publicUrl;

        } catch (error) {
            console.error('Unexpected upload error:', error);
            toast({
                title: "Upload Error",
                description: ERROR_MESSAGES.GENERIC_ERROR,
                variant: "destructive"
            });
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Create preview
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);

        // Upload file
        const uploadedUrl = await uploadFile(file);
        if (uploadedUrl) {
            onPhotoChange(uploadedUrl);
        } else {
            // Revert preview if upload failed
            setPreviewUrl(currentPhotoUrl || null);
        }

        // Clear input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemovePhoto = () => {
        setPreviewUrl(null);
        onPhotoChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <Label className="text-brand-black text-lg">Profile Photo</Label>

            {/* Photo Preview */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    {previewUrl ? (
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-brand-white shadow-lg">
                            <img
                                src={previewUrl}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                            />
                            {!disabled && (
                                <button
                                    onClick={handleRemovePhoto}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    disabled={uploading}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-brand-black/10 border-4 border-brand-white shadow-lg flex items-center justify-center">
                            <User className="h-12 w-12 text-brand-black/40" />
                        </div>
                    )}

                    {uploading && (
                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    )}
                </div>

                {/* Upload Buttons */}
                <div className="flex gap-2">
                    <Button
                        type="button"
                        onClick={triggerFileSelect}
                        disabled={disabled || uploading}
                        className="brand-button-primary"
                    >
                        <Camera className="h-4 w-4 mr-2" />
                        {previewUrl ? 'Change Photo' : 'Add Photo'}
                    </Button>

                    {previewUrl && !disabled && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleRemovePhoto}
                            disabled={uploading}
                        >
                            Remove
                        </Button>
                    )}
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept={FILE_UPLOAD.ALLOWED_TYPES.join(',')}
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || uploading}
            />

            {/* Help Text */}
            <div className="text-center space-y-1">
                <p className="text-sm text-brand-black/70">
                    This picture will represent you on your profile.
                </p>
                <p className="text-xs text-brand-black/50">
                    Max size: {FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB •
                    Formats: JPEG, PNG, WebP
                </p>
            </div>

            {/* Storage Setup Note */}
            {process.env.NODE_ENV === 'development' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                    <p className="text-yellow-800">
                        <strong>Development Note:</strong> Make sure to create a 'user-uploads' bucket in Supabase Storage with public access.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoUpload;