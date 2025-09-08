import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Guide - Vikareta',
  description: 'Complete guide for businesses on Vikareta B2B Marketplace',
};

export default function BusinessGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Business Guide</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Getting Started as a Business</h2>
            <p className="mb-4">
              Welcome to Vikareta! This comprehensive guide will help you set up your business account 
              and start selling to thousands of buyers across India's largest B2B marketplace.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Step 1: Business Registration</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Create your business account with complete company details</li>
              <li>Upload required documents (GST certificate, business registration)</li>
              <li>Verify your business email and phone number</li>
              <li>Complete the business verification process</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Step 2: Product Catalog Setup</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Add high-quality product images and videos</li>
              <li>Write detailed product descriptions with specifications</li>
              <li>Set competitive wholesale pricing</li>
              <li>Specify minimum order quantities (MOQ)</li>
              <li>Configure bulk pricing tiers</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Step 3: Managing B2B Orders</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Respond to RFQs (Request for Quotations) promptly</li>
              <li>Process bulk orders efficiently</li>
              <li>Maintain professional communication with buyers</li>
              <li>Ensure timely delivery and logistics coordination</li>
              <li>Handle payment terms and credit arrangements</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Step 4: Building Your Business Profile</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Complete your company profile with certifications</li>
              <li>Add business credentials and awards</li>
              <li>Showcase manufacturing capabilities</li>
              <li>Display quality certifications (ISO, etc.)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Business Best Practices</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Keep your product catalog updated with latest inventory</li>
              <li>Respond to business inquiries within 4-6 hours</li>
              <li>Maintain competitive wholesale pricing</li>
              <li>Provide excellent B2B customer service</li>
              <li>Build trust through verified business credentials</li>
              <li>Offer flexible payment terms for bulk orders</li>
              <li>Maintain consistent product quality</li>
              <li>Provide detailed product specifications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Business Types We Support</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Manufacturers</h4>
                <p className="text-sm">Direct from factory pricing, custom manufacturing, bulk production capabilities</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Wholesalers</h4>
                <p className="text-sm">Bulk distribution, inventory management, multi-brand offerings</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Distributors</h4>
                <p className="text-sm">Regional distribution, supply chain management, territory coverage</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Exporters</h4>
                <p className="text-sm">International trade, export documentation, global shipping</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Growth Opportunities</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Access to pan-India buyer network</li>
              <li>Government tender opportunities</li>
              <li>Export opportunities through trade connect</li>
              <li>Business analytics and insights</li>
              <li>Marketing and promotional tools</li>
              <li>Trade finance and working capital solutions</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}