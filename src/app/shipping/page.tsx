import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Information - Vikareta',
  description: 'Shipping policies and information for Vikareta marketplace',
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shipping Information</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shipping Policy</h2>
            <p className="mb-4">
              At Vikareta, we work with verified suppliers who handle shipping directly to buyers. 
              Shipping terms and costs are determined by individual sellers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Delivery Timeframes</h2>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <ul className="space-y-2">
                <li><strong>Local (Same City):</strong> 1-2 business days</li>
                <li><strong>Regional (Same State):</strong> 2-4 business days</li>
                <li><strong>National:</strong> 3-7 business days</li>
                <li><strong>Remote Areas:</strong> 5-10 business days</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600">
              *Delivery times may vary based on product availability, location, and shipping method chosen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shipping Costs</h2>
            <p className="mb-4">
              Shipping costs are calculated based on:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Product weight and dimensions</li>
              <li>Delivery location</li>
              <li>Shipping method selected</li>
              <li>Order value (some sellers offer free shipping above certain amounts)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Tracking Your Order</h2>
            <p className="mb-4">
              Once your order is shipped, you will receive a tracking number via email and SMS. 
              You can track your order status in your account dashboard.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Special Shipping Requirements</h2>
            <p className="mb-4">
              For bulk orders, hazardous materials, or special handling requirements, 
              please contact the seller directly to discuss shipping arrangements.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}