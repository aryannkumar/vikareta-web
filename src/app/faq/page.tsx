import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://vikareta.com'),
  title: 'FAQ - Vikareta',
  description: 'Frequently asked questions about Vikareta B2B Marketplace',
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">What is Vikareta?</h3>
            <p className="text-gray-600">
              Vikareta is India's leading B2B marketplace that connects verified suppliers 
              with buyers across various industries. We facilitate secure transactions and 
              help businesses grow through our platform.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">How do I create an account?</h3>
            <p className="text-gray-600">
              Click on "Sign Up" and choose whether you want to register as a buyer or seller. 
              Fill in your business details, verify your email and phone number, and complete 
              the verification process.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Is it free to use Vikareta?</h3>
            <p className="text-gray-600">
              Basic registration and browsing are free. Sellers can list products for free, 
              but we charge a small commission on successful transactions. Premium features 
              and advertising options are available at additional cost.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">How do I verify my business?</h3>
            <p className="text-gray-600">
              After registration, upload your business documents such as GST certificate, 
              trade license, and bank details. Our verification team will review and approve 
              your account within 2-3 business days.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">What is an RFQ?</h3>
            <p className="text-gray-600">
              RFQ stands for Request for Quotation. Buyers can post their requirements, 
              and multiple suppliers can submit quotes. This helps buyers get competitive 
              prices and find the best suppliers for their needs.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">How are payments processed?</h3>
            <p className="text-gray-600">
              We support various payment methods including bank transfers, UPI, and digital 
              wallets. All transactions are secure and protected by our payment gateway partners.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">What if I have a dispute?</h3>
            <p className="text-gray-600">
              Our customer support team is available to help resolve any disputes between 
              buyers and sellers. We have a structured dispute resolution process to ensure 
              fair outcomes for all parties.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">How can I contact support?</h3>
            <p className="text-gray-600">
              You can reach our support team via email at support@vikareta.com, 
              call us at +91-9934109996, or use the contact form on our website. 
              We're available Monday to Friday, 9 AM to 6 PM IST.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}