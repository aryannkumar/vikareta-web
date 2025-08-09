import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertising - Vikareta',
  description: 'Advertise your products on Vikareta B2B Marketplace',
};

export default function AdvertisingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Advertising on Vikareta</h1>
        
        <div className="mb-8">
          <p className="text-lg text-gray-600 mb-6">
            Boost your business visibility and reach more buyers with our advertising solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Featured Listings</h3>
            <p className="text-gray-600 mb-4">
              Get your products featured at the top of search results and category pages.
            </p>
            <div className="text-2xl font-bold text-blue-600 mb-4">₹999/month</div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Get Started
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Premium Placement</h3>
            <p className="text-gray-600 mb-4">
              Showcase your business in premium sections across the platform.
            </p>
            <div className="text-2xl font-bold text-blue-600 mb-4">₹1,999/month</div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Get Started
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Banner Ads</h3>
            <p className="text-gray-600 mb-4">
              Display banner advertisements on high-traffic pages.
            </p>
            <div className="text-2xl font-bold text-blue-600 mb-4">₹4,999/month</div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Why Advertise with Vikareta?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Targeted Reach</h3>
              <p className="text-gray-600">Reach buyers actively searching for your products</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Increased Visibility</h3>
              <p className="text-gray-600">Stand out from competitors with premium placement</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Better ROI</h3>
              <p className="text-gray-600">Track performance and optimize your campaigns</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">Get help from our advertising specialists</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}