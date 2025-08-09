import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seller Support - Vikareta',
  description: 'Support and resources for sellers on Vikareta',
};

export default function SellerSupportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Seller Support</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Account Management</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Update business information</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Verification process</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Account settings</a></li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Product Management</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Adding new products</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Updating product information</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Managing inventory</a></li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Management</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Processing orders</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Shipping and delivery</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Handling returns</a></li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Get Help</h2>
            <p className="mb-4">Need assistance? Our seller support team is here to help.</p>
            <div className="space-y-2">
              <p><strong>Email:</strong> seller-support@vikareta.com</p>
              <p><strong>Phone:</strong> +91 98765 43211</p>
              <p><strong>Hours:</strong> Mon-Sat 9AM-7PM IST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}