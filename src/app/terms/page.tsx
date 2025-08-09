import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Vikareta',
  description: 'Terms of Service for Vikareta B2B Marketplace',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Vikareta, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily use Vikareta for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <p className="mb-4">
              Users are responsible for maintaining the confidentiality of their account 
              information and for all activities that occur under their account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@vikareta.com" className="text-blue-600 hover:underline">
                legal@vikareta.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}