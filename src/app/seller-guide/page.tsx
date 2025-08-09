import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seller Guide - Vikareta',
  description: 'Complete guide for sellers on Vikareta B2B Marketplace',
};

export default function SellerGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Seller Guide</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Getting Started as a Seller</h2>
            <p className="mb-4">
              Welcome to Vikareta! This guide will help you set up your seller account 
              and start selling to thousands of buyers across India.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Step 1: Account Registration</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Create your seller account with business details</li>
              <li>Verify your email and phone number</li>
              <li>Complete business verification process</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Step 2: Product Listing</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Add high-quality product images</li>
              <li>Write detailed product descriptions</li>
              <li>Set competitive pricing</li>
              <li>Specify minimum order quantities</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Step 3: Managing Orders</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Respond to RFQs promptly</li>
              <li>Process orders efficiently</li>
              <li>Maintain good communication with buyers</li>
              <li>Ensure timely delivery</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Keep your product catalog updated</li>
              <li>Respond to inquiries within 24 hours</li>
              <li>Maintain competitive pricing</li>
              <li>Provide excellent customer service</li>
              <li>Build trust through verified credentials</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}