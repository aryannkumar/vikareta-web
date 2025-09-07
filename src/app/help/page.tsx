import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center - Vikareta',
  description: 'Get help and support for Vikareta B2B Marketplace',
};

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Help Center</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">How to create an account</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Setting up your profile</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Verifying your business</a></li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">For Buyers</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">How to search for products</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Placing an order</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Managing RFQs</a></li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">For Businesses</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Adding products</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Managing orders</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Business dashboard guide</a></li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
            <p className="mb-4">Need more help? Our support team is here to assist you.</p>
            <div className="space-y-2">
              <p><strong>Email:</strong> support@vikareta.com</p>
              <p><strong>Phone:</strong> +91-9934109996</p>
              <p><strong>Hours:</strong> Mon-Fri 9AM-6PM IST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}