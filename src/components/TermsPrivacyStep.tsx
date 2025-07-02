import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Shield, FileText, Info } from 'lucide-react';
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
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-6xl mx-auto">

                {/* FLOATING HEADER */}
                <div className="text-center mb-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent h-px top-1/2"></div>
                    <div className="relative bg-black px-12 inline-block">
                        <h1 className="text-6xl font-light text-white tracking-wide mb-4">
                            Terms & <span className="font-semibold">Privacy</span>
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-white/60">
                            <div className="w-8 h-px bg-white/20"></div>
                            <span className="text-lg tracking-widest uppercase">Final Step</span>
                            <div className="w-8 h-px bg-white/20"></div>
                        </div>
                    </div>
                </div>

                {/* TWO HORIZONTAL CONTAINERS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">

                    {/* Container 1: Terms of Service */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-3xl blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                    <FileText className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-light text-white tracking-wide">Terms of Service</h3>
                                <div className="w-12 h-px bg-white/20 mx-auto mt-2"></div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-white/80 text-base leading-relaxed">
                                    By using The Circle World, you agree to our terms which include:
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-white/70 text-sm">You must be 18+ years old to use our service</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-white/70 text-sm">Provide accurate and current information</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-white/70 text-sm">NFC devices engineered for 5+ years operational life</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-white/70 text-sm">10-day refund policy from purchase/activation</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-white/70 text-sm">Use responsibly and respect others</p>
                                    </div>
                                </div>

                                <a
                                    href="/terms-full"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                                >
                                    Read full terms of service
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </a>

                                <div className="flex items-center space-x-3 pt-6">
                                    <Checkbox
                                        id="terms"
                                        checked={formData.terms_accepted || false}
                                        onCheckedChange={(checked) => onFormDataChange('terms_accepted', checked)}
                                        className="w-5 h-5 border-2 border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                    />
                                    <Label htmlFor="terms" className="text-white font-medium cursor-pointer">
                                        I agree to the Terms of Service *
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Container 2: Privacy Policy */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-3xl blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-light text-white tracking-wide">Privacy Policy</h3>
                                <div className="w-12 h-px bg-white/20 mx-auto mt-2"></div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-white/80 text-base leading-relaxed">
                                    We collect and use your data to provide our service:
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-white/70 text-sm">Personal details, profile data, and device information</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-white/70 text-sm">Used for service provision and personalization</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-white/70 text-sm">Marketing and commercial purposes within E3 ecosystem</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-white/70 text-sm">Anonymized data may be shared with third parties</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-white/70 text-sm">You can request data deletion anytime</p>
                                    </div>
                                </div>

                                <a
                                    href="/privacy-full"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-green-400 hover:text-green-300 font-medium transition-colors duration-300"
                                >
                                    Read full privacy policy
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </a>

                                <div className="flex items-center space-x-3 pt-6">
                                    <Checkbox
                                        id="privacy"
                                        checked={formData.privacy_accepted || false}
                                        onCheckedChange={(checked) => onFormDataChange('privacy_accepted', checked)}
                                        className="w-5 h-5 border-2 border-white/20 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                    />
                                    <Label htmlFor="privacy" className="text-white font-medium cursor-pointer">
                                        I agree to the Privacy Policy *
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Communication Preferences */}
                <div className="group relative mb-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:shadow-lg transition-all duration-500">

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Info className="h-6 w-6 text-white" />
                            </div>
                            <div className="space-y-4 flex-1">
                                <h4 className="text-xl font-medium text-white">Communication Preferences</h4>
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="communications"
                                        checked={formData.communication_preferences || false}
                                        onCheckedChange={(checked) => onFormDataChange('communication_preferences', checked)}
                                        className="w-5 h-5 border-2 border-white/20 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black"
                                    />
                                    <Label htmlFor="communications" className="text-white/80 cursor-pointer">
                                        I would like to receive updates and promotional emails from E3 Circle
                                    </Label>
                                </div>
                                <p className="text-white/50 text-sm">
                                    You can change this preference at any time in your account settings.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Important Notice */}
                <div className="mb-12">
                    <Alert className="bg-orange-500/10 border-orange-500/20 rounded-2xl backdrop-blur-sm">
                        <AlertDescription className="text-white/80 text-base">
                            <div className="space-y-3">
                                <p className="font-semibold text-orange-300">Important Notice:</p>
                                <p>
                                    Once you complete setup, your profile will be publicly accessible via your E3 code.
                                    Make sure you're comfortable with the information you've provided being visible to others.
                                    You can request data deletion by emailing hello@e3world.co.uk at any time.
                                </p>
                            </div>
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
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 shadow-lg'
                            : 'bg-white/20 text-white/50 cursor-not-allowed'
                            }`}
                    >
                        {loading ? "Completing Setup..." : "Complete Setup"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TermsPrivacyStep;