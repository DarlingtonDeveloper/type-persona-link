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
        <div className="min-h-screen bg-brand-white p-8">
            <div className="max-w-6xl mx-auto">

                {/* FLOATING HEADER */}
                <div className="text-center mb-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-black/10 to-transparent h-px top-1/2"></div>
                    <div className="relative bg-brand-white px-12 inline-block">
                        <h1 className="text-6xl font-light text-brand-black tracking-wide mb-4">
                            Terms & <span className="font-semibold">Privacy</span>
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-brand-black/60">
                            <div className="w-8 h-px bg-brand-black/20"></div>
                            <span className="text-lg tracking-widest uppercase">Final Step</span>
                            <div className="w-8 h-px bg-brand-black/20"></div>
                        </div>
                    </div>
                </div>

                {/* TWO HORIZONTAL CONTAINERS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">

                    {/* Container 1: Terms of Service */}
                    <div className="bg-brand-black rounded-2xl p-8 backdrop-blur-sm shadow-lg border border-brand-black/20 hover:transform hover:translateY(-2px) transition-all duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-brand-white to-brand-white/80 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                <FileText className="h-8 w-8 text-brand-black" />
                            </div>
                            <h3 className="text-2xl font-light text-brand-white tracking-wide">Terms of Service</h3>
                            <div className="w-12 h-px bg-brand-white/20 mx-auto mt-2"></div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-brand-white/80 text-base leading-relaxed">
                                By using The Circle World, you agree to our terms which include:
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-brand-white/60 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-brand-white/70 text-sm">You must be 18+ years old to use our service</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-brand-white/60 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-brand-white/70 text-sm">Provide accurate and current information</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-brand-white/60 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-brand-white/70 text-sm">NFC devices engineered for 5+ years operational life</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-brand-white/60 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-brand-white/70 text-sm">10-day refund policy from purchase/activation</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-brand-white/60 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-brand-white/70 text-sm">Use responsibly and respect others</p>
                                </div>
                            </div>

                            <a
                                href="/terms-full"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-brand-white/80 hover:text-brand-white font-medium transition-colors duration-300"
                            >
                                Read full terms of service
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </a>

                            <div className="flex items-center space-x-3 pt-6">
                                <Checkbox
                                    id="terms"
                                    checked={formData.terms_accepted || false}
                                    onCheckedChange={(checked) => onFormDataChange('terms_accepted', checked)}
                                    className="w-5 h-5 border-2 border-brand-white/20 data-[state=checked]:bg-brand-white data-[state=checked]:border-brand-white"
                                />
                                <Label htmlFor="terms" className="text-brand-white font-medium cursor-pointer">
                                    I agree to the Terms of Service *
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Container 2: Privacy Policy */}
                    <div className="bg-brand-black rounded-2xl p-8 backdrop-blur-sm shadow-lg border border-brand-black/20 hover:transform hover:translateY(-2px) transition-all duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-brand-white to-brand-white/80 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                                <Shield className="h-8 w-8 text-brand-black" />
                            </div>
                            <h3 className="text-2xl font-light text-brand-white tracking-wide">Privacy Policy</h3>
                            <div className="w-12 h-px bg-brand-white/20 mx-auto mt-2"></div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-brand-white/80 text-base leading-relaxed">
                                We collect and use your data to provide our service:
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-brand-white/60 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-brand-white/70 text-sm">Personal details, profile data, and device information</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-brand-white/60 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-brand-white/70 text-sm">Used for service provision and personalization</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-brand-white/60 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-brand-white/70 text-sm">Marketing and commercial purposes within E3 ecosystem</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-brand-white/60 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-brand-white/70 text-sm">Anonymized data may be shared with third parties</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-brand-white/60 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-brand-white/70 text-sm">You can request data deletion anytime</p>
                                </div>
                            </div>

                            <a
                                href="/privacy-full"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-brand-white/80 hover:text-brand-white font-medium transition-colors duration-300"
                            >
                                Read full privacy policy
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </a>

                            <div className="flex items-center space-x-3 pt-6">
                                <Checkbox
                                    id="privacy"
                                    checked={formData.privacy_accepted || false}
                                    onCheckedChange={(checked) => onFormDataChange('privacy_accepted', checked)}
                                    className="w-5 h-5 border-2 border-brand-white/20 data-[state=checked]:bg-brand-white data-[state=checked]:border-brand-white"
                                />
                                <Label htmlFor="privacy" className="text-brand-white font-medium cursor-pointer">
                                    I agree to the Privacy Policy *
                                </Label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Important Notice */}
                <div className="mb-12">
                    <Alert className="bg-brand-black border-brand-black/10 rounded-2xl backdrop-blur-sm">
                        <AlertDescription className="text-brand-white/70 text-base">
                            <div className="space-y-3">
                                <p className="font-semibold text-brand-white">Important Notice:</p>
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
                        className="flex-1 h-14 text-lg bg-transparent border-2 border-brand-black/20 text-brand-black hover:bg-brand-black/10 hover:border-brand-black/40 transition-all duration-300 rounded-2xl"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={onNext}
                        disabled={loading || !isValid()}
                        className={`flex-1 h-14 text-lg rounded-2xl transition-all duration-300 ${isValid()
                            ? 'bg-brand-black text-brand-white hover:bg-brand-black/90 transform hover:-translate-y-1 shadow-lg'
                            : 'bg-brand-black/20 text-brand-black/50 cursor-not-allowed'
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