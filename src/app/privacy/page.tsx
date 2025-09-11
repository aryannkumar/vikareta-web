import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://vikareta.com'),
  title: 'Privacy Policy - Vikareta',
  description: 'Privacy Policy for Vikareta B2B Marketplace',
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 mb-6">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                        <p className="mb-4">
                            At Vikareta, we collect information to provide better services to our users.
                            This includes personal information you provide when registering, business information,
                            and usage data to improve our platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                        <p className="mb-4">
                            We use the information we collect to operate, maintain, and improve our B2B marketplace,
                            facilitate transactions between buyers and sellers, and provide customer support.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
                        <p className="mb-4">
                            We do not sell, trade, or otherwise transfer your personal information to third parties
                            without your consent, except as described in this privacy policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                        <p className="mb-4">
                            If you have any questions about this Privacy Policy, please contact us at{' '}
                            <a href="mailto:privacy@vikareta.com" className="text-blue-600 hover:underline">
                                privacy@vikareta.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}