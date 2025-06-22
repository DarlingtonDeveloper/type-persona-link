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
        <div className="space-y-8">
            <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">Terms & Privacy</h3>
                <p className="text-gray-600 text-lg">
                    Please review and accept our terms and privacy policy to continue.
                </p>
            </div>

            {/* Terms of Service */}
            <div className="border-2 border-gray-200 rounded-xl p-8 space-y-6 bg-blue-50/50">
                <div className="flex items-start space-x-4">
                    <FileText className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800">Terms of Service</h4>
                        <p className="text-gray-600 text-base">
                            By using E3 Circle, you agree to our terms of service. This includes:
                        </p>
                        <ul className="text-gray-600 space-y-2 ml-6 text-base">
                            <li>• Providing accurate and truthful information</li>
                            <li>• Using the platform responsibly and legally</li>
                            <li>• Respecting other users and their content</li>
                            <li>• Not sharing inappropriate or harmful content</li>
                        </ul>
                        <a
                            href={EXTERNAL_LINKS.TERMS_OF_SERVICE}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-base text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Read full terms of service
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </div>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                    <Checkbox
                        id="terms"
                        checked={formData.terms_accepted || false}
                        onCheckedChange={(checked) => onFormDataChange('terms_accepted', checked)}
                        className="w-5 h-5"
                    />
                    <Label htmlFor="terms" className="text-base cursor-pointer font-medium">
                        I agree to the Terms of Service *
                    </Label>
                </div>
            </div>

            {/* Privacy Policy */}
            <div className="border-2 border-gray-200 rounded-xl p-8 space-y-6 bg-green-50/50">
                <div className="flex items-start space-x-4">
                    <Shield className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800">Privacy Policy</h4>
                        <p className="text-gray-600 text-base">
                            We respect your privacy and are committed to protecting your personal data:
                        </p>
                        <ul className="text-gray-600 space-y-2 ml-6 text-base">
                            <li>• Your profile information will be publicly visible</li>
                            <li>• We do not sell your personal data to third parties</li>
                            <li>• You can request to delete your account at any time</li>
                            <li>• We use industry-standard security measures</li>
                        </ul>
                        <a
                            href={EXTERNAL_LINKS.PRIVACY_POLICY}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-base text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Read full privacy policy
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </div>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                    <Checkbox
                        id="privacy"
                        checked={formData.privacy_accepted || false}
                        onCheckedChange={(checked) => onFormDataChange('privacy_accepted', checked)}
                        className="w-5 h-5"
                    />
                    <Label htmlFor="privacy" className="text-base cursor-pointer font-medium">
                        I agree to the Privacy Policy *
                    </Label>
                </div>
            </div>

            {/* Communication Preferences */}
            <div className="border-2 border-gray-200 rounded-xl p-8 space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Communication Preferences</h4>
                <div className="flex items-center space-x-3">
                    <Checkbox
                        id="communications"
                        checked={formData.communication_preferences || false}
                        onCheckedChange={(checked) => onFormDataChange('communication_preferences', checked)}
                        className="w-5 h-5"
                    />
                    <Label htmlFor="communications" className="text-base cursor-pointer">
                        I would like to receive updates and promotional emails from E3 Circle
                    </Label>
                </div>
                <p className="text-sm text-gray-500">
                    You can change this preference at any time in your account settings.
                </p>
            </div>

            <Alert className="border-l-4 border-orange-500 bg-orange-50/50">
                <AlertDescription className="text-base">
                    <div className="space-y-3">
                        <p className="font-semibold text-orange-800">Important:</p>
                        <p className="text-orange-700">
                            Once you complete setup, your profile will be publicly accessible via your E3 code.
                            Make sure you're comfortable with the information you've provided being visible to others.
                        </p>
                    </div>
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
                    className="flex-1 h-12 text-lg bg-green-600 hover:bg-green-700"
                >
                    {loading ? "Completing Setup..." : "Complete Setup"}
                </Button>
            </div>
        </div>
    );
};

export default TermsPrivacyStep;