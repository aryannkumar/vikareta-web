import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Support - Vikareta',
  description: 'Comprehensive support and resources for businesses on Vikareta B2B Marketplace',
};

export default function BusinessSupportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Business Support Center</h1>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Account Management</h2>
            <ul className="space-y-3">
              <li><a href="#business-verification" className="text-blue-600 hover:underline">Business verification process</a></li>
              <li><a href="#profile-setup" className="text-blue-600 hover:underline">Complete profile setup</a></li>
              <li><a href="#document-upload" className="text-blue-600 hover:underline">Document upload guidelines</a></li>
              <li><a href="#account-settings" className="text-blue-600 hover:underline">Account settings & preferences</a></li>
              <li><a href="#subscription" className="text-blue-600 hover:underline">Subscription & billing</a></li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Product Management</h2>
            <ul className="space-y-3">
              <li><a href="#product-listing" className="text-green-600 hover:underline">Bulk product listing</a></li>
              <li><a href="#catalog-management" className="text-green-600 hover:underline">Catalog management tools</a></li>
              <li><a href="#inventory-sync" className="text-green-600 hover:underline">Inventory synchronization</a></li>
              <li><a href="#pricing-tools" className="text-green-600 hover:underline">Dynamic pricing tools</a></li>
              <li><a href="#product-analytics" className="text-green-600 hover:underline">Product performance analytics</a></li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <h2 className="text-xl font-semibold mb-4 text-orange-700">Order & RFQ Management</h2>
            <ul className="space-y-3">
              <li><a href="#rfq-handling" className="text-orange-600 hover:underline">RFQ response best practices</a></li>
              <li><a href="#bulk-orders" className="text-orange-600 hover:underline">Processing bulk orders</a></li>
              <li><a href="#payment-terms" className="text-orange-600 hover:underline">Payment terms management</a></li>
              <li><a href="#shipping-logistics" className="text-orange-600 hover:underline">Shipping & logistics</a></li>
              <li><a href="#order-tracking" className="text-orange-600 hover:underline">Order tracking system</a></li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">Marketing & Growth</h2>
            <ul className="space-y-3">
              <li><a href="#business-promotion" className="text-purple-600 hover:underline">Business promotion tools</a></li>
              <li><a href="#seo-optimization" className="text-purple-600 hover:underline">SEO optimization tips</a></li>
              <li><a href="#trade-shows" className="text-purple-600 hover:underline">Virtual trade shows</a></li>
              <li><a href="#buyer-connect" className="text-purple-600 hover:underline">Buyer connect programs</a></li>
              <li><a href="#analytics-reports" className="text-purple-600 hover:underline">Business analytics reports</a></li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-semibold mb-4 text-red-700">Technical Support</h2>
            <ul className="space-y-3">
              <li><a href="#api-integration" className="text-red-600 hover:underline">API integration guide</a></li>
              <li><a href="#mobile-app" className="text-red-600 hover:underline">Mobile app tutorials</a></li>
              <li><a href="#troubleshooting" className="text-red-600 hover:underline">Common issues & fixes</a></li>
              <li><a href="#system-updates" className="text-red-600 hover:underline">System updates & maintenance</a></li>
              <li><a href="#data-export" className="text-red-600 hover:underline">Data export & backup</a></li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Financial Services</h2>
            <ul className="space-y-3">
              <li><a href="#trade-finance" className="text-indigo-600 hover:underline">Trade finance options</a></li>
              <li><a href="#working-capital" className="text-indigo-600 hover:underline">Working capital loans</a></li>
              <li><a href="#insurance" className="text-indigo-600 hover:underline">Trade insurance coverage</a></li>
              <li><a href="#gst-compliance" className="text-indigo-600 hover:underline">GST compliance tools</a></li>
              <li><a href="#invoice-management" className="text-indigo-600 hover:underline">Invoice management</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-semibold mb-6">Need Personal Assistance?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-blue-100">business-support@vikareta.com</p>
              <p className="text-sm text-blue-200">Response within 4 hours</p>
            </div>

            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-blue-100">+91 98765 43210</p>
              <p className="text-sm text-blue-200">Mon-Sat 9AM-8PM IST</p>
            </div>

            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-blue-100">Available 24/7</p>
              <button className="mt-2 bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors">
                Start Chat
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-sm border p-4">
              <summary className="font-semibold cursor-pointer">How long does business verification take?</summary>
              <p className="mt-2 text-gray-600">Business verification typically takes 24-48 hours after submitting all required documents. Our team reviews GST certificates, business registration, and other compliance documents.</p>
            </details>
            
            <details className="bg-white rounded-lg shadow-sm border p-4">
              <summary className="font-semibold cursor-pointer">What documents are required for business registration?</summary>
              <p className="mt-2 text-gray-600">Required documents include GST certificate, business registration certificate, PAN card, bank account details, and authorized signatory documents.</p>
            </details>
            
            <details className="bg-white rounded-lg shadow-sm border p-4">
              <summary className="font-semibold cursor-pointer">How can I bulk upload my product catalog?</summary>
              <p className="mt-2 text-gray-600">Use our Excel template to bulk upload products. Download the template from your dashboard, fill in product details, and upload. Our system supports up to 10,000 products per upload.</p>
            </details>
            
            <details className="bg-white rounded-lg shadow-sm border p-4">
              <summary className="font-semibold cursor-pointer">What are the commission charges?</summary>
              <p className="mt-2 text-gray-600">Commission varies by category, ranging from 2-8% on successful transactions. Premium members get reduced commission rates and additional benefits.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}