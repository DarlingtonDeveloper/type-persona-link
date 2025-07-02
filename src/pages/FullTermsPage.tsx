import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FullTermsPage: React.FC = () => {
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
                        <div className="w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Terms and Conditions
                        </h1>
                        <p className="text-gray-600">E3WORLD LTD — The Circle World</p>
                        <p className="text-sm text-gray-500 mt-2">Effective Date: 28 June 2025</p>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border p-8 space-y-8">

                    {/* Introduction */}
                    <section>
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to The Circle World, a proprietary product and service offering developed by E3WORLD LTD ("we," "our," or "us"). These Terms and Conditions ("Terms") and Privacy Policy ("Policy") govern your access to and use of our products, services, websites, applications, devices, and associated data management systems (collectively, the "Service").
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Please read these Terms and Policy carefully before accessing, using, or providing any personal data to us. By using the Service, you acknowledge, agree, and consent to be legally bound by these Terms and this Policy.
                        </p>
                    </section>

                    {/* Scope of Service */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Scope of Service</h2>
                        <p className="text-gray-700 leading-relaxed">
                            The Service provides users with the ability to create smart links, answer personal questions, and maintain a personal profile page integrating NFC and web-based technology. The Service requires the collection, storage, and operational use of personal and sensitive data to provide a functional and optimised user experience.
                        </p>
                    </section>

                    {/* User Obligations */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Obligations</h2>
                        <p className="text-gray-700 leading-relaxed">
                            By engaging with the Service, you warrant that you are at least 18 years of age and possess the legal capacity to enter into binding agreements. You agree to provide accurate, current, and complete information when requested, and to keep such information up to date at all times.
                        </p>
                    </section>

                    {/* Device Lifespan and Warranty */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Device Lifespan and Warranty</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Our proprietary devices are engineered to maintain operational integrity for a period exceeding five (5) years under standard usage conditions. Users acknowledge and accept that no refunds will be issued after ten (10) calendar days from the date of purchase or activation, whichever comes later.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Post a five-year operational period, users may request a device replacement for a nominal fee, provided that the device has ceased to function through no fault or misuse on the part of the user.
                        </p>
                    </section>

                    {/* Risks Associated with NFC Technology */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Risks Associated with NFC Technology</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            E3WORLD LTD makes reasonable efforts to ensure that its NFC technology is safe and secure for intended consumer use. However, by using the Service, you acknowledge and accept the following potential risks:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Interference from other electronic devices or magnetic fields</li>
                            <li>Unauthorized data interception if used in unsecured public spaces</li>
                            <li>Possible exposure to electromagnetic fields (EMF) within permissible regulatory limits</li>
                            <li>Functional disruption due to physical damage or environmental factors</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            E3WORLD LTD shall not be liable for any indirect, incidental, or consequential damages arising from the use or misuse of the device, nor from health-related effects allegedly associated with NFC technology.
                        </p>
                    </section>

                    {/* Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed">
                            While E3WORLD LTD employs industry-standard security measures to safeguard personal and sensitive data, no system is entirely immune from unauthorized access or breaches. You expressly agree that E3WORLD LTD shall not be held liable for any data breaches, loss, or corruption of personal data. Notwithstanding this, E3WORLD LTD commits to exhaust all reasonable resources to prevent, identify, and mitigate any such occurrences.
                        </p>
                    </section>

                    {/* Data Deletion Rights */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Deletion Rights</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Users may request the permanent deletion of their stored personal data by submitting a written request via email to hello@e3world.co.uk. E3WORLD LTD shall process such requests within thirty (30) calendar days in accordance with applicable data protection laws.
                        </p>
                    </section>

                    {/* Additional Policies */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Policies</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Amendments to Terms and Policy</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            E3WORLD LTD reserves the right to amend these Terms and this Policy at any time without prior notice. Continued use of the Service constitutes acceptance of any revised Terms or Policy. Users are encouraged to review these documents periodically.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Governing Law</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            These Terms and this Policy shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Entire Agreement</h3>
                        <p className="text-gray-700 leading-relaxed">
                            These Terms and this Policy constitute the entire agreement between the parties in relation to the Service and supersede all prior agreements, arrangements, or understandings.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="bg-gray-50 rounded-xl p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                        <p className="text-gray-700 leading-relaxed">
                            For queries or concerns, contact:
                        </p>
                        <div className="mt-3">
                            <p className="font-semibold text-gray-900">E3WORLD LTD</p>
                            <p className="text-gray-700">Email: hello@e3world.co.uk</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default FullTermsPage;