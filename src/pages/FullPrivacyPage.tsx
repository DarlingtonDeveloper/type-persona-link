import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FullPrivacyPage: React.FC = () => {
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="outline"
                        onClick={handleGoBack}
                        className="mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>

                    <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                            <Shield className="h-8 w-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-600">E3WORLD LTD — The Circle World</p>
                        <p className="text-sm text-gray-500 mt-2">Effective Date: 28 June 2025</p>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border p-8 space-y-8">

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            E3WORLD LTD collects, stores, and processes the following categories of information:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Personal Identification Information (e.g., full name, address, date of birth, contact details)</li>
                            <li>Profile Data (e.g., responses to personal questions, smart links, profile images)</li>
                            <li>Device Data (e.g., hardware IDs, NFC tag readings, usage logs)</li>
                            <li>Communications Data (e.g., emails, support requests)</li>
                            <li>Technical Data (e.g., IP addresses, browser types, device information)</li>
                        </ul>
                    </section>

                    {/* Use of Data */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use of Data</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use your data for the following legitimate business purposes:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>To provide, maintain, and enhance the Service's features</li>
                            <li>To personalise user experiences and interactions</li>
                            <li>To facilitate direct and indirect communications with users</li>
                            <li>For internal business analytics and service improvements</li>
                            <li>For promotional, marketing, and commercial purposes both within and beyond the E3 ecosystem</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            By using the Service, you explicitly consent to E3WORLD LTD's use of your data for both internal operational needs and external commercial purposes where such use is in accordance with applicable law and essential to the functioning and commercial viability of the Service.
                        </p>
                    </section>

                    {/* External Data Usage */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">External Data Usage</h2>
                        <p className="text-gray-700 leading-relaxed">
                            E3WORLD LTD reserves the right to share, license, or otherwise disseminate aggregated, anonymized, or otherwise non-personally identifiable data to third parties for research, marketing, and commercial purposes. Where personal data is to be shared externally in identifiable form, explicit consent will be sought unless otherwise permitted by law or regulatory exemption.
                        </p>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We retain user data for the duration necessary to fulfil the purposes outlined in this Policy, or as required by law, whichever is longer. Data may be retained for analytics, backup, and legal obligations even after account termination, except where deletion is lawfully requested by the user.
                        </p>
                    </section>

                    {/* Security of Data */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Security of Data</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We implement appropriate administrative, technical, and physical safeguards to protect your personal data against unauthorized access, disclosure, alteration, and destruction. Despite these efforts, no security measure is completely infallible, and you acknowledge this risk by using the Service.
                        </p>
                    </section>

                    {/* Data Subject Rights */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Subject Rights</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            In accordance with applicable data protection laws, you have the right to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Access, rectify, or erase your personal data</li>
                            <li>Restrict or object to certain processing activities</li>
                            <li>Request data portability</li>
                            <li>Withdraw consent where processing is based on consent</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Requests to exercise these rights must be sent to hello@e3world.co.uk and will be handled within statutory timeframes.
                        </p>
                    </section>

                    {/* Additional Information */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Information</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Amendments to Policy</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            E3WORLD LTD reserves the right to amend this Privacy Policy at any time without prior notice. Continued use of the Service constitutes acceptance of any revised Policy. Users are encouraged to review this document periodically.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Governing Law</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            This Privacy Policy shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Processing Legal Basis</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Our processing of your personal data is based on legitimate interests for providing our service, contractual necessity for service delivery, and your explicit consent where required by law.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="bg-gray-50 rounded-xl p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                        <p className="text-gray-700 leading-relaxed">
                            For queries, concerns, or to exercise your data protection rights, contact:
                        </p>
                        <div className="mt-3">
                            <p className="font-semibold text-gray-900">E3WORLD LTD</p>
                            <p className="text-gray-700">Email: hello@e3world.co.uk</p>
                        </div>
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Data Deletion:</strong> To request permanent deletion of your personal data, please email us at hello@e3world.co.uk. We will process your request within 30 calendar days in accordance with applicable data protection laws.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default FullPrivacyPage;