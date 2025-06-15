import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Shield, FileText } from 'lucide-react';
import { EXTERNAL_LINKS } from '@/constants';
import { OnboardingFormData } from '@/types';

interface TermsPrivacyStepProps {
    formData: Partial<OnboardingFormData>;
    onFormDataChange: (field: string, value: any) => void;
    onNext: () => void;
    onBack: () => void;
    loading: boolean;
}

const TermsPrivacyStep: React.FC<TermsPrivacyStepProps> = ({
    formData,
    onFormDataChange,
    onNext,
    onBack,
    loading
}) => {
    const isValid = () => {
        return formData.terms_accepted && formData.privacy_accepted;
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Terms & Privacy</h3>
                <p className="text-sm text-gray-600">
                    Please review and accept our terms and privacy policy to continue.
                </p>
            </div>

            {/* Terms of Service */}
            <div className="border rounded-lg p-6 space-y-4 bg-gray-50">
                <div className="flex items-start space-x-3">
                    <FileText className="w-6 h-6 text-blue-600 mt-1" />
                    <div className="space-y-2">
                        <h4 className="font-medium">Terms of Service</h4>
                        <p className="text-sm text-gray-600">
                            By using E3 Circle, you agree to our terms of service. This includes:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1 ml-4">
                            <li>• Providing accurate and truthful information</li>
                            <li>• Using the platform responsibly and legally</li>
                            <li>• Respecting other users and their content</li>
                            <li>• Not sharing inappropriate or harmful content</li>
                        </ul>
                        <a
                            href={EXTERNAL_LINKS.TERMS_OF_SERVICE}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            Read full terms of service
                            <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="terms"
                        checked={formData.terms_accepted || false}
                        onCheckedChange={(checked) => onFormDataChange('terms_accepted', checked)}
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer">
                        I agree to the Terms of Service *
                    </Label>
                </div>
            </div>

            {/* Privacy Policy */}
            <div className="border rounded-lg p-6 space-y-4 bg-gray-50">
                <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-green-600 mt-1" />
                    <div className="space-y-2">
                        <h4 className="font-medium">Privacy Policy</h4>
                        <p className="text-sm text-gray-600">
                            We respect your privacy and are committed to protecting your personal data:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1 ml-4">
                            <li>• Your profile information will be publicly visible</li>
                            <li>• We do not sell your personal data to third parties</li>
                            <li>• You can request to delete your account at any time</li>
                            <li>• We use industry-standard security measures</li>
                        </ul>
                        <a
                            href={EXTERNAL_LINKS.PRIVACY_POLICY}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            Read full privacy policy
                            <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="privacy"
                        checked={formData.privacy_accepted || false}
                        onCheckedChange={(checked) => onFormDataChange('privacy_accepted', checked)}
                    />
                    <Label htmlFor="privacy" className="text-sm cursor-pointer">
                        I agree to the Privacy Policy *
                    </Label>
                </div>
            </div>

            {/* Communication Preferences */}
            <div className="border rounded-lg p-6 space-y-4">
                <h4 className="font-medium">Communication Preferences</h4>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="communications"
                        checked={formData.communication_preferences || false}
                        onCheckedChange={(checked) => onFormDataChange('communication_preferences', checked)}
                    />
                    <Label htmlFor="communications" className="text-sm cursor-pointer">
                        I would like to receive updates and promotional emails from E3 Circle
                    </Label>
                </div>
                <p className="text-xs text-gray-500">
                    You can change this preference at any time in your account settings.
                </p>
            </div>

            <Alert>
                <AlertDescription>
                    <div className="space-y-2">
                        <p className="font-medium">Important:</p>
                        <p className="text-sm">
                            Once you complete setup, your profile will be publicly accessible via your E3 code.
                            Make sure you're comfortable with the information you've provided being visible to others.
                        </p>
                    </div>
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
                    {loading ? "Completing Setup..." : "Complete Setup"}
                </Button>
            </div>
        </div>
    );
};

export default TermsPrivacyStep;